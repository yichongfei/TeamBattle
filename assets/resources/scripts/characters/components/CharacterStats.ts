import { _decorator, Component, CCFloat, CCInteger, warn, log, Enum } from 'cc';
import { Faction } from '../../common/Enums';

const { ccclass, property } = _decorator;

/**
 * 存储和管理角色的复杂属性。
 * 包含基础属性、战斗属性、资源等。
 */
@ccclass('CharacterStats')
export class CharacterStats extends Component {

    // --- 主要属性 (Primary Attributes) ---
    @property({ type: CCInteger, group: 'Primary Attributes' })
    strength: number = 10; // 力量: 通常影响物理攻击、生命值

    @property({ type: CCInteger, group: 'Primary Attributes' })
    agility: number = 10;  // 敏捷: 通常影响攻击速度、暴击率、闪避

    @property({ type: CCInteger, group: 'Primary Attributes' })
    intellect: number = 10; // 智力: 通常影响技能强度、法力值、法术抗性

    // --- 核心战斗属性 (Core Combat Stats) ---
    @property({ type: CCInteger, group: 'Core Combat Stats' })
    maxHealth: number = 100; // 最大生命值 (可能也受力量加成)

    @property({ type: CCFloat, group: 'Core Combat Stats' })
    moveSpeed: number = 150; // 移动速度

    @property({ type: CCFloat, group: 'Core Combat Stats' })
    attackPower: number = 10; // 物理攻击强度 (可能受力量/敏捷加成)

    @property({ type: CCFloat, group: 'Core Combat Stats' })
    skillPower: number = 10; // 技能强度 (可能受智力加成)

    @property({ type: CCFloat, group: 'Core Combat Stats' })
    attackSpeed: number = 1.0; // 每秒攻击次数 (可能受敏捷加成)

    @property({ type: CCFloat, group: 'Core Combat Stats' })
    attackRange: number = 150; // 普通攻击范围

    @property({ type: CCFloat, group: 'Core Combat Stats' })
    armor: number = 5; // 物理防御 (可能受力量加成)

    @property({ type: CCFloat, group: 'Core Combat Stats' })
    magicResist: number = 5; // 法术抗性 (可能受智力加成)

    // --- 次要战斗属性 (Secondary Combat Stats) ---
    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '物理和技能暴击几率 (0 到 1)'
    })
    critChance: number = 0.05; // 暴击率 (可能受敏捷加成)

    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        min: 1,
        tooltip: '暴击时的伤害倍率 (基础为 1.5 或 2.0)'
    })
    critDamageMultiplier: number = 1.5; // 暴击伤害倍数

    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '造成伤害时恢复自身生命的比例 (0 到 1)'
    })
    lifesteal: number = 0.1; // 吸血比例

    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '完全闪避物理攻击的几率'
    })
    dodgeChance: number = 0.05; // 闪避率 (可能受敏捷加成)

    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '使用武器招架近战攻击的几率'
    })
    parryChance: number = 0.05; // 招架率 (通常仅近战)

    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '使用盾牌格挡攻击的几率'
    })
    blockChance: number = 0.0; // 格挡率 (通常仅持盾单位)

    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '成功格挡时减免伤害的百分比'
    })
    blockAmount: number = 0.3; // 格挡值

    @property({
        type: CCFloat, group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '所有技能冷却时间缩减的百分比'
    })
    cooldownReduction: number = 0.0; // 冷却缩减

    // --- 资源属性 (Resources) ---
    @property({ type: CCInteger, group: 'Resources' })
    maxMana: number = 100; // 最大法力值 (或能量/怒气等)

    @property({ type: CCFloat, group: 'Resources' })
    manaRegen: number = 1.0; // 每秒法力恢复

    @property({
        type: Enum(Faction),
        tooltip: '单位所属阵营',
        group: 'General' // 可以自定义分组名
    })
    faction: Faction = Faction.PLAYER; // 设置一个默认值，例如敌人

    private _currentHealth: number = 0; // 当前生命值 (移到 HealthComponent 管理)
    private _currentMana: number = 0; // 当前法力值

    // --- 资源管理 (示例) ---
    // 使用 Map 存储不同类型的资源及其当前值
    private resources: Map<string, number> = new Map();
    private maxResources: Map<string, number> = new Map();

    onLoad() {
        // 注意: 当前生命值由 HealthComponent 初始化和管理
        this._currentMana = this.maxMana;
        // 初始化示例资源
        this.initializeResource('mana', this.maxMana);
        this.initializeResource('rage', 0); // 怒气初始为 0
    }

    start() {
        // 可以在这里打印或验证初始属性
    }

    // --- 动态计算属性的 Getters (示例) ---
    // 这些方法应该考虑 Buff/Debuff
    public getCurrentAttackPower(): number {
        // TODO: 应用力量/敏捷加成 和 Buff/Debuff
        return this.attackPower;
    }

    public getCurrentCritChance(): number {
        // TODO: 应用敏捷加成 和 Buff/Debuff
        return this.critChance;
    }
    
    public getCurrentArmor(): number {
        // TODO: 应用力量加成 和 Buff/Debuff
        return this.armor;
    }

    public getCurrentLifesteal(): number {
        // TODO: 应用 Buff/Debuff
        return this.lifesteal;
    }

    // ... 其他 Getters ...

    // --- 资源管理 ---
    public getCurrentMana(): number {
        return this._currentMana;
    }

    public hasEnoughMana(cost: number): boolean {
        return this._currentMana >= cost;
    }

    public consumeMana(cost: number): boolean {
        if (this.hasEnoughMana(cost)) {
            this._currentMana -= cost;
            // 发出资源变化事件?
            // this.node.emit('mana-changed', this._currentMana, this.maxMana);
            return true;
        }
        return false;
    }

    public restoreMana(amount: number): void {
        this._currentMana = Math.min(this.maxMana, this._currentMana + amount);
        // 发出资源变化事件?
        // this.node.emit('mana-changed', this._currentMana, this.maxMana);
    }

    update(deltaTime: number) {
        // 处理资源回复
        if (this.manaRegen > 0) {
            this.restoreMana(this.manaRegen * deltaTime);
        }
        // 可能需要处理 Buff/Debuff 的持续时间
    }

    /**
     * 初始化一种资源类型
     * @param type 资源类型字符串 (e.g., 'mana', 'rage')
     * @param maxValue 最大值
     * @param startValue 初始值 (默认为最大值)
     */
    initializeResource(type: string, maxValue: number, startValue?: number) {
        this.maxResources.set(type, maxValue);
        this.resources.set(type, startValue === undefined ? maxValue : startValue);
    }

    /**
     * [占位符] 检查是否有足够的资源。
     * TODO: 实现真实的资源检查逻辑。
     * @param resource 资源类型字符串 (e.g., 'mana')
     * @param amount 需要的数量
     * @returns 目前总是返回 true
     */
    public hasEnoughResource(resource: string, amount: number): boolean {
        const currentAmount = this.resources.get(resource) ?? 0;
        log(`检查资源: ${resource}, 需要: ${amount}, 当前: ${currentAmount}`);
        // return currentAmount >= amount; // 真实的检查逻辑
        return true; // 临时返回 true 以消除编译错误
    }

    /**
     * [占位符] 尝试消耗指定数量的资源。
     * TODO: 实现真实的资源消耗逻辑。
     * @param resource 资源类型字符串
     * @param amount 要消耗的数量
     * @returns 如果消耗成功（或当前总是成功），返回 true；否则返回 false
     */
    public tryConsumeResource(resource: string, amount: number): boolean {
        if (this.hasEnoughResource(resource, amount)) {
            const currentAmount = this.resources.get(resource) ?? 0;
            // this.resources.set(resource, currentAmount - amount); // 真实的消耗逻辑
            log(`尝试消耗资源: ${resource}, 数量: ${amount}. (当前为占位符，未实际扣除)`);
            return true; // 临时返回 true
        } else {
            log(`尝试消耗资源失败: ${resource}, 数量: ${amount}, 资源不足`);
            return false;
        }
    }

    // TODO: 添加获取其他属性的方法 (如暴击率、攻速、冷却缩减等)
    // public getCurrentCritChance(): number { return 0.1; } // 示例
    // public getCurrentAttackSpeed(): number { return 1.0; } // 示例
    // public getCurrentCooldownReduction(): number { return 0; } // 示例
} 