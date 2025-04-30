System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, CharacterStats, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, MovementComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCharacterStats(extras) {
    _reporterNs.report("CharacterStats", "./CharacterStats", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIMovable(extras) {
    _reporterNs.report("IMovable", "../../common/Interfaces", _context.meta, extras);
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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "dc79bsKUmZArpmVr+vX0DjR", "MovementComponent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Vec3', 'CCFloat']);

      // 需要获取移动速度
      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 负责处理角色移动的具体执行。
       * 接收来自 AIComponent 的移动指令。
       * 可以包含操控行为 (Steering Behaviors) 或寻路逻辑。
       */

      _export("MovementComponent", MovementComponent = (_dec = ccclass('MovementComponent'), _dec2 = property(_crd && CharacterStats === void 0 ? (_reportPossibleCrUseOfCharacterStats({
        error: Error()
      }), CharacterStats) : CharacterStats), _dec(_class = (_class2 = class MovementComponent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "stats", _descriptor, this);

          // --- 操控行为参数 (Steering Behaviors) ---
          // 这些可以从 CharacterControl 迁移过来或重新设计
          this.maxForce = 1500;
          this.slowingRadius = 100;
          this.separationWeight = 155;
          this.neighborRadius = 250;
          // --- 内部状态 ---
          this._velocity = new Vec3();
          this._steeringForce = new Vec3();
          this._targetPosition = null;
          // AI 请求的目标点
          this._isMoving = false;
          this._squadMates = [];
        }

        // 用于计算分离力
        start() {
          if (!this.stats) {
            console.warn(`MovementComponent on [${this.node.name}] requires a CharacterStats component.`);
            this.enabled = false;
            return;
          }
        }
        /**
         * 由外部（如 SquadManager 或初始化脚本）设置小队成员列表
         */


        setSquadMates(mates) {
          this._squadMates = mates.filter(m => m !== this && m.isValid);
        }

        update(deltaTime) {
          if (deltaTime === 0 || !this.enabled || !this.stats) return;
          this.calculateSteeringForces(deltaTime);
          this.applySteeringToVelocity(deltaTime);
          this.updatePosition(deltaTime);
          this.updateOrientation();
        } // --- IMovable Implementation & Control --- (由 AIComponent 调用)


        moveTo(targetPosition) {
          this._targetPosition = targetPosition.clone();
          this._isMoving = true;
        }

        stopMovement() {
          if (!this._targetPosition && this._velocity.lengthSqr() < 0.1 * 0.1) {
            return;
          }

          this._targetPosition = null;
          this._isMoving = false;

          this._velocity.set(0, 0, 0);

          this._steeringForce.set(0, 0, 0);
        }

        getCurrentSpeed() {
          return this._velocity.length();
        }

        isMoving() {
          // 可以根据速度或是否有目标来判断
          return this._isMoving && this._velocity.lengthSqr() > 1.0;
        } // --- 内部移动逻辑 (可以沿用或改进 CharacterControl 的逻辑) ---


        calculateSteeringForces(deltaTime) {
          this._steeringForce.set(0, 0, 0);

          if (!this._targetPosition && this._velocity.lengthSqr() < 0.01) {
            return;
          }

          const maxSpeed = this.stats.moveSpeed;
          let arriveForce = Vec3.ZERO;

          if (this._targetPosition) {
            arriveForce = this.arrive(this._targetPosition, maxSpeed);
          } else if (this._velocity.lengthSqr() > 0.01) {
            arriveForce = this._velocity.clone().multiplyScalar(-1).normalize().multiplyScalar(this.maxForce * 0.5);
          }

          this.applyForce(arriveForce);

          if (!this._squadMates) {
            console.warn(`[${this.node.name} Movement] _squadMates is null or undefined before calling separate!`);
            this._squadMates = [];
          }

          const rawSeparationForce = this.separate(this._squadMates, maxSpeed);
          const weightedSeparationForce = rawSeparationForce.multiplyScalar(this.separationWeight);
          this.applyForce(weightedSeparationForce);
        }

        applySteeringToVelocity(deltaTime) {
          if (this._velocity.lengthSqr() < 0.01 && this._steeringForce.lengthSqr() < 0.01) {
            return;
          }

          const maxSpeed = this.stats.moveSpeed;

          if (this._steeringForce.lengthSqr() > this.maxForce * this.maxForce) {
            this._steeringForce.normalize().multiplyScalar(this.maxForce);
          }

          const acceleration = this._steeringForce.clone().multiplyScalar(deltaTime);

          this._velocity.add(acceleration);

          if (this._velocity.lengthSqr() > maxSpeed * maxSpeed) {
            this._velocity.normalize().multiplyScalar(maxSpeed);
          }
        }

        updatePosition(deltaTime) {
          if (this._velocity.lengthSqr() < 0.1 * 0.1) return; // 速度过小则不移动
          // 计算位移: deltaPos = velocity * deltaTime

          const moveDelta = this._velocity.clone().multiplyScalar(deltaTime); // 更新世界坐标


          this.node.setWorldPosition(this.node.worldPosition.clone().add(moveDelta));
        }

        updateOrientation() {
          // 仅在速度足够大时才更新朝向，避免停止时因微小抖动导致晃动
          const speedThresholdSq = 1.0 * 1.0; // 速度平方阈值，可以调整

          if (this._velocity.lengthSqr() > speedThresholdSq) {
            // 根据速度方向更新节点朝向 (左右翻转)
            if (Math.abs(this._velocity.x) > 0.1) {
              // 假设模型默认朝左
              const currentScaleX = Math.abs(this.node.scale.x);
              this.node.scale = new Vec3(this._velocity.x < 0 ? currentScaleX : -currentScaleX, this.node.scale.y, this.node.scale.z);
            }
          } // else { // 速度小时不更新朝向，保持上一次的朝向
          //    console.warn("Speed too low, skipping orientation update.");
          // }

        } // --- 操控行为实现 (从 CharacterControl 迁移并适配) ---


        arrive(target, maxSpeed) {
          const desired = target.clone().subtract(this.node.worldPosition);
          const distance = desired.length();

          if (distance < 1) {
            // 非常近时直接停止
            this._velocity.set(0, 0, 0);

            this._isMoving = false;
            return Vec3.ZERO;
          }

          let desiredSpeed = maxSpeed;

          if (distance < this.slowingRadius) {
            desiredSpeed = maxSpeed * (distance / this.slowingRadius);
            desiredSpeed = Math.max(desiredSpeed, 5); // 保证一个最小移动速度
          }

          desired.normalize().multiplyScalar(desiredSpeed);
          const steer = desired.subtract(this._velocity);
          return steer;
        }

        separate(neighbors, maxSpeed) {
          const desiredSeparation = this.neighborRadius * 0.8;
          const steer = new Vec3();
          let count = 0;

          if (neighbors) {
            for (const otherComp of neighbors) {
              if (!otherComp || !otherComp.isValid || !otherComp.node) continue;
              const otherNode = otherComp.node;
              const dist = Vec3.distance(this.node.worldPosition, otherNode.worldPosition);

              if (dist > 0 && dist < desiredSeparation) {
                const diff = this.node.worldPosition.clone().subtract(otherNode.worldPosition);
                diff.normalize();
                diff.multiplyScalar(1.0 / dist);
                steer.add(diff);
                count++;
              }
            }
          }

          if (count > 0) {
            steer.multiplyScalar(1.0 / count);
          }

          let finalSteer = Vec3.ZERO.clone();

          if (steer.lengthSqr() > 0) {
            steer.normalize().multiplyScalar(maxSpeed);
            finalSteer = steer.subtract(this._velocity);
          }

          return finalSteer;
        }

        applyForce(force) {
          this._steeringForce.add(force);
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
//# sourceMappingURL=63dce921e4d0fbd6def7f003df803f48ca4cb9a5.js.map