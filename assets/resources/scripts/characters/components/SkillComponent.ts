import { _decorator, Component, log, warn, Node, Vec3 } from 'cc';
import { CharacterStats } from './CharacterStats';         // 假设存在，用于处理消耗和冷却缩减
import { TargetingComponent } from './TargetingComponent'; // 用于获取目标
import { ITargetable } from '../../common/Interfaces';    // 导入目标接口
import { TargetType } from '../../common/Enums';           // 导入目标类型枚举
import { getSkillDefinition } from '../../data/SkillDatabase';
import { SkillDefinition } from '../../skills/SkillDefinition';
import { GlobalEvent } from '../../core/events/GlobalEvent'; // 从单例文件导入
import { FactionUtils } from '../../common/FactionUtils'; // 导入阵营工具类

const { ccclass, property } = _decorator;

/**
 * 技能运行时的状态数据
 */
interface SkillRuntimeData {
    id: string;             // 技能 ID
    cooldownTimer: number;  // 当前剩余冷却时间
    isReady: boolean;       // 是否冷却完毕可用
}

/**
 * 管理角色拥有的技能列表、冷却时间和使用请求。
 * AIComponent 会查询此组件以决定是否使用技能，并请求使用。
 */
@ccclass('SkillComponent')
export class SkillComponent extends Component {

    @property({ type: [String], tooltip: '角色拥有的技能 ID 列表' })
    knownSkillIDs: string[] = []; // 在编辑器中配置该角色学会了哪些技能

    @property({ type: CharacterStats, tooltip: '关联的角色属性组件' })
    private stats: CharacterStats | null = null;

    @property({ type: TargetingComponent, tooltip: '关联的目标选择组件' })
    private targeting: TargetingComponent | null = null;

    // 存储技能运行时数据的 Map
    private _runtimeSkills: Map<string, SkillRuntimeData> = new Map();

    private _actionLockoutTimer: number = 0;

    start() {
        if (!this.stats) warn(`[${this.node.name}] 的 SkillComponent 缺失 CharacterStats 组件引用`);
        if (!this.targeting) warn(`[${this.node.name}] 的 SkillComponent 缺失 TargetingComponent 组件引用`);

        this.initializeSkills(); // 初始化技能列表
    }

    /**
     * 根据 knownSkillIDs 初始化运行时的技能数据
     */
    initializeSkills() {
        this._runtimeSkills.clear();
        for (const id of this.knownSkillIDs) {
            const definition = getSkillDefinition(id);
            if (definition) {
                this._runtimeSkills.set(id, {
                    id: id,
                    cooldownTimer: 0, // 初始冷却为 0
                    isReady: true,    // 初始可用
                });
                log(`[${this.node.name}] 已学习技能: ${definition.name} (ID: ${id})`);
            } else {
                warn(`未在 SkillDatabase 中找到技能定义，ID: ${id}`);
            }
        }
    }

    update(deltaTime: number) {
        // 更新所有技能的冷却时间
        for (const runtimeData of this._runtimeSkills.values()) {
            if (!runtimeData.isReady) {
                // TODO: 如果需要，在这里应用来自 CharacterStats 的冷却缩减 (CDR)
                // const cdr = this.stats?.getCurrentCooldownReduction() ?? 0;
                // runtimeData.cooldownTimer -= deltaTime * (1 + cdr);
                runtimeData.cooldownTimer -= deltaTime; // 简单减去时间

                if (runtimeData.cooldownTimer <= 0) {
                    runtimeData.isReady = true;
                    log(`[${this.node.name}] 技能 [${runtimeData.id}] 冷却完毕`);
                    // 可选: 触发一个全局事件通知 UI 或 AI 技能已就绪
                    // GlobalEvent.emit('skill-ready', { character: this.node, skillId: runtimeData.id });
                }
            }
        }
    }

    /**
     * 检查技能是否可能被使用（仅检查冷却和基础资源，不做目标和范围检查）
     * @param skillId 要检查的技能 ID
     * @returns 如果冷却完毕且基础资源足够（如果需要的话），返回 true
     */
    public canPotentiallyUseSkill(skillId: string): boolean {
        const runtimeData = this._runtimeSkills.get(skillId);
        if (!runtimeData || !runtimeData.isReady) return false; // 冷却中或未学习

        const definition = getSkillDefinition(skillId);
        if (!definition) return false; // 找不到定义

        // 可选：基础资源检查
        if (definition.cost && this.stats) {
            if (!this.stats.hasEnoughResource(definition.cost.resource, definition.cost.amount)) {
                // log(`技能 [${skillId}] 资源不足: ${definition.cost.resource}`);
                return false;
            }
        }

        return true; // 冷却好了，资源也够（或不需要资源）
    }

    /**
     * 尝试使用技能，会进行所有检查（冷却、资源、目标、范围）
     * 如果成功，则消耗资源、设置冷却并触发事件
     * @param skillId 要尝试使用的技能 ID
     * @returns 如果成功开始使用技能，返回 true，否则返回 false
     */
    public tryUseSkill(skillId: string): boolean {
        debugger;
        const runtimeData = this._runtimeSkills.get(skillId);
        if (!runtimeData || !runtimeData.isReady) {
            // log(`技能 [${skillId}] 未就绪 (冷却中)`);
            return false; // 冷却中
        }

        const definition = getSkillDefinition(skillId);
        if (!definition) {
            warn(`尝试使用未定义的技能，ID: ${skillId}`);
            return false; // 无此技能定义
        }

        const target = this.targeting?.getCurrentTarget(); // 获取当前目标
        const targetNode = target?.getNode(); // 获取目标节点 (可能为 null)

        // --- 1. 检查目标类型是否符合要求 ---
        if (!this.isTargetTypeValid(definition, target)) {
            // log(`技能 [${skillId}] 的目标类型无效`);
            return false;
        }

        // --- 2. 检查施法距离 ---
        if (definition.range > 0 && definition.targetType !== TargetType.SELF && definition.targetType !== TargetType.NONE) {
            if (!targetNode) {
                // log(`技能 [${skillId}] 需要目标但当前没有有效目标`);
                return false; // 需要目标但没有目标
            }
            const distSq = Vec3.squaredDistance(this.node.worldPosition, targetNode.worldPosition);
            if (distSq > definition.range * definition.range) {
                // log(`技能 [${skillId}] 的目标超出范围`);
                return false; // 超出范围
            }
        }
        // (如果 targetType 是 POINT，还需要检查施法点是否在范围内)

        // --- 3. 检查并尝试消耗资源 ---
        if (definition.cost && this.stats) {
            if (!this.stats.tryConsumeResource(definition.cost.resource, definition.cost.amount)) {
                log(`技能 [${skillId}] 资源不足: ${definition.cost.resource}`);
                return false; // 资源不足
            }
            // 资源已消耗
            log(`消耗资源: ${definition.cost.amount} ${definition.cost.resource}`);
        }

        // --- 所有检查通过，正式使用技能！ ---
        log(`[${this.node.name}] 正在使用技能: ${definition.name} (ID: ${skillId})`);

        // a. 进入冷却
        runtimeData.isReady = false;
        // TODO: 应用 CDR 计算最终冷却时间
        runtimeData.cooldownTimer = definition.cooldown;

        // b. 触发动画播放事件 (修改为在节点自身触发)
        this.node.emit('play-animation', definition.animationName, false); // loop 通常为 false
        log(`触发节点动画事件: ${definition.animationName}`);

        // c. 根据施法时间延迟触发技能效果执行事件
        const castTime = definition.castTime ?? 0;
        this.scheduleOnce(() => {
            log(`技能 [${skillId}] 效果触发 (延迟 ${castTime} 秒)`);
            GlobalEvent.emit('execute-skill', {
                casterNode: this.node,         // 施法者
                skillDefinition: definition,   // 使用的技能定义
                target: target                 // 目标 (ITargetable 接口实例)
                // (如果 targetType 是 POINT，这里应该传递坐标)
            });
        }, castTime);

        // 可选: 如果有施法前摇，可以触发进入施法状态的事件
        // if (castTime > 0) {
        //    this.node.emit('enter-state', CharacterState.CASTING, castTime);
        // }

        return true; // 技能成功启动
    }

    /**
     * 内部辅助函数，检查当前目标是否符合技能要求的目标类型
     */
    private isTargetTypeValid(definition: SkillDefinition, target: ITargetable | null): boolean {
        const targetNode = target?.getNode();
        switch (definition.targetType) {
            case TargetType.ENEMY:
                // 需要目标存在，且目标是敌人
                return !!targetNode && targetNode.isValid && FactionUtils.isEnemy(this.node, targetNode);
            case TargetType.ALLY:
                // 需要目标存在，且目标是友方 (且不是自己)
                return !!targetNode && targetNode.isValid && FactionUtils.isAlly(this.node, targetNode);
            case TargetType.SELF:
                return true; // 自身目标总有效
            case TargetType.POINT:
                return true; // 暂时认为地点目标有效，需要具体实现
            case TargetType.NONE:
                return true; // 无需目标总有效
            default:
                warn(`未知的目标类型: ${definition.targetType}`);
                return false;
        }
    }

    /**
     * 获取指定技能的运行时数据 (主要用于 AI 查询冷却状态)
     * @param skillId 技能 ID
     * @returns 技能的运行时数据，如果未学习则返回 undefined
     */
    public getSkillRuntimeData(skillId: string): SkillRuntimeData | undefined {
        return this._runtimeSkills.get(skillId);
    }
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