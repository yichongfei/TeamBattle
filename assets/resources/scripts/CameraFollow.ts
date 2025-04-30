import { _decorator, Component, Node, Vec3, Camera, CCFloat, Rect, view, math, isValid } from 'cc';
import { BossManager } from './BossManager';
import { HealthComponent } from './characters/components/HealthComponent';
// 引入 PlayerSquadManager
import { PlayerSquadManager } from './PlayerSquadManager';

const { ccclass, property } = _decorator;

/**
 * 控制摄像机智能跟随团队和 Boss，并动态调整视野。
 * - 位置聚焦于玩家小队中心。
 * - 视野缩放以包含所有存活玩家和存活 Boss。
 */
@ccclass('CameraFollow')
export class CameraFollow extends Component {

    // 移除 playerCharacterTag
    // @property({
    //     type: String,
    //     tooltip: '标识玩家控制角色的标签'
    // })
    // playerCharacterTag: string = "PlayerCharacter";

    // 添加 PlayerSquadManager 引用
    @property({
        type: PlayerSquadManager,
        tooltip: '玩家小队管理器实例'
    })
    playerSquadManager: PlayerSquadManager | null = null;

    @property({
        type: BossManager,
        tooltip: 'Boss管理器实例，用于获取当前 Boss 位置'
    })
    bossManager: BossManager | null = null;

    @property({
        type: CCFloat,
        tooltip: '摄像机位置跟随的平滑度 (0-1, 值越小越慢)',
        range: [0, 1, 0.01],
        slide: true
    })
    positionLerpFactor: number = 0.08;

    @property({
        type: CCFloat,
        tooltip: '视野边界的额外填充比例 (基于计算出的高度/宽度)',
        range: [0, 1, 0.05],
        slide: true
    })
    padding: number = 0.2; // 20% 的填充

    @property({
        type: CCFloat,
        tooltip: '最小正交高度 (防止缩放过小)'
    })
    minOrthoHeight: number = 300;

    @property({
        type: CCFloat,
        tooltip: '最大正交高度 (防止缩放过大)'
    })
    maxOrthoHeight: number = 1200;

    // 移除 squadFocusWeight，因为现在总是聚焦小队中心
    // @property({
    //     type: CCFloat,
    //     tooltip: '团队中心在焦点计算中的权重 (0-1)',
    //     range: [0, 1, 0.05],
    //     slide: true
    // })
    // squadFocusWeight: number = 0.6;

    /** @internal */
    protected camera: Camera | null = null;
    /** @internal */
    protected initialZ: number = 0;

    start() {
        this.camera = this.getComponent(Camera);
        if (!this.camera) {
            console.warn('CameraFollow: 节点上缺少 Camera 组件。');
            this.enabled = false;
            return;
        }
        // 检查 PlayerSquadManager 是否链接
        if (!this.playerSquadManager) {
             console.warn('CameraFollow: 未在编辑器中指定 PlayerSquadManager。');
             // 可能需要禁用或提供默认行为
             this.enabled = false;
             return;
        }
        if (!this.bossManager) {
            // BossManager 可能不是必需的，取决于游戏逻辑
            // warn('CameraFollow: 未指定 BossManager。');
        }

        this.initialZ = this.node.position.z;
        console.log(`CameraFollow: Initial Z position recorded: ${this.initialZ}`);
    }

    lateUpdate(deltaTime: number) {
        if (!this.camera || !this.enabled || !this.playerSquadManager) {
            // log("CameraFollow: lateUpdate skipped - camera, component disabled, or PlayerSquadManager missing.");
            return;
        }

        // --- 1. 获取存活角色和 Boss --- 
        const alivePlayerNodes = this.playerSquadManager.getAlivePlayerCharacters();

        let currentBoss: Node | null = null;
        if (this.bossManager) {
             const bosses = this.bossManager.getActiveBosses(); // 假设 BossManager 已经过滤了无效/死亡 Boss
             if (bosses && bosses.length > 0) {
                  currentBoss = bosses[0]; // 简化处理，只考虑第一个 Boss
                  const bossHealth = currentBoss?.getComponent(HealthComponent);
                  if (!currentBoss || !currentBoss.isValid || !bossHealth || !bossHealth.isAlive()) {
                       currentBoss = null; // 无效或死亡的 Boss
                  }
             }
        }

        // 如果没有任何存活单位，不进行操作
        if (alivePlayerNodes.length === 0 && !currentBoss) {
            return;
        }

        // --- 2. 计算小队中心点 (用于摄像机定位) --- 
        let squadCenterPosition = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y, 0); // Fallback to current camera XY
        if (alivePlayerNodes.length > 0) {
            const totalPos = new Vec3();
            alivePlayerNodes.forEach(node => {
                totalPos.add(node.worldPosition);
            });
            squadCenterPosition = totalPos.multiplyScalar(1 / alivePlayerNodes.length);
        } else if (currentBoss) {
             squadCenterPosition.set(currentBoss.worldPosition);
        }

        // --- 3. 准备计算边界的点集 (用于视野缩放) --- 
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
        if (this.node.parent) { // 确保摄像机有父节点 (通常是 Scene)
            const parentWorldMatrix = this.node.parent.worldMatrix;
            const invParentWorldMatrix = new math.Mat4();
            math.Mat4.invert(invParentWorldMatrix, parentWorldMatrix);
            Vec3.transformMat4(localTargetPos, targetCameraPos, invParentWorldMatrix);
        } else {
             localTargetPos = targetCameraPos;
        }

        // 使用转换后的局部坐标进行 lerp
        Vec3.lerp(newPos, this.node.position, localTargetPos, this.positionLerpFactor);
        // --- 修正结束 ---

        this.node.setPosition(newPos);

        // --- 视野缩放逻辑已禁用 ---
        // const currentOrthoHeight = this.camera.orthoHeight;
        // const newOrthoHeight = math.lerp(currentOrthoHeight, desiredOrthoHeight, this.zoomLerpFactor);
        // this.camera.orthoHeight = newOrthoHeight;
    }

    // 移除 findAndAddPlayersRecursive
    // private findAndAddPlayersRecursive(parentNode: Node, playerTag: string): void { ... }

    /**
     * 计算包含所有给定点的最小边界框 (世界坐标)
     * @param points Vec3 世界坐标点数组
     * @returns Rect 边界框
     */
    private calculateBoundingBox(points: Vec3[]): Rect {
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
    private calculateDesiredOrthoHeight(bounds: Rect): number {
        // 考虑填充
        const paddedWidth = bounds.width * (1 + this.padding);
        const paddedHeight = bounds.height * (1 + this.padding);

        // 获取屏幕宽高比
        const screenSize = view.getVisibleSize();
        const aspectRatio = screenSize.width / screenSize.height;

        // 计算所需的 orthoHeight
        const orthoHeightBasedOnWidth = (paddedWidth / aspectRatio) / 2;
        const orthoHeightBasedOnHeight = paddedHeight / 2;

        // 取两者中较大的值，确保都能容纳
        // 同时确保 orthoHeight 不会是 NaN 或 Infinity (例如当 bounds.width/height 为 0 时)
        let height = Math.max(orthoHeightBasedOnWidth, orthoHeightBasedOnHeight);
        if (isNaN(height) || !isFinite(height)) {
            height = this.minOrthoHeight; // Fallback to min height
        }
        return Math.max(this.minOrthoHeight, height); // 确保至少是最小高度
    }
}