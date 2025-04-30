import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, Rect, CCFloat, CCInteger, isValid } from 'cc';
const { ccclass, property } = _decorator;

// 引入 Boss 控制脚本 (假设我们后面会创建它)
// import { BossControl } from './BossControl'; 

/**
 * 管理 Boss 在指定区域内的生成。
 */
@ccclass('BossManager')
export class BossManager extends Component {

    @property({
        type: Prefab,
        tooltip: 'Boss 的预制体资源'
    })
    bossPrefab: Prefab = null;

    @property({
        type: Node,
        tooltip: 'Boss 生成的区域节点 (例如你的 Map 节点)'
    })
    spawnAreaNode: Node = null;

    @property({
        type: CCFloat,
        tooltip: 'Boss 生成的时间间隔 (秒)，0 或负数表示不自动生成'
    })
    spawnInterval: number = 10.0;

    @property({
        type: CCInteger,
        tooltip: '场上允许存在的最大 Boss 数量'
    })
    maxBosses: number = 1;

    /**
     * 当前存活的 Boss 节点列表
     * @internal
     */
    protected activeBosses: Node[] = [];

    /**
     * Boss 生成区域的边界 (世界坐标)
     * @internal
     */
    protected spawnBounds: Rect = null;

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
            console.log(`BossManager: 已启动 Boss 生成定时器，间隔: ${this.spawnInterval}秒`);
            this.trySpawnBoss(); 
        } else {
            console.log('BossManager: spawnInterval <= 0, 不会自动生成 Boss。');
        }
    }

    /**
     * 计算生成区域节点的世界坐标边界框。
     */
    calculateSpawnBounds() {
        const uiTransform = this.spawnAreaNode.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('BossManager: Spawn Area Node 缺少 UITransform 组件!');
            this.spawnBounds = new Rect(this.spawnAreaNode.worldPosition.x - 50, this.spawnAreaNode.worldPosition.y - 50, 100, 100);
            return;
        }
        this.spawnBounds = uiTransform.getBoundingBoxToWorld();
        console.log(`BossManager: 生成区域边界计算完成 (世界坐标): x=${this.spawnBounds.x.toFixed(0)}, y=${this.spawnBounds.y.toFixed(0)}, w=${this.spawnBounds.width.toFixed(0)}, h=${this.spawnBounds.height.toFixed(0)}`);
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
        const spawnPos = new Vec3(150, 0, 0); 
        console.warn(`BossManager: Spawning Boss at fixed test position: (${spawnPos.x}, ${spawnPos.y})`); 

        const newBoss = instantiate(this.bossPrefab);
        if (!newBoss) {
            console.warn('BossManager: 实例化 Boss Prefab 失败!');
            return;
        }

        this.node.addChild(newBoss);
        newBoss.setWorldPosition(spawnPos); 
        this.activeBosses.push(newBoss);
        console.log(`BossManager: Boss 已在 (${spawnPos.x.toFixed(0)}, ${spawnPos.y.toFixed(0)}) 生成! 当前数量: ${this.activeBosses.length}`);

        // 获取 BossControl 脚本并设置回调 (如果需要)
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
    onBossDestroyed(bossNode: Node) {
        const index = this.activeBosses.indexOf(bossNode);
        if (index !== -1) {
            this.activeBosses.splice(index, 1);
            console.log(`BossManager: 一个 Boss 被销毁。当前数量: ${this.activeBosses.length}`);
        } else {
            console.warn('BossManager: 尝试移除一个不在列表中的 Boss。');
        }
        // 如果数量低于上限，可以考虑立即尝试生成新的？或者等待下一个间隔
        // this.trySpawnBoss();
    }

    /**
     * 获取当前存活的 Boss 节点列表。
     * @returns 活动 Boss 列表
     */
    public getActiveBosses(): Node[] {
        // 返回前再次过滤无效节点，确保列表干净
        this.activeBosses = this.activeBosses.filter(boss => boss && isValid(boss, true));
        return this.activeBosses;
    }

    /**
     * 获取距离指定位置最近的存活 Boss。
     * @param position 参考位置 (世界坐标)
     * @returns 最近的 Boss 节点，如果没有存活 Boss 则返回 null。
     */
    public getNearestBoss(position: Vec3): Node | null {
        const bosses = this.getActiveBosses();
        if (bosses.length === 0) {
            return null;
        }

        let nearestBoss: Node = null;
        let minDistanceSq = Infinity;

        bosses.forEach(boss => {
            const distanceSq = Vec3.squaredDistance(position, boss.worldPosition);
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                nearestBoss = boss;
            }
        });

        return nearestBoss;
    }
} 