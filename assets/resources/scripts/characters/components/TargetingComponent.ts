import { _decorator, Component, Node, Vec3 } from 'cc';
import { RoleComponent } from './RoleComponent'; // 需要根据角色定位选择目标
import { HealthComponent } from './HealthComponent'; // 需要判断目标或友方是否存活/低血量
import { ITargetable } from '../../common/Interfaces';
import { RoleType } from '../../common/Enums';
import { BossManager } from '../../BossManager'; // User confirmed this import works

const { ccclass, property } = _decorator;

/**
 * 负责为角色选择合适的目标 (敌人或友方)。
 * 其逻辑会根据角色定位 (RoleComponent) 和战场信息变化。
 */
@ccclass('TargetingComponent')
export class TargetingComponent extends Component {

    @property(RoleComponent)
    private role: RoleComponent = null;

    // --- 使用用户添加的 BossManager 节点引用 ---
    @property({
        type: BossManager,
        tooltip: '全局 Boss 管理器节点，用于获取敌方 Boss 列表'
    })
    bossManagerComponent: BossManager | null = null;
    // --

    // --- 索敌参数 ----
    aggroRadius: number = 0 ;

    @property({
        type: Number,
        tooltip: '搜索友方 (治疗目标) 的最大范围，0 表示无限'
    })
    healRadius: number = 1000;

    // --- 内部状态 ---
    private _currentTarget: ITargetable | null = null; // 当前选定的目标
    private _searchTimer: number = 0;
    private readonly SEARCH_INTERVAL: number = 0.5; // 每隔多少秒重新索敌一次

    start() {
        if (!this.role) {
            console.warn(`[${this.node.name}] 的 TargetingComponent 需要一个 RoleComponent。`);
            this.enabled = false;
            return;
        }
        if (!this.bossManagerComponent) {
            console.warn(`[${this.node.name}] 的 TargetingComponent 需要在编辑器中链接 'Boss Manager Component' 属性。`);
        } else {
            console.log(`[${this.node.name}] TargetingComponent 已链接 BossManager。`);
        }
    }

    update(deltaTime: number) {
        this._searchTimer += deltaTime;
        if (this._searchTimer >= this.SEARCH_INTERVAL) {
            this._searchTimer = 0;
            this.findBestTarget();
        }

        if (this._currentTarget && !this.isTargetValid(this._currentTarget)) {
            console.log(`[${this.node.name}] 当前目标不再有效。`);
            this.clearTarget();
            this.findBestTarget(); // 立刻尝试寻找新目标
        }
    }

    // --- 核心索敌逻辑 ---
    private findBestTarget(): void {
        let bestTarget: ITargetable | null = null;

        switch (this.role.role) {
            case RoleType.MELEE_DPS:
            case RoleType.RANGED_DPS:
            case RoleType.TANK:
                bestTarget = this.findNearestEnemy();
                // TODO: TANK 可能需要考虑仇恨最高的敌人
                break;
            case RoleType.HEALER:
                bestTarget = this.findLowestHealthAlly();
                break;
            // ... 其他角色类型
        }

        if (bestTarget && bestTarget !== this._currentTarget) {
            this.setTarget(bestTarget);
        } else if (!bestTarget && this._currentTarget) {
            // 如果找不到新目标，但之前有目标，则清除
            // 但也许不清除更好？让角色停留在原地？取决于设计
            // this.clearTarget();
        }
    }

    private findNearestEnemy(): ITargetable | null {
        if (!this.bossManagerComponent) {
            console.warn(`[${this.node.name}] TargetingComponent: BossManagerComponent not linked or invalid.`);
            return null;
        }

        let bosses: Node[] = [];
        try {
            bosses = this.bossManagerComponent.getActiveBosses();
        } catch (e) {
            console.warn(`[${this.node.name}] TargetingComponent: Error calling getActiveBosses():`, e);
            return null;
        }

        if (!bosses || bosses.length === 0) {
            return null; // 没有 Boss 可以作为目标
        }

        let nearestEnemy: ITargetable | null = null;
        let minDistanceSq = this.aggroRadius > 0 ? this.aggroRadius * this.aggroRadius : Infinity;

        for (const bossNode of bosses) {
            if (!bossNode || !bossNode.isValid) {
                continue;
            }

            const healthComp = bossNode.getComponent(HealthComponent);
            if (!healthComp) {
                continue;
            }
            if (!healthComp.isAlive()) {
                continue;
            }

            // 确保目标实现了 ITargetable (HealthComponent 应该实现它)
            // 在 TypeScript 中，接口不能直接检查，但我们可以假定 HealthComponent 符合要求
            // 如果需要更严格，可以添加一个标记属性或方法到 ITargetable
            const targetable = healthComp as ITargetable; 

            const distanceSq = Vec3.squaredDistance(this.node.worldPosition, targetable.getPosition());

            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                nearestEnemy = targetable;
            }
            else {
            }
        }

        if (!nearestEnemy) {
           
        }
        return nearestEnemy;
    }

    // (Placeholder for faction check - needs implementation)
    // private isEnemyFaction(targetNode: Node): boolean {
    //     // Simple check: assumes anything not self is enemy for now
    //     return targetNode !== this.node;
    // }

    private findLowestHealthAlly(): ITargetable | null {
        console.warn(`[${this.node.name}] TargetingComponent: findLowestHealthAlly() not implemented!`);
        return null;
    }

    // --- 目标管理 ---
    private setTarget(target: ITargetable): void {
        if (this._currentTarget === target) return;
        const oldTarget = this._currentTarget;
        this._currentTarget = target;
        console.log(`[${this.node.name}] TargetingComponent: Acquired new target: [${target.getNode()?.name ?? 'Unknown'}]`);
        this.node.emit('target-changed', this._currentTarget, oldTarget);
    }

    /**
     * 清除当前目标。
     * 由 AIComponent 在发现目标无效时调用，或 TargetingComponent 内部调用。
     */
    public clearTarget(): void {
        if (!this._currentTarget) return;
        console.log(`[${this.node.name}] TargetingComponent: Target cleared.`);
        const oldTarget = this._currentTarget;
        this._currentTarget = null;
        this.node.emit('target-changed', null, oldTarget);
    }

    private isTargetValid(target: ITargetable | null): boolean {
        if (!target || !target.getNode() || !target.getNode().isValid) {
            return false;
        }
        // 检查目标是否存活
        const healthComp = target.getNode().getComponent(HealthComponent);
        if (!healthComp || !healthComp.isAlive()) {
            return false;
        }

        // 可以添加其他检查，例如距离、是否在视野内等
        // const distance = Vec3.distance(this.node.worldPosition, target.getPosition());
        // if (this.role.role === RoleType.HEALER && distance > this.healRadius) return false;
        // if (this.role.role !== RoleType.HEALER && distance > this.aggroRadius * 1.2) return false; // 加个缓冲，防止目标在边缘反复丢失

        return true;
    }

    // --- 公共接口 ---
    public getCurrentTarget(): ITargetable | null {
        // 返回前再次校验有效性
        if (!this.isTargetValid(this._currentTarget)) {
            this._currentTarget = null; // 内部清除无效目标
        }
        return this._currentTarget;
    }
}

// Helper function (需要实现或放到 GameManager/Service Locator)
// function findManager<T extends Component>(type: new () => T): T | null {
//     // 实现查找逻辑，例如通过场景查找特定节点或使用单例
//     return null;
// } 