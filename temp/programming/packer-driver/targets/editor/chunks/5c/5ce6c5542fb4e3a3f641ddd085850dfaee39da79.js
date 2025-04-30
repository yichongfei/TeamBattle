System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, Camera, CCFloat, Rect, view, math, BossManager, HealthComponent, PlayerSquadManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, CameraFollow;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBossManager(extras) {
    _reporterNs.report("BossManager", "./BossManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHealthComponent(extras) {
    _reporterNs.report("HealthComponent", "./characters/components/HealthComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerSquadManager(extras) {
    _reporterNs.report("PlayerSquadManager", "./PlayerSquadManager", _context.meta, extras);
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
      Camera = _cc.Camera;
      CCFloat = _cc.CCFloat;
      Rect = _cc.Rect;
      view = _cc.view;
      math = _cc.math;
    }, function (_unresolved_2) {
      BossManager = _unresolved_2.BossManager;
    }, function (_unresolved_3) {
      HealthComponent = _unresolved_3.HealthComponent;
    }, function (_unresolved_4) {
      PlayerSquadManager = _unresolved_4.PlayerSquadManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e88ae3VKfxNd6lTwrJkUokQ", "CameraFollow", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Camera', 'CCFloat', 'Rect', 'view', 'math', 'isValid']); // 引入 PlayerSquadManager


      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 控制摄像机智能跟随团队和 Boss，并动态调整视野。
       * - 位置聚焦于玩家小队中心。
       * - 视野缩放以包含所有存活玩家和存活 Boss。
       */

      _export("CameraFollow", CameraFollow = (_dec = ccclass('CameraFollow'), _dec2 = property({
        type: _crd && PlayerSquadManager === void 0 ? (_reportPossibleCrUseOfPlayerSquadManager({
          error: Error()
        }), PlayerSquadManager) : PlayerSquadManager,
        tooltip: '玩家小队管理器实例'
      }), _dec3 = property({
        type: _crd && BossManager === void 0 ? (_reportPossibleCrUseOfBossManager({
          error: Error()
        }), BossManager) : BossManager,
        tooltip: 'Boss管理器实例，用于获取当前 Boss 位置'
      }), _dec4 = property({
        type: CCFloat,
        tooltip: '摄像机位置跟随的平滑度 (0-1, 值越小越慢)',
        range: [0, 1, 0.01],
        slide: true
      }), _dec5 = property({
        type: CCFloat,
        tooltip: '视野边界的额外填充比例 (基于计算出的高度/宽度)',
        range: [0, 1, 0.05],
        slide: true
      }), _dec6 = property({
        type: CCFloat,
        tooltip: '最小正交高度 (防止缩放过小)'
      }), _dec7 = property({
        type: CCFloat,
        tooltip: '最大正交高度 (防止缩放过大)'
      }), _dec(_class = (_class2 = class CameraFollow extends Component {
        constructor(...args) {
          super(...args);

          // 移除 playerCharacterTag
          // @property({
          //     type: String,
          //     tooltip: '标识玩家控制角色的标签'
          // })
          // playerCharacterTag: string = "PlayerCharacter";
          // 添加 PlayerSquadManager 引用
          _initializerDefineProperty(this, "playerSquadManager", _descriptor, this);

          _initializerDefineProperty(this, "bossManager", _descriptor2, this);

          _initializerDefineProperty(this, "positionLerpFactor", _descriptor3, this);

          _initializerDefineProperty(this, "padding", _descriptor4, this);

          // 20% 的填充
          _initializerDefineProperty(this, "minOrthoHeight", _descriptor5, this);

          _initializerDefineProperty(this, "maxOrthoHeight", _descriptor6, this);

          // 移除 squadFocusWeight，因为现在总是聚焦小队中心
          // @property({
          //     type: CCFloat,
          //     tooltip: '团队中心在焦点计算中的权重 (0-1)',
          //     range: [0, 1, 0.05],
          //     slide: true
          // })
          // squadFocusWeight: number = 0.6;

          /** @internal */
          this.camera = null;

          /** @internal */
          this.initialZ = 0;
        }

        start() {
          this.camera = this.getComponent(Camera);

          if (!this.camera) {
            console.warn('CameraFollow: 节点上缺少 Camera 组件。');
            this.enabled = false;
            return;
          } // 检查 PlayerSquadManager 是否链接


          if (!this.playerSquadManager) {
            console.warn('CameraFollow: 未在编辑器中指定 PlayerSquadManager。'); // 可能需要禁用或提供默认行为

            this.enabled = false;
            return;
          }

          if (!this.bossManager) {// BossManager 可能不是必需的，取决于游戏逻辑
            // warn('CameraFollow: 未指定 BossManager。');
          }

          this.initialZ = this.node.position.z;
          console.log(`CameraFollow: Initial Z position recorded: ${this.initialZ}`);
        }

        lateUpdate(deltaTime) {
          if (!this.camera || !this.enabled || !this.playerSquadManager) {
            // log("CameraFollow: lateUpdate skipped - camera, component disabled, or PlayerSquadManager missing.");
            return;
          } // --- 1. 获取存活角色和 Boss --- 


          const alivePlayerNodes = this.playerSquadManager.getAlivePlayerCharacters();
          let currentBoss = null;

          if (this.bossManager) {
            const bosses = this.bossManager.getActiveBosses(); // 假设 BossManager 已经过滤了无效/死亡 Boss

            if (bosses && bosses.length > 0) {
              var _currentBoss;

              currentBoss = bosses[0]; // 简化处理，只考虑第一个 Boss

              const bossHealth = (_currentBoss = currentBoss) == null ? void 0 : _currentBoss.getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
                error: Error()
              }), HealthComponent) : HealthComponent);

              if (!currentBoss || !currentBoss.isValid || !bossHealth || !bossHealth.isAlive()) {
                currentBoss = null; // 无效或死亡的 Boss
              }
            }
          } // 如果没有任何存活单位，不进行操作


          if (alivePlayerNodes.length === 0 && !currentBoss) {
            return;
          } // --- 2. 计算小队中心点 (用于摄像机定位) --- 


          let squadCenterPosition = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y, 0); // Fallback to current camera XY

          if (alivePlayerNodes.length > 0) {
            const totalPos = new Vec3();
            alivePlayerNodes.forEach(node => {
              totalPos.add(node.worldPosition);
            });
            squadCenterPosition = totalPos.multiplyScalar(1 / alivePlayerNodes.length);
          } else if (currentBoss) {
            squadCenterPosition.set(currentBoss.worldPosition);
          } // --- 3. 准备计算边界的点集 (用于视野缩放) --- 
          // this.pointsForBounds.length = 0;
          // alivePlayerNodes.forEach(node => this.pointsForBounds.push(node.worldPosition));
          // if (currentBoss) {
          //     this.pointsForBounds.push(currentBoss.worldPosition);
          // }
          //
          // // 如果 pointsForBounds 为空 (理论上不会到这里，因为前面有检查)，则添加小队中心点作为参考
          // if (this.pointsForBounds.length === 0) {
          //      this.pointsForBounds.push(squadCenterPosition.clone());
          // }
          //
          // // --- 4. 计算边界和视野 --- 
          // const bounds = this.calculateBoundingBox(this.pointsForBounds);
          // let desiredOrthoHeight = this.calculateDesiredOrthoHeight(bounds);
          // desiredOrthoHeight = math.clamp(desiredOrthoHeight, this.minOrthoHeight, this.maxOrthoHeight);
          // log(`[${this.node.name}] lateUpdate: Bounds Center: (${bounds.center.x.toFixed(1)}, ${bounds.center.y.toFixed(1)}), Desired OrthoHeight: ${desiredOrthoHeight.toFixed(1)}`);
          // --- 5. 应用平滑移动 --- 
          // 位置: 移动到小队中心点


          const targetCameraPos = new Vec3(squadCenterPosition.x, squadCenterPosition.y, this.initialZ);
          const currentPos = this.node.position;
          const newPos = new Vec3();
          Vec3.lerp(newPos, currentPos, targetCameraPos, this.positionLerpFactor); // 这里的 targetCameraPos 是世界坐标，而 node.position 是父节点下的局部坐标，需要转换
          // --- 修正：将世界坐标目标转换为摄像机节点的局部坐标 --- 

          let localTargetPos = new Vec3();

          if (this.node.parent) {
            // 确保摄像机有父节点 (通常是 Scene)
            const parentWorldMatrix = this.node.parent.worldMatrix;
            const invParentWorldMatrix = new math.Mat4();
            math.Mat4.invert(invParentWorldMatrix, parentWorldMatrix);
            Vec3.transformMat4(localTargetPos, targetCameraPos, invParentWorldMatrix);
          } else {
            localTargetPos = targetCameraPos;
          } // 使用转换后的局部坐标进行 lerp


          Vec3.lerp(newPos, this.node.position, localTargetPos, this.positionLerpFactor); // --- 修正结束 ---

          this.node.setPosition(newPos); // --- 视野缩放逻辑已禁用 ---
          // const currentOrthoHeight = this.camera.orthoHeight;
          // const newOrthoHeight = math.lerp(currentOrthoHeight, desiredOrthoHeight, this.zoomLerpFactor);
          // this.camera.orthoHeight = newOrthoHeight;
        } // 移除 findAndAddPlayersRecursive
        // private findAndAddPlayersRecursive(parentNode: Node, playerTag: string): void { ... }

        /**
         * 计算包含所有给定点的最小边界框 (世界坐标)
         * @param points Vec3 世界坐标点数组
         * @returns Rect 边界框
         */


        calculateBoundingBox(points) {
          if (!points || points.length === 0) {
            // 如果没有点，返回一个以摄像机当前位置为中心的小矩形
            const currentPos = this.node.worldPosition;
            return new Rect(currentPos.x - 1, currentPos.y - 1, 2, 2);
          }

          let minX = points[0].x;
          let maxX = points[0].x;
          let minY = points[0].y;
          let maxY = points[0].y;

          for (let i = 1; i < points.length; i++) {
            minX = Math.min(minX, points[i].x);
            maxX = Math.max(maxX, points[i].x);
            minY = Math.min(minY, points[i].y);
            maxY = Math.max(maxY, points[i].y);
          }

          return new Rect(minX, minY, maxX - minX, maxY - minY);
        }
        /**
         * 根据目标边界框计算理想的正交高度
         * @param bounds 包含所有目标的边界框 (世界坐标)
         * @returns 理想的 orthoHeight
         */


        calculateDesiredOrthoHeight(bounds) {
          // 考虑填充
          const paddedWidth = bounds.width * (1 + this.padding);
          const paddedHeight = bounds.height * (1 + this.padding); // 获取屏幕宽高比

          const screenSize = view.getVisibleSize();
          const aspectRatio = screenSize.width / screenSize.height; // 计算所需的 orthoHeight

          const orthoHeightBasedOnWidth = paddedWidth / aspectRatio / 2;
          const orthoHeightBasedOnHeight = paddedHeight / 2; // 取两者中较大的值，确保都能容纳
          // 同时确保 orthoHeight 不会是 NaN 或 Infinity (例如当 bounds.width/height 为 0 时)

          let height = Math.max(orthoHeightBasedOnWidth, orthoHeightBasedOnHeight);

          if (isNaN(height) || !isFinite(height)) {
            height = this.minOrthoHeight; // Fallback to min height
          }

          return Math.max(this.minOrthoHeight, height); // 确保至少是最小高度
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "playerSquadManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bossManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "positionLerpFactor", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.08;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "padding", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "minOrthoHeight", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 300;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxOrthoHeight", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1200;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5ce6c5542fb4e3a3f641ddd085850dfaee39da79.js.map