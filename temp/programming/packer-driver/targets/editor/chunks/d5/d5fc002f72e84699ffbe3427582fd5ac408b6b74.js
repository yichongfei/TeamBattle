System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, AttackType, CharacterStats, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, HealthComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfIDamageable(extras) {
    _reporterNs.report("IDamageable", "../../common/Interfaces", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIHealable(extras) {
    _reporterNs.report("IHealable", "../../common/Interfaces", _context.meta, extras);
  }

  function _reportPossibleCrUseOfITargetable(extras) {
    _reporterNs.report("ITargetable", "../../common/Interfaces", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackType(extras) {
    _reporterNs.report("AttackType", "../../common/Enums", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterStats(extras) {
    _reporterNs.report("CharacterStats", "./CharacterStats", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
    }, function (_unresolved_2) {
      AttackType = _unresolved_2.AttackType;
    }, function (_unresolved_3) {
      CharacterStats = _unresolved_3.CharacterStats;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d5c3dSM+GBN5JGOa0N1IYCE", "HealthComponent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'director']);

      // 可能需要获取最大生命值
      // import { AIComponent } from '../ai/AIComponent'; // 可能需要通知 AI 死亡
      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 管理角色的生命值、受伤、治疗和死亡逻辑。
       * 实现 IDamageable, IHealable 和 ITargetable 接口。
       */

      _export("HealthComponent", HealthComponent = (_dec = ccclass('HealthComponent'), _dec2 = property(_crd && CharacterStats === void 0 ? (_reportPossibleCrUseOfCharacterStats({
        error: Error()
      }), CharacterStats) : CharacterStats), _dec(_class = (_class2 = class HealthComponent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "stats", _descriptor, this);

          // @property(AIComponent) // 或者通过事件通知
          // private aiComponent: AIComponent = null;
          this._currentHealth = 0;
          this._isAlive = true;
        }

        start() {
          if (!this.stats) {
            console.warn(`HealthComponent on [${this.node.name}] requires a CharacterStats component.`);
            this.enabled = false;
            return;
          }

          this._currentHealth = this.stats.maxHealth;
          this._isAlive = true;
          console.log(`[${this.node.name}] HealthComponent initialized with ${this._currentHealth} HP.`);
        } // --- IDamageable Implementation ---


        applyDamage(potentialDamage, type, isCrit, source) {
          if (!this._isAlive) return;
          const targetStats = this.stats;

          if (!targetStats) {
            console.warn(`[${this.node.name}] HealthComponent missing CharacterStats. Cannot calculate damage reduction.`);
            return;
          }

          let finalDamage = potentialDamage;

          if (type === (_crd && AttackType === void 0 ? (_reportPossibleCrUseOfAttackType({
            error: Error()
          }), AttackType) : AttackType).PHYSICAL) {
            const armor = targetStats.getCurrentArmor();
            const reductionFactor = 500;
            const damageReduction = armor / (armor + reductionFactor);
            finalDamage = potentialDamage * (1 - damageReduction);
          } else if (type === (_crd && AttackType === void 0 ? (_reportPossibleCrUseOfAttackType({
            error: Error()
          }), AttackType) : AttackType).MAGICAL) {// TODO: 实现基于魔法抗性的减伤
          } else if (type === (_crd && AttackType === void 0 ? (_reportPossibleCrUseOfAttackType({
            error: Error()
          }), AttackType) : AttackType).TRUE) {// 真实伤害无视防御和抗性
          }

          finalDamage = Math.max(0, finalDamage);
          const oldHealth = this._currentHealth;
          this._currentHealth -= finalDamage;
          this._currentHealth = Math.max(0, this._currentHealth);
          console.log(`[${this.node.name}] took ${finalDamage.toFixed(0)} ${type} damage (Crit: ${isCrit}), HP: ${this._currentHealth.toFixed(0)}/${targetStats.maxHealth}`);
          director.emit('final-damage-applied', {
            targetNode: this.node,
            sourceNode: source,
            damage: finalDamage,
            damageType: type,
            isCrit: isCrit
          });

          if (finalDamage > 0 && source && source.isValid) {
            const attackerStats = source.getComponent(_crd && CharacterStats === void 0 ? (_reportPossibleCrUseOfCharacterStats({
              error: Error()
            }), CharacterStats) : CharacterStats);
            const attackerHealth = source.getComponent(HealthComponent);

            if (attackerStats && attackerHealth) {
              const lifestealRatio = attackerStats.getCurrentLifesteal();

              if (lifestealRatio > 0) {
                const lifestealAmount = finalDamage * lifestealRatio;
                attackerHealth.applyHeal(lifestealAmount, this.node);
              }
            }
          }

          if (oldHealth > 0 && this._currentHealth <= 0) {
            this.handleDeath(source);
          }
        }

        isAlive() {
          return this._isAlive;
        } // --- IHealable Implementation ---


        applyHeal(amount, source) {
          if (!this._isAlive || !this.stats || this._currentHealth >= this.stats.maxHealth) return;
          const healAmount = Math.max(0, amount);
          const finalHealAmount = healAmount;
          const oldHealth = this._currentHealth;
          this._currentHealth = Math.min(this.stats.maxHealth, this._currentHealth + finalHealAmount);
          const actualHealed = this._currentHealth - oldHealth;

          if (actualHealed > 0.1) {
            var _source$name;

            console.log(`[${this.node.name}] received ${actualHealed.toFixed(0)} healing from [${(_source$name = source == null ? void 0 : source.name) != null ? _source$name : 'Unknown'}], HP: ${this._currentHealth.toFixed(0)}/${this.stats.maxHealth}`);
            director.emit('final-heal-applied', {
              targetNode: this.node,
              sourceNode: source,
              healAmount: actualHealed
            });
          }
        } // --- ITargetable Implementation ---


        getNode() {
          return this.node;
        }

        getPosition() {
          return this.node.worldPosition;
        } // --- 死亡处理 ---


        handleDeath(killer) {
          if (!this._isAlive) return;
          this._isAlive = false;
          console.log(`[${this.node.name}] has died.`);
          this.node.emit('character-died', killer);
          this.node.emit('play-animation', 'die', false);
        } // --- 公共接口 (Getter) ---


        getCurrentHealth() {
          return this._currentHealth;
        }

        getMaxHealth() {
          return this.stats ? this.stats.maxHealth : 0;
        }

        getHealthPercentage() {
          if (!this.stats || this.stats.maxHealth <= 0) return 0;
          return this._currentHealth / this.stats.maxHealth;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "stats", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d5fc002f72e84699ffbe3427582fd5ac408b6b74.js.map