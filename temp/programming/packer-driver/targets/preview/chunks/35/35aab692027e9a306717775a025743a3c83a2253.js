System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, isValid, find, HealthComponent, Vec3, MovementComponent, _dec, _class, _class2, _crd, ccclass, property, PlayerSquadManager;

  function _reportPossibleCrUseOfHealthComponent(extras) {
    _reporterNs.report("HealthComponent", "./characters/components/HealthComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMovementComponent(extras) {
    _reporterNs.report("MovementComponent", "./characters/components/MovementComponent", _context.meta, extras);
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
      isValid = _cc.isValid;
      find = _cc.find;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      HealthComponent = _unresolved_2.HealthComponent;
    }, function (_unresolved_3) {
      MovementComponent = _unresolved_3.MovementComponent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0e505NVD0ZFtKFlPD6UaiV9", "PlayerSquadManager", undefined);

      // 静态导入 HealthComponent 类型，避免循环依赖和动态导入问题
      __checkObsolete__(['_decorator', 'Component', 'Node', 'isValid', 'find']);

      __checkObsolete__(['Vec3']);

      ({
        ccclass,
        property
      } = _decorator); // // 定义一个接口来存储角色信息（备选方案）
      // interface SquadMemberInfo {
      //     node: Node;
      //     squadIndex: number;
      // }

      /**
       * 管理所有玩家控制的角色单元。
       * 负责：
       * 1. 存储所有玩家角色节点及其唯一的小队索引。
       * 2. 提供获取存活角色列表和查询角色索引的方法。
       */

      _export("PlayerSquadManager", PlayerSquadManager = (_dec = ccclass('PlayerSquadManager'), _dec(_class = (_class2 = class PlayerSquadManager extends Component {
        constructor() {
          super(...arguments);
          // 移除编辑器直接指定的数组，改为动态管理
          // @property({
          //     type: [Node],
          //     tooltip: '玩家小队所有成员的根节点列表'
          // })
          // playerCharacters: Node[] = [];
          // 使用 Map 存储角色 Node 和对应的 squadIndex
          this.squadMembers = new Map();
          this.nextSquadIndex = 0;
        }

        static get instance() {
          if (!PlayerSquadManager._instance || !isValid(PlayerSquadManager._instance.node)) {
            PlayerSquadManager._instance = null;
            var managerNode = find("PlayerSquadManagerNode");

            if (managerNode) {
              PlayerSquadManager._instance = managerNode.getComponent(PlayerSquadManager);

              if (!PlayerSquadManager._instance) {
                // 使用 console.warn
                console.warn("PlayerSquadManager: Node found, but component missing.");
              }
            } else {
              // 使用 console.warn
              console.warn("PlayerSquadManager: Instance not found in scene.");
            }
          }

          return PlayerSquadManager._instance;
        }

        onLoad() {
          if (PlayerSquadManager._instance && PlayerSquadManager._instance !== this) {
            // 使用 console.warn
            console.warn("PlayerSquadManager: Multiple instances detected. Destroying this one.");
            this.destroy();
            return;
          }

          PlayerSquadManager._instance = this; // 使用 console.log

          console.log("PlayerSquadManager initialized.");
        }

        start() {// 清理日志
        }
        /**
         * 获取当前所有存活的玩家角色节点列表。
         * @returns Node[] 存活的玩家角色节点数组
         */


        getAlivePlayerCharacters() {
          var aliveNodes = [];
          this.squadMembers.forEach((index, node) => {
            if (node && isValid(node)) {
              var healthComp = node.getComponent(_crd && HealthComponent === void 0 ? (_reportPossibleCrUseOfHealthComponent({
                error: Error()
              }), HealthComponent) : HealthComponent);

              if (healthComp && healthComp.isAlive()) {
                aliveNodes.push(node);
              }
            }
          }); // 可以选择按 squadIndex 排序，虽然 CameraFollow 不需要
          // aliveNodes.sort((a, b) => (this.squadMembers.get(a) ?? 0) - (this.squadMembers.get(b) ?? 0));

          return aliveNodes;
        }
        /**
         * 获取所有已注册的角色节点列表 (无论死活)。
         * @returns Node[] 所有注册的角色节点数组
         */


        getAllPlayerCharacters() {
          return Array.from(this.squadMembers.keys()).filter(node => node && isValid(node));
        }
        /**
         * 添加一个角色到管理器，并分配一个 squadIndex。
         * @param characterNode 要添加的角色节点
         * @returns 分配的 squadIndex，如果添加失败则返回 -1
         */


        addCharacter(characterNode) {
          var _characterNode$name;

          if (characterNode && isValid(characterNode) && !this.squadMembers.has(characterNode)) {
            var assignedIndex = this.nextSquadIndex++;
            this.squadMembers.set(characterNode, assignedIndex); // 使用 console.log

            console.log("PlayerSquadManager: Character [" + characterNode.name + "] added with squadIndex " + assignedIndex + ". Total: " + this.squadMembers.size);
            characterNode.once('destroy', () => {
              this.removeCharacter(characterNode);
            });
            return assignedIndex;
          } // 使用 console.warn


          console.warn("PlayerSquadManager: Failed to add character [" + ((_characterNode$name = characterNode == null ? void 0 : characterNode.name) != null ? _characterNode$name : 'Invalid Node') + "]");
          return -1;
        }

        broadcastSquadLists() {
          var all = this.getAlivePlayerCharacters();
          all.forEach(node => {
            var move = node.getComponent(_crd && MovementComponent === void 0 ? (_reportPossibleCrUseOfMovementComponent({
              error: Error()
            }), MovementComponent) : MovementComponent);

            if (move) {
              move.setSquadMates(all.map(n => n.getComponent(_crd && MovementComponent === void 0 ? (_reportPossibleCrUseOfMovementComponent({
                error: Error()
              }), MovementComponent) : MovementComponent)));
            }
          });
        }
        /**
        * 从管理器移除一个角色。
        * 通常在角色节点销毁时自动调用。
        * @param characterNode 要移除的角色节点
        */


        removeCharacter(characterNode) {
          if (this.squadMembers.has(characterNode)) {
            var removedIndex = this.squadMembers.get(characterNode);
            this.squadMembers.delete(characterNode); // 使用 console.log

            console.log("PlayerSquadManager: Character [" + characterNode.name + "] (Index " + removedIndex + ") removed. Total: " + this.squadMembers.size);
          } else {// 可能在 DESTROY 事件触发前已经被手动移除
            // warn(`PlayerSquadManager: Tried to remove character [${characterNode?.name}] which was not found.`);
          }
        }
        /**
         * 获取指定角色节点的 squadIndex。
         * @param characterNode 要查询的角色节点
         * @returns 对应的 squadIndex，如果未找到则返回 -1
         */


        getSquadIndex(characterNode) {
          var _this$squadMembers$ge;

          // 清理日志
          return (_this$squadMembers$ge = this.squadMembers.get(characterNode)) != null ? _this$squadMembers$ge : -1;
        }
        /**
         * 获取当前小队总人数 (包括死亡的，只要注册过且未销毁)。
         * @returns number 小队总人数
         */


        getTotalSquadSize() {
          return this.squadMembers.size;
        }
        /**
         * 计算并获取当前存活小队的平均中心位置。
         * @returns Vec3 小队中心世界坐标，如果小队无存活成员则返回 Vec3.ZERO
         */


        getSquadCenterPosition() {
          var aliveNodes = this.getAlivePlayerCharacters();

          if (aliveNodes.length === 0) {
            return Vec3.ZERO; // 或者返回一个其他默认位置？
          }

          var totalPos = new Vec3();
          aliveNodes.forEach(node => totalPos.add(node.worldPosition));
          return totalPos.multiplyScalar(1 / aliveNodes.length);
        }

        onDestroy() {
          if (PlayerSquadManager._instance === this) {
            PlayerSquadManager._instance = null;
          } // 清理 Map 和事件监听 (虽然 once 会自动清理，但显式写一下更清晰)


          this.squadMembers.forEach((index, node) => {
            if (node && isValid(node)) {
              node.off('destroy');
            }
          });
          this.squadMembers.clear();
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=35aab692027e9a306717775a025743a3c83a2253.js.map