import { _decorator, Component, Node, Vec3, CCFloat } from 'cc';
import { PlayerSquadManager } from '../PlayerSquadManager';
import { BossManager } from '../BossManager';
import { MovementComponent } from '../characters/components/MovementComponent';
import { RoleComponent } from '../characters/components/RoleComponent';
import { RoleType } from '../common/Enums';

const { ccclass, property } = _decorator;

/**
 * FormationManager
 * 负责为近战/坦克角色分配围绕 Boss 的槽位。
 * 槽位仅决定角色的「期望位置」，角色本身依旧依靠 MovementComponent 执行 Arrive 行为，
 * 因此可以边走边砍，或在 Boss 移动/死亡时自动重新调整站位。
 * 
 * 分配流程：
 * 1. 每隔 formationUpdateInterval 秒，扫描存活角色与 Boss；
 * 2. 按先后顺序为近战/Tank 角色分配槽位（环形，支持多圈）；
 * 3. 调用角色的 MovementComponent.moveTo(slotPos) 设置移动目标；
 * 4. 远程 / 治疗暂不分槽位，可扩展为外围圈或自由逻辑。
 */
@ccclass('FormationManager')
export class FormationManager extends Component {

    @property({
        type: PlayerSquadManager,
        tooltip: '玩家小队管理器'
    })
    squadManager: PlayerSquadManager | null = null;

    @property({
        type: BossManager,
        tooltip: 'Boss 管理器'
    })
    bossManager: BossManager | null = null;

    @property({
        type: CCFloat,
        tooltip: '第一圈槽位半径(px)'
    })
    firstRingRadius: number = 80;

    @property({
        type: CCFloat,
        tooltip: '每一圈之间增加的半径(px)'
    })
    ringSpacing: number = 60;

    @property({
        type: CCFloat,
        tooltip: '槽位更新间隔(秒)'
    })
    formationUpdateInterval: number = 0.4;

    private _timer: number = 0;
    // 保存角色与槽位索引映射，避免每帧"抢位"
    private _unitSlotMap: Map<Node, number> = new Map();

    // 记录每个槽位当前占用的角色，方便检测空位
    private _slotUnitMap: Map<number, Node> = new Map();

    protected onLoad() {
        if (!this.squadManager) {
            this.squadManager = PlayerSquadManager.instance;
        }
    }

    protected update(dt: number) {
        this._timer += dt;
        if (this._timer < this.formationUpdateInterval) return;
        this._timer = 0;
        this.updateFormation();
    }

    /**
     * 为近战/坦克角色分配槽位
     */
    private updateFormation() {
        if (!this.squadManager) return;
        const players = this.squadManager.getAlivePlayerCharacters();
        if (players.length === 0) return;

        // 目标点：最近的活跃 Boss 或默认 (0,0)
        let targetPos = new Vec3();
        const bossNode = this.bossManager?.getNearestBoss(new Vec3()) ?? null;
        if (bossNode) {
            targetPos = bossNode.worldPosition;
        }

        // ---------- 1. 收集近战可移动单元 ----------
        const meleeUnits: { node: Node; move: MovementComponent; }[] = [];
        for (const p of players) {
            const role = p.getComponent(RoleComponent);
            if (!role) continue;
            if (role.role === RoleType.MELEE_DPS || role.role === RoleType.TANK) {
                const move = p.getComponent(MovementComponent);
                if (move) meleeUnits.push({ node: p, move });
            }
        }
        if (meleeUnits.length === 0) return;

        // ---------- 2. 检查已分配槽位映射是否有失效 ----------
        // 清理死亡 / 离场角色
        this._unitSlotMap.forEach((slotIdx, n) => {
            if (!n.isValid || players.indexOf(n) === -1) {
                this._unitSlotMap.delete(n);
                this._slotUnitMap.delete(slotIdx);
            }
        });

        // ---------- 3. 为新角色分配空余槽位 ----------
        for (const u of meleeUnits) {
            if (this._unitSlotMap.has(u.node)) continue; // 已有槽位

            // 寻找第一个空槽位
            let slotIdx = 0;
            while (this._slotUnitMap.has(slotIdx)) slotIdx++;

            this._unitSlotMap.set(u.node, slotIdx);
            this._slotUnitMap.set(slotIdx, u.node);
        }

        // ---------- 4. 计算槽位位置并驱动角色移动 ----------
        this._unitSlotMap.forEach((slotIdx, n) => {
            if (!n.isValid) return;
            const move = n.getComponent(MovementComponent);
            if (!move) return;

            // 计算所在环/角度
            let remaining = slotIdx;
            let ring = 0;
            let slotsInRing = 6;
            while (remaining >= slotsInRing) {
                remaining -= slotsInRing;
                ring++;
                slotsInRing += 4;
            }
            const angleRad = (remaining / slotsInRing) * Math.PI * 2;
            const radius = this.firstRingRadius + this.ringSpacing * ring;

            const pos = new Vec3(
                targetPos.x + Math.cos(angleRad) * radius,
                targetPos.y + Math.sin(angleRad) * radius,
                0
            );
            move.moveTo(pos);
        });
    }
} 