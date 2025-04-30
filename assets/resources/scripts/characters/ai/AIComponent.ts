import { _decorator, Component, Vec3, Node, CCFloat } from 'cc';
import { CharacterStats } from '../components/CharacterStats';
import { HealthComponent } from '../components/HealthComponent';
import { MovementComponent } from '../components/MovementComponent';
import { TargetingComponent } from '../components/TargetingComponent';
import { AttackComponent } from '../components/AttackComponent';
import { SkillComponent } from '../components/SkillComponent';
import { RoleComponent } from '../components/RoleComponent';
import { CharacterState } from '../../common/Enums';
import { ITargetable } from '../../common/Interfaces';
import { PlayerSquadManager } from '../../PlayerSquadManager';
// PlayerSquadManager 暂时不再直接用于此脚本的核心逻辑
// import { PlayerSquadManager } from '../../PlayerSquadManager'; 

const { ccclass, property } = _decorator;

@ccclass('AIComponent')
export class AIComponent extends Component {

    // --- 核心组件引用 ---
    @property(CharacterStats)
    private stats: CharacterStats = null;
    @property(HealthComponent)
    private health: HealthComponent = null;
    @property(MovementComponent)
    private movement: MovementComponent = null;
    @property(TargetingComponent)
    private targeting: TargetingComponent = null;
    @property(AttackComponent)
    private attack: AttackComponent = null;
    @property(SkillComponent)
    private skills: SkillComponent = null;
    @property(RoleComponent)
    private role: RoleComponent = null;

    // --- 区域控制参数 ---
    @property({
        type: Vec3,
        tooltip: '战斗舞台的中心点 (世界坐标)'
    })
    stageCenter: Vec3 = new Vec3(0, 0, 0);

    @property({
        type: CCFloat, // 确认 CCFloat 是否导入，如果报错则添加
        tooltip: '角色允许活动的最大半径 (距离舞台中心)',
        min: 0
    })
    maxDistanceFromCenter: number = 500; // 示例半径

    // --- 内部状态 ---
    private _currentState: CharacterState = CharacterState.IDLE;
    private _isActive: boolean = true;
    private _currentTarget: ITargetable | null = null; // 缓存当前目标，用于检测目标失效

    onLoad() {
        // 确保所有必要的组件都存在
        // 使用 getComponent 获取引用，以防编辑器未链接
        this.stats = this.getComponent(CharacterStats);
        this.health = this.getComponent(HealthComponent);
        this.movement = this.getComponent(MovementComponent);
        this.targeting = this.getComponent(TargetingComponent);
        this.attack = this.getComponent(AttackComponent);
        this.skills = this.getComponent(SkillComponent);
        this.role = this.getComponent(RoleComponent);

        if (!this.stats || !this.health || !this.movement || !this.targeting || !this.attack || !this.skills || !this.role) {
            console.warn(`AIComponent on [${this.node.name}] is missing one or more required components. Disabling AI.`);
            this._isActive = false;
            this.enabled = false;
            return;
        }

        // --- PlayerSquadManager 注册不再需要，因为 AI 不再查询索引 ---
        const squadManager = PlayerSquadManager.instance;
        if (squadManager) {
            squadManager.addCharacter(this.node);
        } else {
            console.warn(`[${this.node.name}] AIComponent: Could not find PlayerSquadManager instance to register.`);
        }
    }

    start() {
        if (!this._isActive) return;
        this.health.node.on('character-died', this.onCharacterDied, this);
        this.targeting.node.on('target-changed', this.onTargetChanged, this);
        console.log(`AIComponent on [${this.node.name}] initialized and active.`);
        this.changeState(CharacterState.IDLE);
    }

    update(deltaTime: number) {
        if (!this._isActive || this._currentState === CharacterState.DEAD || this._currentState === CharacterState.STUNNED) {
            return;
        }
        this.runSimplePlaceholderLogic(deltaTime);
    }

    // --- 行为树/状态机逻辑 (注释掉) ---
    // private initializeBehaviorTree() { ... }
    // private runStateMachineLogic(deltaTime: number) { ... }

    // --- 简单 AI 逻辑 (回归简化版) ---
    private runSimplePlaceholderLogic(deltaTime: number) {
        const target = this.targeting.getCurrentTarget();
        const targetNode = target?.getNode();
        const isSelfAlive = this.health?.isAlive() ?? false;

        if (target && isSelfAlive && targetNode && targetNode.isValid) {
            const bossPosition = target.getPosition();
            const distanceToBoss = Vec3.distance(this.node.worldPosition, bossPosition);
            const attackRange = this.stats.attackRange;
            // 定义一个非常小的缓冲距离，防止在边缘抖动
            const attackRangeBuffer = 5;

            // --- 移动目标点现在直接是 Boss 位置 (考虑区域限制) ---
            const squadMgr = PlayerSquadManager.instance;
            const myIndex = squadMgr ? squadMgr.getSquadIndex(this.node) : 0;
            const squadSize = Math.max(1, squadMgr ? squadMgr.getTotalSquadSize() : 1);

            // 站位半径：比攻击距离略小，让武器打得到
            const ringRadius = this.stats.attackRange * 0.8;

            // 均分 360°，每人一个角度槽
            const angle = (Math.PI * 2 / squadSize) * myIndex;

            // 计算在环上的目标点
            let finalMoveTarget = bossPosition.clone();
            finalMoveTarget.x += Math.cos(angle) * ringRadius;
            finalMoveTarget.y += Math.sin(angle) * ringRadius;
            const distFromCenter = Vec3.distance(finalMoveTarget, this.stageCenter);
            if (this.maxDistanceFromCenter > 0 && distFromCenter > this.maxDistanceFromCenter) {
                const directionFromCenter = finalMoveTarget.clone().subtract(this.stageCenter).normalize();
                finalMoveTarget = this.stageCenter.clone().add(directionFromCenter.multiplyScalar(this.maxDistanceFromCenter));
            }
            // ---

            // --- 根据当前状态和距离决定行为 (简化) --- 
            if (distanceToBoss <= attackRange - attackRangeBuffer) {
                // 已经明确在攻击范围内，停止移动并攻击
                if (this._currentState !== CharacterState.ATTACKING) {
                    this.changeState(CharacterState.ATTACKING);
                    this.movement.stopMovement(); // 强制停止
                }
                // 持续确保面向 Boss
                const directionToTargetX = bossPosition.x - this.node.worldPosition.x;
                const currentScaleX = Math.abs(this.node.scale.x);
                this.node.scale = new Vec3(directionToTargetX < 0 ? currentScaleX : -currentScaleX, this.node.scale.y, this.node.scale.z);
                // 确保移动停止
                this.movement.stopMovement();
                this.attack.startAttacking();
            } else {
                // 在攻击范围外，移动向 Boss
                if (this._currentState !== CharacterState.MOVING) {
                    this.changeState(CharacterState.MOVING);
                }
                this.movement.moveTo(finalMoveTarget); // 直接移动到 Boss 位置 (或边界点)
                this.attack.stopAttacking();
            }
            // ---

        } else {
            // Target is null OR character is dead OR targetNode is invalid
            if (!isSelfAlive) { // 如果是自己死了，不做任何操作
                if (this._currentState !== CharacterState.DEAD) this.changeState(CharacterState.DEAD);
                return;
            }
            // 如果是目标无效或消失
            // 修正：使用缓存的 _currentTarget 检查目标是否是刚刚失效
            if (this._currentTarget && target === null) {
                console.warn(`[${this.node.name}] AI Update: Target became null (likely died or cleared).`);
            } else if (targetNode && !targetNode.isValid) { // 目标节点本身失效了
                console.warn(`[${this.node.name}] AI Update: Target node became invalid. Clearing target.`);
                this.targeting.clearTarget(); // 强制清除目标
            }

            // 切换到 IDLE 状态
            if (this._currentState !== CharacterState.IDLE) {
                console.log(`[${this.node.name}] AI DECISION: No valid target. -> IDLE`);
                this.changeState(CharacterState.IDLE);
            }
            this.movement.stopMovement();
            this.attack.stopAttacking();
        }
        // 更新缓存的目标，以便下一帧比较
        this._currentTarget = target;
    }

    // ... (事件处理: onCharacterDied, onTargetChanged)
    private onCharacterDied(killer?: Node): void {
        console.log(`[${this.node.name}] AI received death event. Shutting down.`);
        this._isActive = false;
        this.changeState(CharacterState.DEAD);
        this.movement?.stopMovement();
        this.attack?.stopAttacking();
        // 不需要在这里从 SquadManager 移除，节点销毁时会自动移除
        this.enabled = false;
    }

    private onTargetChanged(newTarget: ITargetable | null, oldTarget: ITargetable | null): void {
        console.log(`[${this.node.name}] AI received target changed event. New target: [${newTarget?.getNode()?.name ?? 'None'}]`);
        // this._currentTarget = newTarget; // 不再需要在这里更新缓存，runSimplePlaceholderLogic 末尾会更新
        // 简单逻辑下，不需要做太多事，update 会自然处理
    }

    // ... (状态管理: changeState, getCurrentState)
    public changeState(newState: CharacterState): void {
        if (this._currentState === newState || this._currentState === CharacterState.DEAD) return;
        // log(`[${this.node.name}] AI State Changed: ${CharacterState[this._currentState]} -> ${CharacterState[newState]}`);
        this._currentState = newState;

        // 根据新状态触发动画事件 (让 CharacterAnimation 监听)
        switch (newState) {
            case CharacterState.IDLE:
                this.node.emit('play-animation', 'idle', true);
                break;
            case CharacterState.MOVING:
                this.node.emit('play-animation', 'run', true);
                break;
            case CharacterState.ATTACKING:
                // 攻击动画由 AttackComponent 在 performAttack 时触发
                // 这里可以触发一个循环的"战斗待机"动画 (如果需要)
                this.node.emit('play-animation', 'idle', true); // 暂时用 idle 代替
                break;
            case CharacterState.CASTING:
                // 施法动画由 SkillComponent 控制
                break;
            case CharacterState.STUNNED:
                this.node.emit('play-animation', 'hit', true); // 假设有受击/眩晕动画
                break;
            case CharacterState.DEAD:
                // 死亡动画由 HealthComponent 在 handleDeath 时触发
                break;
        }
    }

    // ... (getCurrentState, onDestroy)
}