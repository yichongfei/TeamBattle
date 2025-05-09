import { _decorator, Component, Node, Vec3 } from 'cc';
import { CharacterStats } from './CharacterStats'; // 获取攻击力、攻速、范围
import { TargetingComponent } from './TargetingComponent'; // 获取当前目标
import { HealthComponent } from './HealthComponent'; // 对目标造成伤害 (通过 IDamageable)
import { ITargetable, IDamageable } from '../../common/Interfaces';
import { DamageType } from '../../common/Enums';

const { ccclass, property } = _decorator;

/**
 * 负责处理角色的普通攻击逻辑。
 * 根据攻速计时，在范围内有有效目标时执行攻击。
 */
@ccclass('AttackComponent')
export class AttackComponent extends Component {

    @property(CharacterStats)
    private stats: CharacterStats = null;

    @property(TargetingComponent)
    private targeting: TargetingComponent = null;

    // --- 内部状态 ---
    private _attackTimer: number = 0;
    private _isAttackReady: boolean = true;
    private _isAttacking: boolean = false; // 由 AI 控制是否应该攻击
    private attackCount: number = 0; // DEBUG: Count attacks

    start() {
        if (!this.stats) {
            this.enabled = false;
            return;
        }
        if (!this.targeting) {
            this.enabled = false;
            return;
        }
    }

    update(deltaTime: number) {
        if (!this.enabled || !this.stats || !this.targeting) return;

        if (!this._isAttackReady) {
            this._attackTimer -= deltaTime;
            if (this._attackTimer <= 0) {
                this._isAttackReady = true;
            }
        }

        if (this._isAttacking) {
            if (this._isAttackReady) {
                this.tryAttack();
            }
        }
    }

    // --- 由 AIComponent 调用 ---
    public startAttacking(): void {
        if (!this._isAttacking) {
            this._isAttacking = true;
        }
    }

    public stopAttacking(): void {
        if (this._isAttacking) {
            this._isAttacking = false;
        }
    }

    // --- 内部攻击逻辑 ---
    private tryAttack(): void {
        const target = this.targeting.getCurrentTarget();
        if (!target) return;
    
        const targetNode = target.getNode();
        if (!targetNode || !targetNode.isValid) return;
    
        const distSq = Vec3.squaredDistance(this.node.worldPosition, targetNode.worldPosition);
        if (distSq > this.stats.attackRange * this.stats.attackRange) return;   // 超出范围
    
        /* 若需要速度阈值，可删掉或放宽 */
    
        this.performAttack(target);
    }

    private performAttack(target: ITargetable): void {
        this.attackCount++;
        const targetNode = target.getNode();
        if (!targetNode) return;
        const damageable = targetNode.getComponent(HealthComponent) as IDamageable;
        if (!damageable) return;
        const attackerStats = this.stats;
        if (!attackerStats) return;

        this._isAttackReady = false;
        const attackInterval = 1.0 / Math.max(0.1, attackerStats.attackSpeed);
        this._attackTimer = attackInterval;

        this.node.emit('play-animation', 'attack', false);

        const baseDamage = attackerStats.getCurrentAttackPower(); 
        const critChance = attackerStats.getCurrentCritChance(); 
        const isCrit = Math.random() < critChance;
        let potentialDamage = baseDamage;

        if (isCrit) {
            potentialDamage *= attackerStats.critDamageMultiplier;
        }

        const attackType = DamageType.PHYSICAL;

        this.scheduleOnce(() => {
             const currentDamageable = targetNode.getComponent(HealthComponent) as IDamageable;
             if (currentDamageable && currentDamageable.isAlive()) {
                 currentDamageable.applyDamage(potentialDamage, attackType, isCrit, this.node);
             } 
        }, 0.1); 
    }

    // --- 公共接口 ---
    public isAttackReady(): boolean {
        return this._isAttackReady;
    }
} 