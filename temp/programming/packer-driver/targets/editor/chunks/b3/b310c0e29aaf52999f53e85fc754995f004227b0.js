System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, CCFloat, CCInteger, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _crd, ccclass, property, CharacterStats;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "49443RGWpdMZ7A/7H7TLQcN", "CharacterStats", undefined);

      __checkObsolete__(['_decorator', 'Component', 'CCFloat', 'CCInteger', 'warn']);

      ({
        ccclass,
        property
      } = _decorator); // 可以定义一个枚举来表示主要属性 (如果需要动态获取)
      // export enum PrimaryAttribute {
      //     STRENGTH,
      //     AGILITY,
      //     INTELLECT
      // }

      /**
       * 存储和管理角色的复杂属性。
       * 包含基础属性、战斗属性、资源等。
       */

      _export("CharacterStats", CharacterStats = (_dec = ccclass('CharacterStats'), _dec2 = property({
        type: CCInteger,
        group: 'Primary Attributes'
      }), _dec3 = property({
        type: CCInteger,
        group: 'Primary Attributes'
      }), _dec4 = property({
        type: CCInteger,
        group: 'Primary Attributes'
      }), _dec5 = property({
        type: CCInteger,
        group: 'Core Combat Stats'
      }), _dec6 = property({
        type: CCFloat,
        group: 'Core Combat Stats'
      }), _dec7 = property({
        type: CCFloat,
        group: 'Core Combat Stats'
      }), _dec8 = property({
        type: CCFloat,
        group: 'Core Combat Stats'
      }), _dec9 = property({
        type: CCFloat,
        group: 'Core Combat Stats'
      }), _dec10 = property({
        type: CCFloat,
        group: 'Core Combat Stats'
      }), _dec11 = property({
        type: CCFloat,
        group: 'Core Combat Stats'
      }), _dec12 = property({
        type: CCFloat,
        group: 'Core Combat Stats'
      }), _dec13 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '物理和技能暴击几率 (0 到 1)'
      }), _dec14 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        min: 1,
        tooltip: '暴击时的伤害倍率 (基础为 1.5 或 2.0)'
      }), _dec15 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '造成伤害时恢复自身生命的比例 (0 到 1)'
      }), _dec16 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '完全闪避物理攻击的几率'
      }), _dec17 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '使用武器招架近战攻击的几率'
      }), _dec18 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '使用盾牌格挡攻击的几率'
      }), _dec19 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '成功格挡时减免伤害的百分比'
      }), _dec20 = property({
        type: CCFloat,
        group: 'Secondary Combat Stats',
        range: [0, 1, 0.01],
        tooltip: '所有技能冷却时间缩减的百分比'
      }), _dec21 = property({
        type: CCInteger,
        group: 'Resources'
      }), _dec22 = property({
        type: CCFloat,
        group: 'Resources'
      }), _dec(_class = (_class2 = class CharacterStats extends Component {
        constructor(...args) {
          super(...args);

          // --- 主要属性 (Primary Attributes) ---
          _initializerDefineProperty(this, "strength", _descriptor, this);

          // 力量: 通常影响物理攻击、生命值
          _initializerDefineProperty(this, "agility", _descriptor2, this);

          // 敏捷: 通常影响攻击速度、暴击率、闪避
          _initializerDefineProperty(this, "intellect", _descriptor3, this);

          // 智力: 通常影响技能强度、法力值、法术抗性
          // --- 核心战斗属性 (Core Combat Stats) ---
          _initializerDefineProperty(this, "maxHealth", _descriptor4, this);

          // 最大生命值 (可能也受力量加成)
          _initializerDefineProperty(this, "moveSpeed", _descriptor5, this);

          // 移动速度
          _initializerDefineProperty(this, "attackPower", _descriptor6, this);

          // 物理攻击强度 (可能受力量/敏捷加成)
          _initializerDefineProperty(this, "skillPower", _descriptor7, this);

          // 技能强度 (可能受智力加成)
          _initializerDefineProperty(this, "attackSpeed", _descriptor8, this);

          // 每秒攻击次数 (可能受敏捷加成)
          _initializerDefineProperty(this, "attackRange", _descriptor9, this);

          // 普通攻击范围
          _initializerDefineProperty(this, "armor", _descriptor10, this);

          // 物理防御 (可能受力量加成)
          _initializerDefineProperty(this, "magicResist", _descriptor11, this);

          // 法术抗性 (可能受智力加成)
          // --- 次要战斗属性 (Secondary Combat Stats) ---
          _initializerDefineProperty(this, "critChance", _descriptor12, this);

          // 暴击率 (可能受敏捷加成)
          _initializerDefineProperty(this, "critDamageMultiplier", _descriptor13, this);

          // 暴击伤害倍数
          _initializerDefineProperty(this, "lifesteal", _descriptor14, this);

          // 吸血比例
          _initializerDefineProperty(this, "dodgeChance", _descriptor15, this);

          // 闪避率 (可能受敏捷加成)
          _initializerDefineProperty(this, "parryChance", _descriptor16, this);

          // 招架率 (通常仅近战)
          _initializerDefineProperty(this, "blockChance", _descriptor17, this);

          // 格挡率 (通常仅持盾单位)
          _initializerDefineProperty(this, "blockAmount", _descriptor18, this);

          // 格挡值
          _initializerDefineProperty(this, "cooldownReduction", _descriptor19, this);

          // 冷却缩减
          // --- 资源属性 (Resources) ---
          _initializerDefineProperty(this, "maxMana", _descriptor20, this);

          // 最大法力值 (或能量/怒气等)
          _initializerDefineProperty(this, "manaRegen", _descriptor21, this);

          // 每秒法力恢复
          this._currentHealth = 0;
          // 当前生命值 (移到 HealthComponent 管理)
          this._currentMana = 0;
        }

        // 当前法力值
        onLoad() {
          // 注意: 当前生命值由 HealthComponent 初始化和管理
          this._currentMana = this.maxMana;
        }

        start() {// 可以在这里打印或验证初始属性
        } // --- 动态计算属性的 Getters (示例) ---
        // 这些方法应该考虑 Buff/Debuff


        getCurrentAttackPower() {
          // TODO: 应用力量/敏捷加成 和 Buff/Debuff
          return this.attackPower;
        }

        getCurrentCritChance() {
          // TODO: 应用敏捷加成 和 Buff/Debuff
          return this.critChance;
        }

        getCurrentArmor() {
          // TODO: 应用力量加成 和 Buff/Debuff
          return this.armor;
        }

        getCurrentLifesteal() {
          // TODO: 应用 Buff/Debuff
          return this.lifesteal;
        } // ... 其他 Getters ...
        // --- 资源管理 ---


        getCurrentMana() {
          return this._currentMana;
        }

        hasEnoughMana(cost) {
          return this._currentMana >= cost;
        }

        consumeMana(cost) {
          if (this.hasEnoughMana(cost)) {
            this._currentMana -= cost; // 发出资源变化事件?
            // this.node.emit('mana-changed', this._currentMana, this.maxMana);

            return true;
          }

          return false;
        }

        restoreMana(amount) {
          this._currentMana = Math.min(this.maxMana, this._currentMana + amount); // 发出资源变化事件?
          // this.node.emit('mana-changed', this._currentMana, this.maxMana);
        }

        update(deltaTime) {
          // 处理资源回复
          if (this.manaRegen > 0) {
            this.restoreMana(this.manaRegen * deltaTime);
          } // 可能需要处理 Buff/Debuff 的持续时间

        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "strength", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "agility", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "intellect", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 150;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "attackPower", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "skillPower", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "attackSpeed", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 150;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "armor", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "magicResist", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "critChance", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "critDamageMultiplier", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "lifesteal", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "dodgeChance", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "parryChance", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "blockChance", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "blockAmount", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "cooldownReduction", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "maxMana", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "manaRegen", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b310c0e29aaf52999f53e85fc754995f004227b0.js.map