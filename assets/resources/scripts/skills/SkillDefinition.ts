import { TargetType, EffectType,  DamageType } from "../common/Enums"; // 修正导入路径

/**
 * 技能效果的具体参数
 */
export interface EffectParameter {
    // --- 根据 EffectType 定义具体参数结构 ---
    // 伤害示例:
    baseDamage?: number;        // 基础伤害值
    damageType?: DamageType;    // 伤害类型 (物理, 火焰等)
    damageMultiplierStat?: string; // 伤害加成关联的角色属性名 (可选, 例如 'attackPower')
    // Buff 示例:
    buffId?: string;            // Buff 定义的 ID (引用另一个 BuffDefinition)
    duration?: number;          // 持续时间
    // 投射物示例:
    projectilePrefabName?: string; // 投射物预制体名称
    speed?: number;             // 投射物速度
    // ... 其他效果类型
}

/**
 * 技能的静态数据定义
 */
export interface SkillDefinition {
    id: string;                     // 技能唯一标识符 (例如 "cleave", "fireball", "heal_light")
    name: string;                   // 技能显示名称
    description: string;            // 技能描述 (用于 UI Tooltip)
    icon?: string;                  // 图标资源引用 (可选)
    actionLockoutDuration?: number; // 技能动作锁定时间 (秒, 默认为 0 表示没有锁定)
    targetType: TargetType;         // 技能可以指向的目标类型 (敌人, 友方, 自身, 地点, 无)
    range: number;                  // 最大施法距离 (0 表示自身或无需目标)
    cooldown: number;               // 基础冷却时间 (秒)
    castTime?: number;              // 施法前摇时间 (秒, 默认为 0 表示瞬发)
    cost?: { resource: string, amount: number }; // 资源消耗 (可选, 例如 { resource: 'mana', amount: 10 })

    animationName: string;          // 需要播放的 Spine 动画名称
    animationDuration?: number;     // 动画持续时间 (可选, 如果需要精确控制时序)

    effects: {                      // 技能效果列表
        type: EffectType;           // 效果类型 (伤害, 治疗, Buff, Debuff, 生成投射物等)
        parameters: EffectParameter;// 该效果类型所需的具体参数
        delay?: number;             // 效果触发延迟 (可选, 在 castTime 之后计算)
        targetOverride?: TargetType;// 效果目标覆盖 (可选, 例如范围效果作用于目标周围)
    }[];
}
