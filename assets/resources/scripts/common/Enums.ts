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
export enum DamageType {
    PHYSICAL,   // 物理
    MAGICAL,    // 魔法
    TRUE,       // 真实伤害
    // ... 其他
}

/**
 * 技能效果类型
 */
export enum EffectType {
    DAMAGE,             // 造成伤害
    HEAL,               // 恢复生命
    BUFF,               // 施加增益效果
    DEBUFF,             // 施加减益效果
    SPAWN_PROJECTILE,   // 生成投射物
    SPAWN_UNIT,         // 召唤单位
    TELEPORT,           // 位移/传送
    APPLY_FORCE,        // 施加力 (击退/吸引)
    // ... 可以根据需要添加更多效果类型
}

/**
 * 阵营类型
 */
export enum Faction {
    PLAYER,     // 玩家或玩家队伍
    ENEMY,      // AI 敌人
    NEUTRAL,    // 中立单位 (可选)
    // 未来可以扩展为 PLAYER_TEAM_1, PLAYER_TEAM_2 等
}

// 如果需要，可以在这里添加更多全局使用的枚举
// 例如：阵营 (Faction), 资源类型 (ResourceType: Mana, Energy, Rage) 等 