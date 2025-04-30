System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sp, Vec3, CCFloat, log, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, CharacterState, CharacterControl;

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
      sp = _cc.sp;
      Vec3 = _cc.Vec3;
      CCFloat = _cc.CCFloat;
      log = _cc.log;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4cf02+2IfRLiIS2ykfXyiqZ", "CharacterControl", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'sp', 'Vec3', 'CCFloat', 'Vec2', 'warn', 'log']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 角色状态枚举
       */

      _export("CharacterState", CharacterState = /*#__PURE__*/function (CharacterState) {
        CharacterState[CharacterState["IDLE"] = 0] = "IDLE";
        CharacterState[CharacterState["PATROL"] = 1] = "PATROL";
        CharacterState[CharacterState["CHASE"] = 2] = "CHASE";
        CharacterState[CharacterState["ATTACK"] = 3] = "ATTACK";
        CharacterState[CharacterState["HIT"] = 4] = "HIT";
        CharacterState[CharacterState["STUN"] = 5] = "STUN";
        CharacterState[CharacterState["DIE"] = 6] = "DIE";
        CharacterState[CharacterState["VICTORY"] = 7] = "VICTORY";
        return CharacterState;
      }({}));
      /**
       * 角色控制基类，使用操控行为处理移动、动画、状态管理等通用逻辑。
       */


      _export("CharacterControl", CharacterControl = (_dec = ccclass('CharacterControl'), _dec2 = property({
        type: CCFloat,
        tooltip: '角色的最大移动速度'
      }), _dec3 = property({
        type: CCFloat,
        tooltip: '施加转向力的最大限制'
      }), _dec4 = property({
        type: sp.Skeleton,
        tooltip: '关联的 Spine 动画组件'
      }), _dec5 = property({
        type: CCFloat,
        tooltip: '检测邻居的半径'
      }), _dec6 = property({
        type: CCFloat,
        tooltip: '分离力的权重'
      }), _dec7 = property({
        type: CCFloat,
        tooltip: '到达目标时开始减速的半径'
      }), _dec(_class = (_class2 = class CharacterControl extends Component {
        constructor() {
          super(...arguments);

          // --- 基本属性 ---
          _initializerDefineProperty(this, "maxSpeed", _descriptor, this);

          _initializerDefineProperty(this, "maxForce", _descriptor2, this);

          _initializerDefineProperty(this, "spineAnimation", _descriptor3, this);

          // --- 操控行为属性 ---
          _initializerDefineProperty(this, "neighborRadius", _descriptor4, this);

          _initializerDefineProperty(this, "separationWeight", _descriptor5, this);

          _initializerDefineProperty(this, "slowingRadius", _descriptor6, this);

          // --- 内部状态 ---

          /** @internal */
          this._currentState = CharacterState.IDLE;

          /** @internal */
          this.velocity = new Vec3();

          /** @internal */
          this.steeringTarget = null;

          /** @internal */
          this.steeringForce = new Vec3();

          /** @internal */
          this.squadMates = [];
        }

        // --- Getter/Setter ---
        get currentState() {
          return this._currentState;
        } // --- 初始化 ---


        start() {// 初始化是被动的，等待 SquadManager
        }
        /**
         * 由 SquadManager 调用，提供其他小队成员的列表。
         * @param mates 其他成员的 CharacterControl 列表
         */


        setSquadMates(mates) {
          this.squadMates = mates.filter(m => m !== this);
        } // --- 更新逻辑 ---


        update(deltaTime) {
          if (deltaTime === 0 || !this.enabled) return; // 重置本帧的操控力

          this.steeringForce.set(0, 0, 0); // 根据当前状态和目标计算操控力

          this.calculateSteeringForces(); // 应用操控力到速度

          this.applySteeringToVelocity(deltaTime); // 根据速度更新位置

          this.updatePosition(deltaTime); // 更新动画和朝向

          this.updateAnimationAndOrientation();
        }
        /** @internal */


        calculateSteeringForces() {
          var targetForce = new Vec3();

          if (this.steeringTarget) {
            // 如果有目标，使用 Arrive 行为
            targetForce = this.arrive(this.steeringTarget);
          } else {
            // 如果没有目标，应用刹车力（与当前速度相反）
            if (this.velocity.lengthSqr() > 0.1) {
              targetForce = this.velocity.clone().multiplyScalar(-1).normalize().multiplyScalar(this.maxForce * 0.5);
            } else {
              // 如果几乎停止，确保速度变为零
              this.velocity.set(0, 0, 0);
            }
          }

          this.applyForce(targetForce); // 计算与附近队友的分离力

          var separationForce = this.separate(this.squadMates);
          this.applyForce(separationForce.multiplyScalar(this.separationWeight));
        }
        /** @internal */


        applySteeringToVelocity(deltaTime) {
          // 限制操控力
          if (this.steeringForce.lengthSqr() > this.maxForce * this.maxForce) {
            this.steeringForce.normalize().multiplyScalar(this.maxForce);
          } // 将力应用到速度: velocity += steeringForce * deltaTime


          this.velocity.add(this.steeringForce.clone().multiplyScalar(deltaTime)); // 限制速度到最大速度

          if (this.velocity.lengthSqr() > this.maxSpeed * this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
          }
        }
        /** @internal */


        updatePosition(deltaTime) {
          // 1) 先算本帧移动的世界量
          var moveDelta = this.velocity.clone().multiplyScalar(deltaTime); // 2) 在世界坐标系下更新位置

          var newWorld = this.node.worldPosition.clone().add(moveDelta);
          this.node.setWorldPosition(newWorld);
        }
        /** @internal */


        updateAnimationAndOrientation() {
          var _this$spineAnimation;

          // 根据速度确定动画
          var speedSqr = this.velocity.lengthSqr();
          var desiredAnim = 'idle';

          if (speedSqr > 1.0) {
            desiredAnim = 'run';
          } // 只在需要时更改动画


          var currentAnim = (_this$spineAnimation = this.spineAnimation) == null ? void 0 : _this$spineAnimation.animation;

          if (currentAnim !== desiredAnim) {
            this.playAnimation(desiredAnim, true);
          } // 根据速度方向更新朝向


          if (speedSqr > 0.1) {
            var directionX = this.velocity.x;

            if (Math.abs(directionX) > 0.01) {
              // 假设原始资产面向左侧
              this.node.scale = new Vec3(directionX < 0 ? 1 : -1, 1, 1);
            }
          }
        } // --- 操控行为 ---

        /**
         * 计算平滑到达目标位置的操控力 (Arrive 行为)。
         * @param target 目标位置
         * @returns 计算出的到达力向量
         */


        arrive(target) {
          var desired = target.clone().subtract(this.node.worldPosition);
          var distance = desired.length(); // 非常接近时直接设置位置并停止

          if (distance < 5) {
            log("\u89D2\u8272 " + this.node.name + ": \u5230\u8FBE\u76EE\u6807\u70B9!");
            this.velocity.set(0, 0, 0);
            this.steeringTarget = null;
            return Vec3.ZERO;
          }

          var desiredSpeed = this.maxSpeed;
          var effectiveSlowingRadius = this.slowingRadius; // 在减速半径内调整期望速度

          if (distance < effectiveSlowingRadius) {
            desiredSpeed = this.maxSpeed * (distance / Math.max(effectiveSlowingRadius, 0.1));
            desiredSpeed = Math.max(desiredSpeed, 5);
          } // 计算期望速度向量


          if (distance > 0.1) {
            desired.normalize().multiplyScalar(desiredSpeed);
          } else {
            desired.set(0, 0, 0);

            if (this.velocity.lengthSqr() < 1.0) {
              this.velocity.set(0, 0, 0);
            }
          } // 转向力 = 期望速度 - 当前速度


          var steer = desired.subtract(this.velocity); // 如果非常接近目标，增加转向力的强度以确保能到达

          if (distance < 20) {
            steer.multiplyScalar(3.0);
          }

          return steer;
        }
        /**
         * 计算与附近邻居分离的操控力。
         * @param neighbors 潜在邻居列表（其他小队成员）
         * @returns 计算出的分离力向量
         */


        separate(neighbors) {
          var desiredSeparation = this.neighborRadius * 0.8;
          var steer = new Vec3();
          var count = 0;

          for (var other of neighbors) {
            if (!other || !other.isValid || other === this) continue;
            var distance = Vec3.distance(this.node.position, other.node.position); // 检查其他角色是否是邻居（在半径内）

            if (distance > 0 && distance < desiredSeparation) {
              // 计算指向远离邻居的力向量
              var diff = this.node.position.clone().subtract(other.node.position);
              diff.normalize();
              diff.multiplyScalar(1.0 / distance);
              steer.add(diff);
              count++;
            }
          } // 如果有邻居，对转向向量取平均值


          if (count > 0) {
            steer.multiplyScalar(1.0 / count);
          } // 如果分离力显著，将其缩放到最大速度


          if (steer.lengthSqr() > 0) {
            steer.normalize().multiplyScalar(this.maxSpeed); // 转向力 = 期望分离速度 - 当前速度

            steer.subtract(this.velocity);
          }

          return steer;
        }
        /**
         * 对角色施加一个操控力。
         * @param force 要施加的力向量
         */


        applyForce(force) {
          this.steeringForce.add(force);
        } // --- 供 SquadManager 使用的公共方法 ---

        /**
         * 设置角色的操控目标。
         * @param target 世界坐标目标，或 null 表示停止/刹车
         */


        setSteeringTarget(target) {
          this.steeringTarget = target ? target.clone() : null;
        }
        /**
         * 切换角色状态。
         * @param newState 要切换到的新状态
         */


        changeState(newState) {
          if (this._currentState === newState) return;
          log("\u89D2\u8272 " + this.node.name + " \u72B6\u6001\u6539\u53D8: " + CharacterState[this._currentState] + " -> " + CharacterState[newState]);
          this._currentState = newState;

          switch (newState) {
            case CharacterState.IDLE:
              this.velocity.set(0, 0, 0);
              this.playAnimation('idle', true);
              break;

            case CharacterState.PATROL:
              break;

            case CharacterState.CHASE:
              break;

            case CharacterState.ATTACK:
              this.velocity.set(0, 0, 0);
              this.playAnimation('attack', false);
              break;

            case CharacterState.DIE:
              this.velocity.set(0, 0, 0);
              this.playAnimation('die', false);
              this.enabled = false;
              break;
          }
        }
        /**
         * 播放指定的 Spine 动画。
         * @param animName 动画名称 (需要与 Spine 文件中的名称一致)
         * @param loop 是否循环播放
         */


        playAnimation(animName, loop) {
          if (loop === void 0) {
            loop = true;
          }

          if (!this.spineAnimation) {
            return;
          }

          var currentTrackEntry = this.spineAnimation.getCurrent(0);

          if (!currentTrackEntry || currentTrackEntry.animation.name !== animName || loop) {
            if (currentTrackEntry && currentTrackEntry.animation.name === animName && !loop) {} else {
              this.spineAnimation.setAnimation(0, animName, loop);
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxForce", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 500;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spineAnimation", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "neighborRadius", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 80;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "separationWeight", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "slowingRadius", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8b7147d6c6af83e103c47bf6ec0805989be965fc.js.map