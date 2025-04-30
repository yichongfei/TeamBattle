System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, CharacterStats, TargetingComponent, HealthComponent, AttackType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, AttackComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCharacterStats(extras) {
    _reporterNs.report("CharacterStats", "./CharacterStats", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTargetingComponent(extras) {
    _reporterNs.report("TargetingComponent", "./TargetingComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHealthComponent(extras) {
    _reporterNs.report("HealthComponent", "./HealthComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfITargetable(extras) {
    _reporterNs.report("ITargetable", "../../common/Interfaces", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIDamageable(extras) {
    _reporterNs.report("IDamageable", "../../common/Interfaces", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackType(extras) {
    _reporterNs.report("AttackType", "../../common/Enums", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      CharacterStats = _unresolved_2.CharacterStats;
    }, function (_unresolved_3) {
      TargetingComponent = _unresolved_3.TargetingComponent;
    }, function (_unresolved_4) {
      HealthComponent = _unresolved_4.HealthComponent;
    }, function (_unresolved_5) {
      AttackType = _unresolved_5.AttackType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f7773JLPgJNQZ/1RGaeMtE4", "AttackComponent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']); // 获取攻击力、攻速、范围
      // 获取当前目标
      // 对目标造成伤害 (通过 IDamageable)


      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 负责处理角色的普通攻击逻辑。
       * 根据攻速计时，在范围内有有效目标时执行攻击。
       */

      _export("AttackComponent", AttackComponent = (_dec = ccclass('AttackComponent'), _dec2 = property(_crd && CharacterStats === void 0 ? (_reportPossibleCrUseOfCharacterStats({
        error: Error()
      }), CharacterStats) : CharacterStats), _dec3 = property(_crd && TargetingComponent === void 0 ? (_reportPossibleCrUseOfTargetingComponent({
        error: Error()
      }), TargetingComponent) : TargetingComponent), _dec(_class = (_class2 = class AttackComponent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "stats", _descriptor, this);

          _initializerDefineProperty(this, "targeting", _descriptor2, this);

          // --- 内部状态 ---
          this._attackTimer = 0;
          this._isAttackReady = true;
          this._isAttacking = false;
          // 由 AI 控制是否应该攻击
          this.attackCount = 0;
        }

        // DEBUG: Count attacks
        start() {
          if (!this.stats) {
            this.enabled = false;
            return;
          }

          if (!this.targeting) {
            this.enabled = false;
            return;
          }
        }

        update(deltaTime) {
          if (!this.enabled || !this.stats || !this.targeting) return;

          if (!this._isAttackReady) {
            this._attackTimer -= deltaTime;

            if (this._attackTimer <= 0) {
              this._isAttackReady = true;
            }
          }

          if (this._isAttacking) {
            if (this._isAttackReady) {
              this.tryAttack();
            }
          }
        } // --- 由 AIComponent 调用 ---


        startAttacking() {
          if (!this._isAttacking) {
            this._isAttacking = true;
          }
        }

        stopAttacking() {
          if (this._isAttacking) {
            this._isAttacking = false;
          }
        } // --- 内部攻击逻辑 ---


        tryAttack() {
          var target = this.targeting.getCurrentTarget();
          if (!target) return;
          var targetNode = target.getNode();
          if (!targetNode || !targetNode.isValid) return;
          var distance = Vec3.distance(this.node.worldPosition, targetNode.worldPosition);

          if (distance > this.stats.attackRange) {
            console.log("[" + this.node.name + "] tryAttack: FAILED - Target out of range (" + distance.toFixed(0) + " > " + this.stats.attackRange + ").");
            return;
          }

          var damageableTarget = targetNode.getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
            error: Error()
          }), HealthComponent) : HealthComponent);

          if (!damageableTarget || !damageableTarget.isAlive()) {
            return;
          }

          this.performAttack(damageableTarget);
        }

        performAttack(target) {
          this.attackCount++;
          var targetNode = target.getNode();
          if (!targetNode) return;
          var damageable = targetNode.getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
            error: Error()
          }), HealthComponent) : HealthComponent);
          if (!damageable) return;
          var attackerStats = this.stats;
          if (!attackerStats) return;
          this._isAttackReady = false;
          var attackInterval = 1.0 / Math.max(0.1, attackerStats.attackSpeed);
          this._attackTimer = attackInterval;
          this.node.emit('play-animation', 'attack', false);
          var baseDamage = attackerStats.getCurrentAttackPower();
          var critChance = attackerStats.getCurrentCritChance();
          var isCrit = Math.random() < critChance;
          var potentialDamage = baseDamage;

          if (isCrit) {
            potentialDamage *= attackerStats.critDamageMultiplier;
          }

          var attackType = (_crd && AttackType === void 0 ? (_reportPossibleCrUseOfAttackType({
            error: Error()
          }), AttackType) : AttackType).PHYSICAL;
          this.scheduleOnce(() => {
            var currentDamageable = targetNode.getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
              error: Error()
            }), HealthComponent) : HealthComponent);

            if (currentDamageable && currentDamageable.isAlive()) {
              currentDamageable.applyDamage(potentialDamage, attackType, isCrit, this.node);
            }
          }, 0.1);
        } // --- 公共接口 ---


        isAttackReady() {
          return this._isAttackReady;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "stats", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "targeting", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7817c2fb9c7d39354f58dd7dda3493dcbae23870.js.map