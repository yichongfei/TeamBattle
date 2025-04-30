import { _decorator, Component, Node, isValid, find } from 'cc';
// 静态导入 HealthComponent 类型，避免循环依赖和动态导入问题
import { HealthComponent } from './characters/components/HealthComponent';
import { Vec3 } from 'cc';
import { MovementComponent } from './characters/components/MovementComponent';

const { ccclass, property } = _decorator;

// // 定义一个接口来存储角色信息（备选方案）
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
@ccclass('PlayerSquadManager')
export class PlayerSquadManager extends Component {

    // 移除编辑器直接指定的数组，改为动态管理
    // @property({
    //     type: [Node],
    //     tooltip: '玩家小队所有成员的根节点列表'
    // })
    // playerCharacters: Node[] = [];

    // 使用 Map 存储角色 Node 和对应的 squadIndex
    private squadMembers: Map<Node, number> = new Map<Node, number>();
    private nextSquadIndex: number = 0; // 用于分配下一个可用的索引

    private static _instance: PlayerSquadManager | null = null;

    public static get instance(): PlayerSquadManager | null {
        if (!PlayerSquadManager._instance || !isValid(PlayerSquadManager._instance.node)) {
            PlayerSquadManager._instance = null;
            const managerNode = find("PlayerSquadManagerNode");
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
        PlayerSquadManager._instance = this;
        // 使用 console.log
        console.log("PlayerSquadManager initialized.");
    }

    start() {
        // 清理日志
    }

    /**
     * 获取当前所有存活的玩家角色节点列表。
     * @returns Node[] 存活的玩家角色节点数组
     */
    public getAlivePlayerCharacters(): Node[] {
        const aliveNodes: Node[] = [];
        this.squadMembers.forEach((index, node) => {
            if (node && isValid(node)) {
                 const healthComp = node.getComponent(HealthComponent);
                 if (healthComp && healthComp.isAlive()) {
                     aliveNodes.push(node);
                 }
            }
        });
        // 可以选择按 squadIndex 排序，虽然 CameraFollow 不需要
        // aliveNodes.sort((a, b) => (this.squadMembers.get(a) ?? 0) - (this.squadMembers.get(b) ?? 0));
        return aliveNodes;
    }

    /**
     * 获取所有已注册的角色节点列表 (无论死活)。
     * @returns Node[] 所有注册的角色节点数组
     */
    public getAllPlayerCharacters(): Node[] {
        return Array.from(this.squadMembers.keys()).filter(node => node && isValid(node));
    }

    /**
     * 添加一个角色到管理器，并分配一个 squadIndex。
     * @param characterNode 要添加的角色节点
     * @returns 分配的 squadIndex，如果添加失败则返回 -1
     */
    public addCharacter(characterNode: Node): number {
        if (characterNode && isValid(characterNode) && !this.squadMembers.has(characterNode)) {
            const assignedIndex = this.nextSquadIndex++;
            this.squadMembers.set(characterNode, assignedIndex);
            // 使用 console.log
            console.log(`PlayerSquadManager: Character [${characterNode.name}] added with squadIndex ${assignedIndex}. Total: ${this.squadMembers.size}`);
            characterNode.once('destroy', () => {
                this.removeCharacter(characterNode);
            });
            return assignedIndex;
        }
        // 使用 console.warn
        console.warn(`PlayerSquadManager: Failed to add character [${characterNode?.name ?? 'Invalid Node'}]`);
        return -1;
    }

    private broadcastSquadLists () {
        const all = this.getAlivePlayerCharacters();
        all.forEach(node => {
            const move = node.getComponent(MovementComponent);
            if (move) { move.setSquadMates(all.map(n => n.getComponent(MovementComponent))); }
        });
    }
    

     /**
     * 从管理器移除一个角色。
     * 通常在角色节点销毁时自动调用。
     * @param characterNode 要移除的角色节点
     */
    public removeCharacter(characterNode: Node) {
         if (this.squadMembers.has(characterNode)) {
             const removedIndex = this.squadMembers.get(characterNode);
             this.squadMembers.delete(characterNode);
             // 使用 console.log
             console.log(`PlayerSquadManager: Character [${characterNode.name}] (Index ${removedIndex}) removed. Total: ${this.squadMembers.size}`);
         } else {
             // 可能在 DESTROY 事件触发前已经被手动移除
             // warn(`PlayerSquadManager: Tried to remove character [${characterNode?.name}] which was not found.`);
         }
    }

    /**
     * 获取指定角色节点的 squadIndex。
     * @param characterNode 要查询的角色节点
     * @returns 对应的 squadIndex，如果未找到则返回 -1
     */
    public getSquadIndex(characterNode: Node): number {
        // 清理日志
        return this.squadMembers.get(characterNode) ?? -1;
    }

    /**
     * 获取当前小队总人数 (包括死亡的，只要注册过且未销毁)。
     * @returns number 小队总人数
     */
    public getTotalSquadSize(): number {
        return this.squadMembers.size;
    }

    /**
     * 计算并获取当前存活小队的平均中心位置。
     * @returns Vec3 小队中心世界坐标，如果小队无存活成员则返回 Vec3.ZERO
     */
    public getSquadCenterPosition(): Vec3 {
        const aliveNodes = this.getAlivePlayerCharacters();
        if (aliveNodes.length === 0) {
            return Vec3.ZERO; // 或者返回一个其他默认位置？
        }
        const totalPos = new Vec3();
        aliveNodes.forEach(node => totalPos.add(node.worldPosition));
        return totalPos.multiplyScalar(1 / aliveNodes.length);
    }

    onDestroy() {
        if (PlayerSquadManager._instance === this) {
            PlayerSquadManager._instance = null;
        }
        // 清理 Map 和事件监听 (虽然 once 会自动清理，但显式写一下更清晰)
        this.squadMembers.forEach((index, node) => {
            if (node && isValid(node)) {
                 node.off('destroy');
            }
        });
        this.squadMembers.clear();
    }
} 