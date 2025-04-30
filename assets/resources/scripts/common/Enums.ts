import { _decorator } from 'cc';

/**
 * 角色定位类型
 */
export enum RoleType {
    MELEE_DPS,  // 近战输出
    RANGED_DPS, // 远程输出
    TANK,       // 坦克
    HEALER,     // 治疗
    // 可以根据需要添加更多类型，如辅助、控制等
}

/**
 * 角色状态 (可以根据需要细化)
 * 这个可以替代 CharacterControl.ts 里的旧枚举
 */
export enum CharacterState {
    IDLE,       // 待机
    MOVING,     // 移动中
    ATTACKING,  // 攻击中
    CASTING,    // 施法中 (技能前摇)
    STUNNED,    // 眩晕
    DEAD,       // 死亡
    // ... 其他状态
}

/**
 * 目标类型 (用于技能或索敌)
 */
export enum TargetType {
    ENEMY,      // 敌人
    ALLY,       // 友方
    SELF,       // 自己
    POINT,      // 地面点
    AREA,       // 区域
    NONE,       // 无目标
}

/**
 * 技能目标类型 (更具体，用于技能定义)
 */
export enum SkillTargetType {
    SINGLE_ENEMY,   // 单个敌人
    SINGLE_ALLY,    // 单个友方
    SELF,           // 仅自己
    GROUND_POINT,   // 地面点
    CONE_ENEMY,     // 锥形范围敌人
    CIRCLE_ENEMY,   // 圆形范围敌人
    CIRCLE_ALLY,    // 圆形范围友方
    // ... 其他类型
}

/**
 * 攻击类型 (用于伤害计算或效果区分)
 */
export enum AttackType {
    PHYSICAL,   // 物理
    MAGICAL,    // 魔法
    TRUE,       // 真实伤害
    // ... 其他
}

// 如果需要，可以在这里添加更多全局使用的枚举
// 例如：阵营 (Faction), 资源类型 (ResourceType: Mana, Energy, Rage) 等 