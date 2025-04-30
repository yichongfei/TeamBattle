System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, CCFloat, CharacterStats, HealthComponent, MovementComponent, TargetingComponent, AttackComponent, SkillComponent, RoleComponent, CharacterState, PlayerSquadManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, AIComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCharacterStats(extras) {
    _reporterNs.report("CharacterStats", "../components/CharacterStats", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHealthComponent(extras) {
    _reporterNs.report("HealthComponent", "../components/HealthComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMovementComponent(extras) {
    _reporterNs.report("MovementComponent", "../components/MovementComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTargetingComponent(extras) {
    _reporterNs.report("TargetingComponent", "../components/TargetingComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAttackComponent(extras) {
    _reporterNs.report("AttackComponent", "../components/AttackComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSkillComponent(extras) {
    _reporterNs.report("SkillComponent", "../components/SkillComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoleComponent(extras) {
    _reporterNs.report("RoleComponent", "../components/RoleComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterState(extras) {
    _reporterNs.report("CharacterState", "../../common/Enums", _context.meta, extras);
  }

  function _reportPossibleCrUseOfITargetable(extras) {
    _reporterNs.report("ITargetable", "../../common/Interfaces", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerSquadManager(extras) {
    _reporterNs.report("PlayerSquadManager", "../../PlayerSquadManager", _context.meta, extras);
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
      CCFloat = _cc.CCFloat;
    }, function (_unresolved_2) {
      CharacterStats = _unresolved_2.CharacterStats;
    }, function (_unresolved_3) {
      HealthComponent = _unresolved_3.HealthComponent;
    }, function (_unresolved_4) {
      MovementComponent = _unresolved_4.MovementComponent;
    }, function (_unresolved_5) {
      TargetingComponent = _unresolved_5.TargetingComponent;
    }, function (_unresolved_6) {
      AttackComponent = _unresolved_6.AttackComponent;
    }, function (_unresolved_7) {
      SkillComponent = _unresolved_7.SkillComponent;
    }, function (_unresolved_8) {
      RoleComponent = _unresolved_8.RoleComponent;
    }, function (_unresolved_9) {
      CharacterState = _unresolved_9.CharacterState;
    }, function (_unresolved_10) {
      PlayerSquadManager = _unresolved_10.PlayerSquadManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dc7e85IpHFNo75bR/7hh3to", "AIComponent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Vec3', 'Node', 'CCFloat']);

      // PlayerSquadManager 暂时不再直接用于此脚本的核心逻辑
      // import { PlayerSquadManager } from '../../PlayerSquadManager'; 
      ({
        ccclass,
        property
      } = _decorator);

      _export("AIComponent", AIComponent = (_dec = ccclass('AIComponent'), _dec2 = property(_crd && CharacterStats === void 0 ? (_reportPossibleCrUseOfCharacterStats({
        error: Error()
      }), CharacterStats) : CharacterStats), _dec3 = property(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
        error: Error()
      }), HealthComponent) : HealthComponent), _dec4 = property(_crd && MovementComponent === void 0 ? (_reportPossibleCrUseOfMovementComponent({
        error: Error()
      }), MovementComponent) : MovementComponent), _dec5 = property(_crd && TargetingComponent === void 0 ? (_reportPossibleCrUseOfTargetingComponent({
        error: Error()
      }), TargetingComponent) : TargetingComponent), _dec6 = property(_crd && AttackComponent === void 0 ? (_reportPossibleCrUseOfAttackComponent({
        error: Error()
      }), AttackComponent) : AttackComponent), _dec7 = property(_crd && SkillComponent === void 0 ? (_reportPossibleCrUseOfSkillComponent({
        error: Error()
      }), SkillComponent) : SkillComponent), _dec8 = property(_crd && RoleComponent === void 0 ? (_reportPossibleCrUseOfRoleComponent({
        error: Error()
      }), RoleComponent) : RoleComponent), _dec9 = property({
        type: Vec3,
        tooltip: '战斗舞台的中心点 (世界坐标)'
      }), _dec10 = property({
        type: CCFloat,
        // 确认 CCFloat 是否导入，如果报错则添加
        tooltip: '角色允许活动的最大半径 (距离舞台中心)',
        min: 0
      }), _dec(_class = (_class2 = class AIComponent extends Component {
        constructor(...args) {
          super(...args);

          // --- 核心组件引用 ---
          _initializerDefineProperty(this, "stats", _descriptor, this);

          _initializerDefineProperty(this, "health", _descriptor2, this);

          _initializerDefineProperty(this, "movement", _descriptor3, this);

          _initializerDefineProperty(this, "targeting", _descriptor4, this);

          _initializerDefineProperty(this, "attack", _descriptor5, this);

          _initializerDefineProperty(this, "skills", _descriptor6, this);

          _initializerDefineProperty(this, "role", _descriptor7, this);

          // --- 区域控制参数 ---
          _initializerDefineProperty(this, "stageCenter", _descriptor8, this);

          _initializerDefineProperty(this, "maxDistanceFromCenter", _descriptor9, this);

          // 示例半径
          // --- 内部状态 ---
          this._currentState = (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
            error: Error()
          }), CharacterState) : CharacterState).IDLE;
          this._isActive = true;
          this._currentTarget = null;
        }

        // 缓存当前目标，用于检测目标失效
        onLoad() {
          // 确保所有必要的组件都存在
          // 使用 getComponent 获取引用，以防编辑器未链接
          this.stats = this.getComponent(_crd && CharacterStats === void 0 ? (_reportPossibleCrUseOfCharacterStats({
            error: Error()
          }), CharacterStats) : CharacterStats);
          this.health = this.getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
            error: Error()
          }), HealthComponent) : HealthComponent);
          this.movement = this.getComponent(_crd && MovementComponent === void 0 ? (_reportPossibleCrUseOfMovementComponent({
            error: Error()
          }), MovementComponent) : MovementComponent);
          this.targeting = this.getComponent(_crd && TargetingComponent === void 0 ? (_reportPossibleCrUseOfTargetingComponent({
            error: Error()
          }), TargetingComponent) : TargetingComponent);
          this.attack = this.getComponent(_crd && AttackComponent === void 0 ? (_reportPossibleCrUseOfAttackComponent({
            error: Error()
          }), AttackComponent) : AttackComponent);
          this.skills = this.getComponent(_crd && SkillComponent === void 0 ? (_reportPossibleCrUseOfSkillComponent({
            error: Error()
          }), SkillComponent) : SkillComponent);
          this.role = this.getComponent(_crd && RoleComponent === void 0 ? (_reportPossibleCrUseOfRoleComponent({
            error: Error()
          }), RoleComponent) : RoleComponent);

          if (!this.stats || !this.health || !this.movement || !this.targeting || !this.attack || !this.skills || !this.role) {
            console.warn(`AIComponent on [${this.node.name}] is missing one or more required components. Disabling AI.`);
            this._isActive = false;
            this.enabled = false;
            return;
          } // --- PlayerSquadManager 注册不再需要，因为 AI 不再查询索引 ---


          const squadManager = (_crd && PlayerSquadManager === void 0 ? (_reportPossibleCrUseOfPlayerSquadManager({
            error: Error()
          }), PlayerSquadManager) : PlayerSquadManager).instance;

          if (squadManager) {
            squadManager.addCharacter(this.node);
          } else {
            console.warn(`[${this.node.name}] AIComponent: Could not find PlayerSquadManager instance to register.`);
          }
        }

        start() {
          if (!this._isActive) return;
          this.health.node.on('character-died', this.onCharacterDied, this);
          this.targeting.node.on('target-changed', this.onTargetChanged, this);
          console.log(`AIComponent on [${this.node.name}] initialized and active.`);
          this.changeState((_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
            error: Error()
          }), CharacterState) : CharacterState).IDLE);
        }

        update(deltaTime) {
          if (!this._isActive || this._currentState === (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
            error: Error()
          }), CharacterState) : CharacterState).DEAD || this._currentState === (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
            error: Error()
          }), CharacterState) : CharacterState).STUNNED) {
            return;
          }

          this.runSimplePlaceholderLogic(deltaTime);
        } // --- 行为树/状态机逻辑 (注释掉) ---
        // private initializeBehaviorTree() { ... }
        // private runStateMachineLogic(deltaTime: number) { ... }
        // --- 简单 AI 逻辑 (回归简化版) ---


        runSimplePlaceholderLogic(deltaTime) {
          var _this$health$isAlive, _this$health;

          const target = this.targeting.getCurrentTarget();
          const targetNode = target == null ? void 0 : target.getNode();
          const isSelfAlive = (_this$health$isAlive = (_this$health = this.health) == null ? void 0 : _this$health.isAlive()) != null ? _this$health$isAlive : false;

          if (target && isSelfAlive && targetNode && targetNode.isValid) {
            const bossPosition = target.getPosition();
            const distanceToBoss = Vec3.distance(this.node.worldPosition, bossPosition);
            const attackRange = this.stats.attackRange; // 定义一个非常小的缓冲距离，防止在边缘抖动

            const attackRangeBuffer = 5; // --- 移动目标点现在直接是 Boss 位置 (考虑区域限制) ---

            const squadMgr = (_crd && PlayerSquadManager === void 0 ? (_reportPossibleCrUseOfPlayerSquadManager({
              error: Error()
            }), PlayerSquadManager) : PlayerSquadManager).instance;
            const myIndex = squadMgr ? squadMgr.getSquadIndex(this.node) : 0;
            const squadSize = Math.max(1, squadMgr ? squadMgr.getTotalSquadSize() : 1); // 站位半径：比攻击距离略小，让武器打得到

            const ringRadius = this.stats.attackRange * 0.8; // 均分 360°，每人一个角度槽

            const angle = Math.PI * 2 / squadSize * myIndex; // 计算在环上的目标点

            let finalMoveTarget = bossPosition.clone();
            finalMoveTarget.x += Math.cos(angle) * ringRadius;
            finalMoveTarget.y += Math.sin(angle) * ringRadius;
            const distFromCenter = Vec3.distance(finalMoveTarget, this.stageCenter);

            if (this.maxDistanceFromCenter > 0 && distFromCenter > this.maxDistanceFromCenter) {
              const directionFromCenter = finalMoveTarget.clone().subtract(this.stageCenter).normalize();
              finalMoveTarget = this.stageCenter.clone().add(directionFromCenter.multiplyScalar(this.maxDistanceFromCenter));
            } // ---
            // --- 根据当前状态和距离决定行为 (简化) --- 


            if (distanceToBoss <= attackRange - attackRangeBuffer) {
              // 已经明确在攻击范围内，停止移动并攻击
              if (this._currentState !== (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
                error: Error()
              }), CharacterState) : CharacterState).ATTACKING) {
                this.changeState((_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
                  error: Error()
                }), CharacterState) : CharacterState).ATTACKING);
                this.movement.stopMovement(); // 强制停止
              } // 持续确保面向 Boss


              const directionToTargetX = bossPosition.x - this.node.worldPosition.x;
              const currentScaleX = Math.abs(this.node.scale.x);
              this.node.scale = new Vec3(directionToTargetX < 0 ? currentScaleX : -currentScaleX, this.node.scale.y, this.node.scale.z); // 确保移动停止

              this.movement.stopMovement();
              this.attack.startAttacking();
            } else {
              // 在攻击范围外，移动向 Boss
              if (this._currentState !== (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
                error: Error()
              }), CharacterState) : CharacterState).MOVING) {
                this.changeState((_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
                  error: Error()
                }), CharacterState) : CharacterState).MOVING);
              }

              this.movement.moveTo(finalMoveTarget); // 直接移动到 Boss 位置 (或边界点)

              this.attack.stopAttacking();
            } // ---

          } else {
            // Target is null OR character is dead OR targetNode is invalid
            if (!isSelfAlive) {
              // 如果是自己死了，不做任何操作
              if (this._currentState !== (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
                error: Error()
              }), CharacterState) : CharacterState).DEAD) this.changeState((_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
                error: Error()
              }), CharacterState) : CharacterState).DEAD);
              return;
            } // 如果是目标无效或消失
            // 修正：使用缓存的 _currentTarget 检查目标是否是刚刚失效


            if (this._currentTarget && target === null) {
              console.warn(`[${this.node.name}] AI Update: Target became null (likely died or cleared).`);
            } else if (targetNode && !targetNode.isValid) {
              // 目标节点本身失效了
              console.warn(`[${this.node.name}] AI Update: Target node became invalid. Clearing target.`);
              this.targeting.clearTarget(); // 强制清除目标
            } // 切换到 IDLE 状态


            if (this._currentState !== (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
              error: Error()
            }), CharacterState) : CharacterState).IDLE) {
              console.log(`[${this.node.name}] AI DECISION: No valid target. -> IDLE`);
              this.changeState((_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
                error: Error()
              }), CharacterState) : CharacterState).IDLE);
            }

            this.movement.stopMovement();
            this.attack.stopAttacking();
          } // 更新缓存的目标，以便下一帧比较


          this._currentTarget = target;
        } // ... (事件处理: onCharacterDied, onTargetChanged)


        onCharacterDied(killer) {
          var _this$movement, _this$attack;

          console.log(`[${this.node.name}] AI received death event. Shutting down.`);
          this._isActive = false;
          this.changeState((_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
            error: Error()
          }), CharacterState) : CharacterState).DEAD);
          (_this$movement = this.movement) == null || _this$movement.stopMovement();
          (_this$attack = this.attack) == null || _this$attack.stopAttacking(); // 不需要在这里从 SquadManager 移除，节点销毁时会自动移除

          this.enabled = false;
        }

        onTargetChanged(newTarget, oldTarget) {
          var _newTarget$getNode$na, _newTarget$getNode;

          console.log(`[${this.node.name}] AI received target changed event. New target: [${(_newTarget$getNode$na = newTarget == null || (_newTarget$getNode = newTarget.getNode()) == null ? void 0 : _newTarget$getNode.name) != null ? _newTarget$getNode$na : 'None'}]`); // this._currentTarget = newTarget; // 不再需要在这里更新缓存，runSimplePlaceholderLogic 末尾会更新
          // 简单逻辑下，不需要做太多事，update 会自然处理
        } // ... (状态管理: changeState, getCurrentState)


        changeState(newState) {
          if (this._currentState === newState || this._currentState === (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
            error: Error()
          }), CharacterState) : CharacterState).DEAD) return; // log(`[${this.node.name}] AI State Changed: ${CharacterState[this._currentState]} -> ${CharacterState[newState]}`);

          this._currentState = newState; // 根据新状态触发动画事件 (让 CharacterAnimation 监听)

          switch (newState) {
            case (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
              error: Error()
            }), CharacterState) : CharacterState).IDLE:
              this.node.emit('play-animation', 'idle', true);
              break;

            case (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
              error: Error()
            }), CharacterState) : CharacterState).MOVING:
              this.node.emit('play-animation', 'run', true);
              break;

            case (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
              error: Error()
            }), CharacterState) : CharacterState).ATTACKING:
              // 攻击动画由 AttackComponent 在 performAttack 时触发
              // 这里可以触发一个循环的"战斗待机"动画 (如果需要)
              this.node.emit('play-animation', 'idle', true); // 暂时用 idle 代替

              break;

            case (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
              error: Error()
            }), CharacterState) : CharacterState).CASTING:
              // 施法动画由 SkillComponent 控制
              break;

            case (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
              error: Error()
            }), CharacterState) : CharacterState).STUNNED:
              this.node.emit('play-animation', 'hit', true); // 假设有受击/眩晕动画

              break;

            case (_crd && CharacterState === void 0 ? (_reportPossibleCrUseOfCharacterState({
              error: Error()
            }), CharacterState) : CharacterState).DEAD:
              // 死亡动画由 HealthComponent 在 handleDeath 时触发
              break;
          }
        } // ... (getCurrentState, onDestroy)


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "stats", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "health", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "movement", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "targeting", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "attack", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "skills", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "role", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "stageCenter", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, 0, 0);
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "maxDistanceFromCenter", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=898c2a6993ee412f9db45233582a83bf3276bd25.js.map