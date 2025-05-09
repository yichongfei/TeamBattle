import { TargetType, EffectType, DamageType } from "../common/Enums";
import { SkillDefinition } from "../skills/SkillDefinition";


/**
 * 存储所有技能定义的数据库
 */
export const SkillDatabase: { [key: string]: SkillDefinition } = {
    "cleave": { // 技能 ID
        id: "cleave",
        name: "顺劈斩",
        description: "对前方小范围敌人造成物理伤害。",
        targetType: TargetType.ENEMY, // 需要敌人目标 (但效果可能是范围)
        range: 50,                   // 近战范围
        cooldown: 5.0,               // 冷却 5 秒
        cost: { resource: "rage", amount: 20 }, // 消耗 20 怒气
        animationName: "attack_heavy", // 播放 "attack_heavy" 动画
        effects: [
            {
                type: EffectType.DAMAGE,       // 效果类型：伤害
                parameters: {
                    baseDamage: 50,            // 基础伤害 50
                    damageType: DamageType.PHYSICAL, // 物理类型
                    damageMultiplierStat: "attackPower" // 伤害受 attackPower 属性加成
                },
                delay: 0.2, // 动画开始 0.2 秒后造成伤害
                // targetOverride: TargetType.AOE_CONE // 如果需要明确是锥形范围，可以加上
            }
        ]
    },
    "fireball": { // 技能 ID
        id: "fireball",
        name: "火球术",
        description: "向目标发射一枚火球，造成火焰伤害。",
        targetType: TargetType.ENEMY, // 需要敌人目标
        range: 400,                  // 远程范围
        cooldown: 3.0,               // 冷却 3 秒
        castTime: 0.5,               // 施法前摇 0.5 秒
        cost: { resource: "mana", amount: 15 }, // 消耗 15 法力
        animationName: "cast_spell",   // 播放 "cast_spell" 动画
        effects: [
            {
                type: EffectType.SPAWN_PROJECTILE, // 效果类型：生成投射物
                parameters: {
                    projectilePrefabName: "FireballProjectile", // 投射物预制体名
                    speed: 500                     // 飞行速度 500
                },
                // 投射物自身的脚本将负责处理命中后的伤害逻辑
            }
        ]
    },
    "heavyStrike": {
        id: "heavyStrike",
        name: "重击",
        description: "对单个目标造成大量物理伤害。",
        targetType: TargetType.ENEMY,       // 目标是敌人
        range: 175,                         // 假设比普攻稍远一点的近战范围
        cooldown: 3.0,                     // 8秒冷却
        castTime: 0.3,                     // 0.3秒施法前摇
        cost: { resource: "rage", amount: 30 }, // 消耗30怒气
        animationName: "skill1", // 假设有一个对应的重击动画
        actionLockoutDuration: 0.8, // 假设这个技能的锁定时间为0.8秒

        effects: [
            {
                type: EffectType.DAMAGE,
                parameters: {
                    baseDamage: 555,                   // 基础伤害120
                    damageType: DamageType.PHYSICAL,
                    damageMultiplierStat: "attackPower" // 受攻击力加成
                },
                delay: 0.1 // 动画开始0.1秒后（在施法前摇结束后）造成伤害
            }
            // 可以添加第二个效果，比如短暂击晕目标
            // {
            //     type: EffectType.DEBUFF, // 假设我们有 DEBUFF 效果类型
            //     parameters: {
            //         buffId: "stun_short", // 引用一个击晕 Buff 的定义
            //         duration: 0.5
            //     },
            //     delay: 0.1
            // }
        ]
    },
    // --- 在这里添加更多技能定义 ---
};

/**
 * 根据 ID 获取技能定义的辅助函数
 * @param id 技能 ID
 * @returns 找到的技能定义，如果不存在则返回 null
 */
export function getSkillDefinition(id: string): SkillDefinition | null {
    return SkillDatabase[id] || null;
}
