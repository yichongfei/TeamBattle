import { Node, Vec3 } from 'cc';
import { DamageType } from './Enums';

/**
 * 代表可以受到伤害的实体
 */
export interface IDamageable {
    applyDamage(amount: number, type: DamageType, isCrit: boolean, source?: Node): void;
    isAlive(): boolean;
    // 可以添加 getHealth(), getMaxHealth() 等
}

/**
 * 代表可以被治疗的实体
 */
export interface IHealable {
    applyHeal(amount: number, source?: Node): void;
    // 可以添加 getHealth(), getMaxHealth() 等
}

/**
 * 代表可以移动的实体
 */
export interface IMovable {
    moveTo(targetPosition: Vec3): void;
    stopMovement(): void;
    getCurrentSpeed(): number;
    // ... 其他移动相关接口
}

/**
 * 代表可以成为攻击/技能目标的实体
 */
export interface ITargetable {
    getNode(): Node; // 获取关联的节点
    getPosition(): Vec3; // 获取当前位置
    // 可以添加 getTargetingPriority(), getThreatLevel() 等
}

// 这里可以根据需要添加更多接口，例如 IBuffable, IInterruptable 等 