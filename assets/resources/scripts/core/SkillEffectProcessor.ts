import { _decorator, Component, Node, warn, log } from 'cc';
import { GlobalEvent } from './events/GlobalEvent';
import { SkillDefinition, EffectParameter } from '../skills/SkillDefinition';
import { ITargetable } from '../common/Interfaces';
import { EffectType, DamageType } from '../common/Enums';
import { HealthComponent } from '../characters/components/HealthComponent';
import { CharacterStats } from '../characters/components/CharacterStats';

const { ccclass, property } = _decorator;

interface ExecuteSkillEventData {
    casterNode: Node;
    skillDefinition: SkillDefinition;
    target: ITargetable | null; // 目标可能为 null (例如范围技能或无目标技能)
    // 如果是地点技能，可能还需要一个 targetPosition: Vec3
}

@ccclass('SkillEffectProcessor')
export class SkillEffectProcessor extends Component {

    onLoad() {
        GlobalEvent.on('execute-skill', this.onExecuteSkill, this);
        log('SkillEffectProcessor loaded and listening for execute-skill events.');
    }

    onDestroy() {
        GlobalEvent.off('execute-skill', this.onExecuteSkill, this);
        log('SkillEffectProcessor destroyed and unregistered from execute-skill events.');
    }

    private onExecuteSkill(data: ExecuteSkillEventData) {
        if (!data || !data.casterNode || !data.skillDefinition) {
            warn('SkillEffectProcessor: Received invalid execute-skill event data.');
            return;
        }

        const { casterNode, skillDefinition, target } = data;
        log(`SkillEffectProcessor: Processing skill [${skillDefinition.name}] cast by [${casterNode.name}]`);

        for (const effect of skillDefinition.effects) {
            // 处理效果延迟 (如果 effect.delay > 0)
            // 为了简单起见，我们暂时忽略 effect.delay 和 skillDefinition.castTime 的精确时序同步
            // 假设 SkillComponent 发出 execute-skill 时 castTime 已经结束，effect.delay 从此刻开始计时

            if (effect.delay && effect.delay > 0) {
                this.scheduleOnce(() => {
                    this.applyEffect(casterNode, target, skillDefinition, effect.type, effect.parameters);
                }, effect.delay);
            } else {
                this.applyEffect(casterNode, target, skillDefinition, effect.type, effect.parameters);
            }
        }
    }

    private applyEffect(casterNode: Node, target: ITargetable | null, skillDef: SkillDefinition, effectType: EffectType, params: EffectParameter) {
        log(`Applying effect: ${EffectType[effectType]} for skill [${skillDef.name}]`);

        switch (effectType) {
            case EffectType.DAMAGE:
                this.handleDamageEffect(casterNode, target, params);
                break;
            // case EffectType.HEAL:
            //     this.handleHealEffect(casterNode, target, params);
            //     break;
            // case EffectType.BUFF:
            //     this.handleBuffEffect(casterNode, target, params);
            //     break;
            // case EffectType.SPAWN_PROJECTILE:
            //     this.handleSpawnProjectileEffect(casterNode, target, skillDef, params);
            //     break;
            default:
                warn(`SkillEffectProcessor: EffectType [${EffectType[effectType]}] not implemented yet.`);
                break;
        }
    }

    private handleDamageEffect(casterNode: Node, target: ITargetable | null, params: EffectParameter) {
        if (!target) {
            // TODO: 处理范围伤害或无目标伤害的情况
            // 例如，如果 skillDef.targetType 是 AREA, 应该在这里查询范围内的所有有效目标
            warn(`SkillEffectProcessor: Damage effect for [${params.baseDamage}] needs a target, but target is null. Skill might be an AoE or require target override.`);
            return;
        }

        const targetNode = target.getNode();
        if (!targetNode || !targetNode.isValid) {
            warn('SkillEffectProcessor: Target node for damage effect is invalid.');
            return;
        }

        const targetHealth = targetNode.getComponent(HealthComponent);
        if (!targetHealth || !targetHealth.isAlive()) {
            log('SkillEffectProcessor: Target is already dead or has no HealthComponent.');
            return;
        }

        const casterStats = casterNode.getComponent(CharacterStats);
        if (!casterStats) {
            warn(`SkillEffectProcessor: Caster [${casterNode.name}] has no CharacterStats component.`);
            return;
        }

        let finalDamage = params.baseDamage || 0;
        const damageType = params.damageType || DamageType.PHYSICAL; // 默认为物理伤害

        // 应用属性加成
        if (params.damageMultiplierStat) {
            // 简化的属性获取，实际项目中可能需要更完善的 getStatValue 方法
            let statValue = 0;
            if (params.damageMultiplierStat === 'attackPower') {
                statValue = casterStats.getCurrentAttackPower ? casterStats.getCurrentAttackPower() : casterStats.attackPower;
            } else if (params.damageMultiplierStat === 'skillPower') {
                statValue = casterStats.skillPower; // 假设直接用基础值
            }
            // 这里的加成方式只是一个示例，实际可以更复杂
            // 例如： finalDamage += statValue * 某种系数; 或者 finalDamage *= (1 + statValue * 0.01) 等
             finalDamage += statValue; // 简单加法示例
            log(`Damage effect: baseDamage=${params.baseDamage}, stat=${params.damageMultiplierStat}, statValue=${statValue}, total before reduction=${finalDamage}`);
        }


        // TODO: 实现暴击判断逻辑 (可以基于 casterStats.critChance)
        const isCrit = false; // 技能暂时不暴击，除非在 SkillDefinition 中定义或有特殊机制

        targetHealth.applyDamage(finalDamage, damageType, isCrit, casterNode);
        log(`SkillEffectProcessor: Applied ${finalDamage} ${DamageType[damageType]} damage to [${targetNode.name}] from [${casterNode.name}]. Crit: ${isCrit}`);

    }

    // Future effect handlers:
    // private handleHealEffect(casterNode: Node, target: ITargetable | null, params: EffectParameter) { /* ... */ }
    // private handleBuffEffect(casterNode: Node, target: ITargetable | null, params: EffectParameter) { /* ... */ }
    // private handleSpawnProjectileEffect(casterNode: Node, target: ITargetable | null, skillDef: SkillDefinition, params: EffectParameter) { /* ... */ }

} 