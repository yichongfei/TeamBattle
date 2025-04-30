System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, Rect, CCFloat, CCInteger, isValid, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, BossManager;

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
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
      Rect = _cc.Rect;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      isValid = _cc.isValid;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4d16fz/gFJFia5LwsoJHhA/", "BossManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'UITransform', 'Rect', 'CCFloat', 'CCInteger', 'isValid']);

      ({
        ccclass,
        property
      } = _decorator); // 引入 Boss 控制脚本 (假设我们后面会创建它)
      // import { BossControl } from './BossControl'; 

      /**
       * 管理 Boss 在指定区域内的生成。
       */

      _export("BossManager", BossManager = (_dec = ccclass('BossManager'), _dec2 = property({
        type: Prefab,
        tooltip: 'Boss 的预制体资源'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Boss 生成的区域节点 (例如你的 Map 节点)'
      }), _dec4 = property({
        type: CCFloat,
        tooltip: 'Boss 生成的时间间隔 (秒)，0 或负数表示不自动生成'
      }), _dec5 = property({
        type: CCInteger,
        tooltip: '场上允许存在的最大 Boss 数量'
      }), _dec(_class = (_class2 = class BossManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bossPrefab", _descriptor, this);

          _initializerDefineProperty(this, "spawnAreaNode", _descriptor2, this);

          _initializerDefineProperty(this, "spawnInterval", _descriptor3, this);

          _initializerDefineProperty(this, "maxBosses", _descriptor4, this);

          /**
           * 当前存活的 Boss 节点列表
           * @internal
           */
          this.activeBosses = [];

          /**
           * Boss 生成区域的边界 (世界坐标)
           * @internal
           */
          this.spawnBounds = null;
        }

        start() {
          if (!this.bossPrefab) {
            console.warn('BossManager: Boss Prefab 未指定!');
            this.enabled = false;
            return;
          }

          if (!this.spawnAreaNode) {
            console.warn('BossManager: Spawn Area Node 未指定!');
            this.enabled = false;
            return;
          }

          this.calculateSpawnBounds();

          if (this.spawnInterval > 0) {
            this.schedule(this.trySpawnBoss, this.spawnInterval);
            console.log("BossManager: \u5DF2\u542F\u52A8 Boss \u751F\u6210\u5B9A\u65F6\u5668\uFF0C\u95F4\u9694: " + this.spawnInterval + "\u79D2");
            this.trySpawnBoss();
          } else {
            console.log('BossManager: spawnInterval <= 0, 不会自动生成 Boss。');
          }
        }
        /**
         * 计算生成区域节点的世界坐标边界框。
         */


        calculateSpawnBounds() {
          var uiTransform = this.spawnAreaNode.getComponent(UITransform);

          if (!uiTransform) {
            console.warn('BossManager: Spawn Area Node 缺少 UITransform 组件!');
            this.spawnBounds = new Rect(this.spawnAreaNode.worldPosition.x - 50, this.spawnAreaNode.worldPosition.y - 50, 100, 100);
            return;
          }

          this.spawnBounds = uiTransform.getBoundingBoxToWorld();
          console.log("BossManager: \u751F\u6210\u533A\u57DF\u8FB9\u754C\u8BA1\u7B97\u5B8C\u6210 (\u4E16\u754C\u5750\u6807): x=" + this.spawnBounds.x.toFixed(0) + ", y=" + this.spawnBounds.y.toFixed(0) + ", w=" + this.spawnBounds.width.toFixed(0) + ", h=" + this.spawnBounds.height.toFixed(0));
        }
        /**
         * 如果未达到最大数量限制，尝试生成一个 Boss。
         */


        trySpawnBoss() {
          this.activeBosses = this.activeBosses.filter(boss => boss && isValid(boss, true));

          if (this.activeBosses.length >= this.maxBosses) {
            return;
          }

          this.spawnBoss();
        }
        /**
         * 在生成边界内的一个随机位置生成一个 Boss。
         * (修改为：在固定位置生成以便测试)
         */


        spawnBoss() {
          var spawnPos = new Vec3(150, 0, 0);
          console.warn("BossManager: Spawning Boss at fixed test position: (" + spawnPos.x + ", " + spawnPos.y + ")");
          var newBoss = instantiate(this.bossPrefab);

          if (!newBoss) {
            console.warn('BossManager: 实例化 Boss Prefab 失败!');
            return;
          }

          this.node.addChild(newBoss);
          newBoss.setWorldPosition(spawnPos);
          this.activeBosses.push(newBoss);
          console.log("BossManager: Boss \u5DF2\u5728 (" + spawnPos.x.toFixed(0) + ", " + spawnPos.y.toFixed(0) + ") \u751F\u6210! \u5F53\u524D\u6570\u91CF: " + this.activeBosses.length); // 获取 BossControl 脚本并设置回调 (如果需要)
          // const bossControl = newBoss.getComponent(BossControl);
          // if (bossControl) {
          //     bossControl.init(this); // 假设 BossControl 有一个 init 方法接收 BossManager 引用
          // }
          // TODO: 发出 Boss 生成事件，通知 SquadManager 等系统
          // this.node.emit('boss-spawned', newBoss);
        }
        /**
         * 当一个 Boss 被销毁时由 BossControl 调用。
         * @param bossNode 被销毁的 Boss 节点
         */


        onBossDestroyed(bossNode) {
          var index = this.activeBosses.indexOf(bossNode);

          if (index !== -1) {
            this.activeBosses.splice(index, 1);
            console.log("BossManager: \u4E00\u4E2A Boss \u88AB\u9500\u6BC1\u3002\u5F53\u524D\u6570\u91CF: " + this.activeBosses.length);
          } else {
            console.warn('BossManager: 尝试移除一个不在列表中的 Boss。');
          } // 如果数量低于上限，可以考虑立即尝试生成新的？或者等待下一个间隔
          // this.trySpawnBoss();

        }
        /**
         * 获取当前存活的 Boss 节点列表。
         * @returns 活动 Boss 列表
         */


        getActiveBosses() {
          // 返回前再次过滤无效节点，确保列表干净
          this.activeBosses = this.activeBosses.filter(boss => boss && isValid(boss, true));
          return this.activeBosses;
        }
        /**
         * 获取距离指定位置最近的存活 Boss。
         * @param position 参考位置 (世界坐标)
         * @returns 最近的 Boss 节点，如果没有存活 Boss 则返回 null。
         */


        getNearestBoss(position) {
          var bosses = this.getActiveBosses();

          if (bosses.length === 0) {
            return null;
          }

          var nearestBoss = null;
          var minDistanceSq = Infinity;
          bosses.forEach(boss => {
            var distanceSq = Vec3.squaredDistance(position, boss.worldPosition);

            if (distanceSq < minDistanceSq) {
              minDistanceSq = distanceSq;
              nearestBoss = boss;
            }
          });
          return nearestBoss;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bossPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spawnAreaNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spawnInterval", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10.0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxBosses", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=332a3dfb80942f20aefb57c715f85020ec9267d5.js.map