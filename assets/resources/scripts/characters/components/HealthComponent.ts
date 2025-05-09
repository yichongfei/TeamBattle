import { _decorator, Component, Node, Vec3, director } from 'cc';
import { IDamageable, IHealable, ITargetable } from '../../common/Interfaces';
import { DamageType, CharacterState } from '../../common/Enums';
import { CharacterStats } from './CharacterStats'; // 可能需要获取最大生命值
// import { AIComponent } from '../ai/AIComponent'; // 可能需要通知 AI 死亡

const { ccclass, property } = _decorator;

/**
 * 管理角色的生命值、受伤、治疗和死亡逻辑。
 * 实现 IDamageable, IHealable 和 ITargetable 接口。
 */
@ccclass('HealthComponent')
export class HealthComponent extends Component implements IDamageable, IHealable, ITargetable {

    @property(CharacterStats)
    private stats: CharacterStats = null;

    // @property(AIComponent) // 或者通过事件通知
    // private aiComponent: AIComponent = null;

    private _currentHealth: number = 0;
    private _isAlive: boolean = true;

    start() {
        if (!this.stats) {
            console.warn(`HealthComponent on [${this.node.name}] requires a CharacterStats component.`);
            this.enabled = false;
            return;
        }
        this._currentHealth = this.stats.maxHealth;
        this._isAlive = true;
        console.log(`[${this.node.name}] HealthComponent initialized with ${this._currentHealth} HP.`);
    }

    // --- IDamageable Implementation ---
    applyDamage(potentialDamage: number, type: DamageType, isCrit: boolean, source?: Node): void {
        if (!this._isAlive) return;

        const targetStats = this.stats;
        if (!targetStats) {
            console.warn(`[${this.node.name}] HealthComponent missing CharacterStats. Cannot calculate damage reduction.`);
            return;
        }

        let finalDamage = potentialDamage;
        if (type === DamageType.PHYSICAL) {
            const armor = targetStats.getCurrentArmor();
            const reductionFactor = 500;
            const damageReduction = armor / (armor + reductionFactor);
            finalDamage = potentialDamage * (1 - damageReduction);
        } else if (type === DamageType.MAGICAL) {
            // TODO: 实现基于魔法抗性的减伤
        } else if (type === DamageType.TRUE) {
            // 真实伤害无视防御和抗性
        }

        finalDamage = Math.max(0, finalDamage);

        const oldHealth = this._currentHealth;
        this._currentHealth -= finalDamage;
        this._currentHealth = Math.max(0, this._currentHealth);

        console.log(`[${this.node.name}] took ${finalDamage.toFixed(0)} ${type} damage (Crit: ${isCrit}), HP: ${this._currentHealth.toFixed(0)}/${targetStats.maxHealth}`);

        director.emit('final-damage-applied', {
            targetNode: this.node,
            sourceNode: source,
            damage: finalDamage,
            damageType: type,
            isCrit: isCrit,
        });

        if (finalDamage > 0 && source && source.isValid) {
            const attackerStats = source.getComponent(CharacterStats);
            const attackerHealth = source.getComponent(HealthComponent);
            if (attackerStats && attackerHealth) {
                const lifestealRatio = attackerStats.getCurrentLifesteal();
                if (lifestealRatio > 0) {
                    const lifestealAmount = finalDamage * lifestealRatio;
                    attackerHealth.applyHeal(lifestealAmount, this.node);
                }
            }
        }

        if (oldHealth > 0 && this._currentHealth <= 0) {
            this.handleDeath(source);
        }
    }

    isAlive(): boolean {
        return this._isAlive;
    }

    // --- IHealable Implementation ---
    applyHeal(amount: number, source?: Node): void {
        if (!this._isAlive || !this.stats || this._currentHealth >= this.stats.maxHealth) return;

        const healAmount = Math.max(0, amount);
        const finalHealAmount = healAmount;

        const oldHealth = this._currentHealth;
        this._currentHealth = Math.min(this.stats.maxHealth, this._currentHealth + finalHealAmount);
        const actualHealed = this._currentHealth - oldHealth;

        if (actualHealed > 0.1) {
            console.log(`[${this.node.name}] received ${actualHealed.toFixed(0)} healing from [${source?.name ?? 'Unknown'}], HP: ${this._currentHealth.toFixed(0)}/${this.stats.maxHealth}`);
            director.emit('final-heal-applied', {
                targetNode: this.node,
                sourceNode: source,
                healAmount: actualHealed,
            });
        }
    }

    // --- ITargetable Implementation ---
    getNode(): Node {
        return this.node;
    }

    getPosition(): Vec3 {
        return this.node.worldPosition;
    }

    // --- 死亡处理 ---
    private handleDeath(killer?: Node): void {
        if (!this._isAlive) return;

        this._isAlive = false;
        console.log(`[${this.node.name}] has died.`);

        this.node.emit('character-died', killer);
        this.node.emit('play-animation', 'die', false);
    }

    // --- 公共接口 (Getter) ---
    public getCurrentHealth(): number {
        return this._currentHealth;
    }

    public getMaxHealth(): number {
        return this.stats ? this.stats.maxHealth : 0;
    }

    public getHealthPercentage(): number {
        if (!this.stats || this.stats.maxHealth <= 0) return 0;
        return this._currentHealth / this.stats.maxHealth;
    }
} 