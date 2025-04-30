import { _decorator, Component, log, warn } from 'cc';
// import { SkillBase } from '../skills/SkillBase'; // 基础技能类或接口
// import { CharacterStats } from './CharacterStats'; // 可能需要获取施法速度、冷却缩减等
// import { TargetingComponent } from './TargetingComponent'; // 获取当前目标以供技能使用

const { ccclass, property } = _decorator;

// 内部用于追踪技能状态的数据结构
interface SkillRuntimeInfo {
    // skill: SkillBase;
    cooldownTimer: number;
    isReady: boolean;
}

/**
 * 管理角色拥有的技能列表、冷却时间和使用请求。
 * AIComponent 会查询此组件以决定是否使用技能，并请求使用。
 */
@ccclass('SkillComponent')
export class SkillComponent extends Component {

    // @property([SkillAsset]) // TODO: 如何在编辑器中配置技能列表? (可能需要自定义资源类型 SkillAsset)
    // skillAssets: SkillAsset[] = [];

    // @property(CharacterStats)
    // private stats: CharacterStats = null;

    // @property(TargetingComponent)
    // private targeting: TargetingComponent = null;

    // --- 内部状态 ---
    private _skills: Map<string, SkillRuntimeInfo> = new Map(); // 使用技能 ID 作为 key

    start() {
        // TODO: 从 skillAssets 初始化 _skills Map
        // for (const asset of this.skillAssets) {
        //     const skill = createSkillInstance(asset); // 需要一个工厂方法
        //     if (skill) {
        //         this._skills.set(skill.id, {
        //             skill: skill,
        //             cooldownTimer: 0,
        //             isReady: true
        //         });
        //     }
        // }
        warn("SkillComponent initialization from assets not implemented!");
    }

    update(deltaTime: number) {
        // 更新所有技能的冷却时间
        for (const info of this._skills.values()) {
            if (!info.isReady) {
                // TODO: 应用冷却缩减 (stats.cooldownReduction)
                info.cooldownTimer -= deltaTime;
                if (info.cooldownTimer <= 0) {
                    info.isReady = true;
                    // log(`[${this.node.name}] Skill [${info.skill.id}] is ready.`); // 暂时注释，因为 SkillBase 未定义
                    // 发出技能就绪事件?
                    // this.node.emit('skill-ready', info.skill.id);
                }
            }
        }
    }

    // --- 由 AIComponent 调用 --- (或由玩家输入调用)

    /**
     * 查询指定 ID 的技能是否已准备好可以使用 (冷却完毕且满足基本条件)。
     * @param skillId 技能的唯一 ID
     */
    public isSkillReady(skillId: string): boolean {
        const info = this._skills.get(skillId);
        if (!info) return false;
        // TODO: 后续可以检查资源 (MP), 施法状态等
        return info.isReady;
    }

    /**
     * 尝试使用指定 ID 的技能。
     * AI 会调用这个方法，内部会进行最终的条件检查 (目标、距离、资源等)。
     * @param skillId 要尝试使用的技能 ID
     * @returns 如果成功开始施法或立即生效，则返回 true；否则返回 false。
     */
    public tryUseSkill(skillId: string): boolean {
        const info = this._skills.get(skillId);
        if (!info || !info.isReady) {
            log(`[${this.node.name}] Attempted to use skill [${skillId}] but it's not ready or doesn't exist.`);
            return false;
        }

        // const skill = info.skill;
        // const target = this.targeting?.getCurrentTarget(); // 获取当前目标

        // TODO: 1. 检查技能所需的目标类型是否匹配当前目标
        // if (!skill.checkTargetType(target)) return false;

        // TODO: 2. 检查施法距离
        // const targetNode = target?.getNode();
        // if (!skill.checkRange(this.node.worldPosition, targetNode?.worldPosition)) return false;

        // TODO: 3. 检查资源消耗 (MP, 能量等)
        // if (!this.stats?.hasEnoughResource(skill.cost)) return false;

        // --- 所有条件满足，开始执行技能 --- 
        log(`[${this.node.name}] Using skill [${skillId}]...`);

        // a. 消耗资源
        // this.stats.consumeResource(skill.cost);

        // b. 进入冷却
        info.isReady = false;
        info.cooldownTimer = 10; // skill.getCooldown(this.stats); // 获取计算冷却缩减后的CD

        // c. 播放施法动画 (如果需要前摇)
        // this.node.emit('play-animation', skill.castAnimationName, false);

        // d. 执行技能效果 (可能需要延迟以匹配施法动画)
        // const castTime = skill.getCastTime(this.stats);
        // if (castTime > 0) {
        //      // 进入施法状态 (通知 AI 或其他组件)
        //      this.node.emit('enter-state', CharacterState.CASTING);
        //      this.scheduleOnce(() => {
        //          this.executeSkillEffect(skill, target);
        //          this.node.emit('exit-state', CharacterState.CASTING);
        //      }, castTime);
        // } else {
        //      // 瞬发技能
        //      this.executeSkillEffect(skill, target);
        // }

        warn(`Skill execution logic for [${skillId}] not implemented!`);
        this.scheduleOnce(() => { this.executeSkillEffectPlaceholder(skillId); }, 0.1); // 临时占位

        return true;
    }

    // 临时的技能效果执行占位符
    private executeSkillEffectPlaceholder(skillId: string): void {
        log(`Skill [${skillId}] effect triggered (Placeholder).`);
        // TODO: 实现真正的技能效果逻辑
        // - 应用伤害/治疗 (target.applyDamage / target.applyHeal)
        // - 添加 Buff/Debuff
        // - 产生特效
    }

    // --- 公共接口 ---
    // public getSkillInfo(skillId: string): SkillRuntimeInfo | undefined {
    //     return this._skills.get(skillId);
    // }
}

// --- 辅助类型/接口 (未来可能移到 skills/ 目录下) ---

// interface SkillAsset {
//     // 定义用于在编辑器中配置技能的数据结构
//     id: string;
//     prefab?: Prefab; // 技能特效预制体?
//     // ... 其他配置数据
// }

// function createSkillInstance(asset: SkillAsset): SkillBase | null {
//     // 根据 SkillAsset 创建具体的 SkillBase 实例
//     // 可能需要一个技能注册表或工厂模式
//     return null;
// } 