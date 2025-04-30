System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, RoleComponent, HealthComponent, RoleType, BossManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, TargetingComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRoleComponent(extras) {
    _reporterNs.report("RoleComponent", "./RoleComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHealthComponent(extras) {
    _reporterNs.report("HealthComponent", "./HealthComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfITargetable(extras) {
    _reporterNs.report("ITargetable", "../../common/Interfaces", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoleType(extras) {
    _reporterNs.report("RoleType", "../../common/Enums", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBossManager(extras) {
    _reporterNs.report("BossManager", "../../BossManager", _context.meta, extras);
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
      RoleComponent = _unresolved_2.RoleComponent;
    }, function (_unresolved_3) {
      HealthComponent = _unresolved_3.HealthComponent;
    }, function (_unresolved_4) {
      RoleType = _unresolved_4.RoleType;
    }, function (_unresolved_5) {
      BossManager = _unresolved_5.BossManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "73ce035I8tLm5RUOZvfcSKL", "TargetingComponent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']); // 需要根据角色定位选择目标
      // 需要判断目标或友方是否存活/低血量


      // User confirmed this import works
      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 负责为角色选择合适的目标 (敌人或友方)。
       * 其逻辑会根据角色定位 (RoleComponent) 和战场信息变化。
       */

      _export("TargetingComponent", TargetingComponent = (_dec = ccclass('TargetingComponent'), _dec2 = property(_crd && RoleComponent === void 0 ? (_reportPossibleCrUseOfRoleComponent({
        error: Error()
      }), RoleComponent) : RoleComponent), _dec3 = property({
        type: _crd && BossManager === void 0 ? (_reportPossibleCrUseOfBossManager({
          error: Error()
        }), BossManager) : BossManager,
        tooltip: '全局 Boss 管理器节点，用于获取敌方 Boss 列表'
      }), _dec4 = property({
        type: Number,
        tooltip: '搜索友方 (治疗目标) 的最大范围，0 表示无限'
      }), _dec(_class = (_class2 = class TargetingComponent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "role", _descriptor, this);

          // --- 使用用户添加的 BossManager 节点引用 ---
          _initializerDefineProperty(this, "bossManagerComponent", _descriptor2, this);

          // --
          // --- 索敌参数 ----
          this.aggroRadius = 0;

          _initializerDefineProperty(this, "healRadius", _descriptor3, this);

          // --- 内部状态 ---
          this._currentTarget = null;
          // 当前选定的目标
          this._searchTimer = 0;
          this.SEARCH_INTERVAL = 0.5;
        }

        // 每隔多少秒重新索敌一次
        start() {
          if (!this.role) {
            console.warn(`[${this.node.name}] 的 TargetingComponent 需要一个 RoleComponent。`);
            this.enabled = false;
            return;
          }

          if (!this.bossManagerComponent) {
            console.warn(`[${this.node.name}] 的 TargetingComponent 需要在编辑器中链接 'Boss Manager Component' 属性。`);
          } else {
            console.log(`[${this.node.name}] TargetingComponent 已链接 BossManager。`);
          }
        }

        update(deltaTime) {
          this._searchTimer += deltaTime;

          if (this._searchTimer >= this.SEARCH_INTERVAL) {
            this._searchTimer = 0;
            this.findBestTarget();
          }

          if (this._currentTarget && !this.isTargetValid(this._currentTarget)) {
            console.log(`[${this.node.name}] 当前目标不再有效。`);
            this.clearTarget();
            this.findBestTarget(); // 立刻尝试寻找新目标
          }
        } // --- 核心索敌逻辑 ---


        findBestTarget() {
          let bestTarget = null;

          switch (this.role.role) {
            case (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
              error: Error()
            }), RoleType) : RoleType).MELEE_DPS:
            case (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
              error: Error()
            }), RoleType) : RoleType).RANGED_DPS:
            case (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
              error: Error()
            }), RoleType) : RoleType).TANK:
              bestTarget = this.findNearestEnemy(); // TODO: TANK 可能需要考虑仇恨最高的敌人

              break;

            case (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
              error: Error()
            }), RoleType) : RoleType).HEALER:
              bestTarget = this.findLowestHealthAlly();
              break;
            // ... 其他角色类型
          }

          if (bestTarget && bestTarget !== this._currentTarget) {
            this.setTarget(bestTarget);
          } else if (!bestTarget && this._currentTarget) {// 如果找不到新目标，但之前有目标，则清除
            // 但也许不清除更好？让角色停留在原地？取决于设计
            // this.clearTarget();
          }
        }

        findNearestEnemy() {
          if (!this.bossManagerComponent) {
            console.warn(`[${this.node.name}] TargetingComponent: BossManagerComponent not linked or invalid.`);
            return null;
          }

          let bosses = [];

          try {
            bosses = this.bossManagerComponent.getActiveBosses();
          } catch (e) {
            console.warn(`[${this.node.name}] TargetingComponent: Error calling getActiveBosses():`, e);
            return null;
          }

          if (!bosses || bosses.length === 0) {
            return null; // 没有 Boss 可以作为目标
          }

          let nearestEnemy = null;
          let minDistanceSq = this.aggroRadius > 0 ? this.aggroRadius * this.aggroRadius : Infinity;

          for (const bossNode of bosses) {
            if (!bossNode || !bossNode.isValid) {
              continue;
            }

            const healthComp = bossNode.getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
              error: Error()
            }), HealthComponent) : HealthComponent);

            if (!healthComp) {
              continue;
            }

            if (!healthComp.isAlive()) {
              continue;
            } // 确保目标实现了 ITargetable (HealthComponent 应该实现它)
            // 在 TypeScript 中，接口不能直接检查，但我们可以假定 HealthComponent 符合要求
            // 如果需要更严格，可以添加一个标记属性或方法到 ITargetable


            const targetable = healthComp;
            const distanceSq = Vec3.squaredDistance(this.node.worldPosition, targetable.getPosition());

            if (distanceSq < minDistanceSq) {
              minDistanceSq = distanceSq;
              nearestEnemy = targetable;
            } else {}
          }

          if (!nearestEnemy) {}

          return nearestEnemy;
        } // (Placeholder for faction check - needs implementation)
        // private isEnemyFaction(targetNode: Node): boolean {
        //     // Simple check: assumes anything not self is enemy for now
        //     return targetNode !== this.node;
        // }


        findLowestHealthAlly() {
          console.warn(`[${this.node.name}] TargetingComponent: findLowestHealthAlly() not implemented!`);
          return null;
        } // --- 目标管理 ---


        setTarget(target) {
          var _target$getNode$name, _target$getNode;

          if (this._currentTarget === target) return;
          const oldTarget = this._currentTarget;
          this._currentTarget = target;
          console.log(`[${this.node.name}] TargetingComponent: Acquired new target: [${(_target$getNode$name = (_target$getNode = target.getNode()) == null ? void 0 : _target$getNode.name) != null ? _target$getNode$name : 'Unknown'}]`);
          this.node.emit('target-changed', this._currentTarget, oldTarget);
        }
        /**
         * 清除当前目标。
         * 由 AIComponent 在发现目标无效时调用，或 TargetingComponent 内部调用。
         */


        clearTarget() {
          if (!this._currentTarget) return;
          console.log(`[${this.node.name}] TargetingComponent: Target cleared.`);
          const oldTarget = this._currentTarget;
          this._currentTarget = null;
          this.node.emit('target-changed', null, oldTarget);
        }

        isTargetValid(target) {
          if (!target || !target.getNode() || !target.getNode().isValid) {
            return false;
          } // 检查目标是否存活


          const healthComp = target.getNode().getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
            error: Error()
          }), HealthComponent) : HealthComponent);

          if (!healthComp || !healthComp.isAlive()) {
            return false;
          } // 可以添加其他检查，例如距离、是否在视野内等
          // const distance = Vec3.distance(this.node.worldPosition, target.getPosition());
          // if (this.role.role === RoleType.HEALER && distance > this.healRadius) return false;
          // if (this.role.role !== RoleType.HEALER && distance > this.aggroRadius * 1.2) return false; // 加个缓冲，防止目标在边缘反复丢失


          return true;
        } // --- 公共接口 ---


        getCurrentTarget() {
          // 返回前再次校验有效性
          if (!this.isTargetValid(this._currentTarget)) {
            this._currentTarget = null; // 内部清除无效目标
          }

          return this._currentTarget;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "role", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bossManagerComponent", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "healRadius", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1000;
        }
      })), _class2)) || _class)); // Helper function (需要实现或放到 GameManager/Service Locator)
      // function findManager<T extends Component>(type: new () => T): T | null {
      //     // 实现查找逻辑，例如通过场景查找特定节点或使用单例
      //     return null;
      // } 


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7b883f6f61bb1e5eec8d5b9f785c2f54a8eedfca.js.map