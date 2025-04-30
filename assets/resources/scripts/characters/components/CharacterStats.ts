import { _decorator, Component, CCFloat, CCInteger, warn } from 'cc';

const { ccclass, property } = _decorator;

// 可以定义一个枚举来表示主要属性 (如果需要动态获取)
// export enum PrimaryAttribute {
//     STRENGTH,
//     AGILITY,
//     INTELLECT
// }

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

    private _currentHealth: number = 0; // 当前生命值 (移到 HealthComponent 管理)
    private _currentMana: number = 0; // 当前法力值

    onLoad() {
        // 注意: 当前生命值由 HealthComponent 初始化和管理
        this._currentMana = this.maxMana;
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
} 