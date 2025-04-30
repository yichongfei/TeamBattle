import { _decorator, Component, Node, sp, Vec3, CCFloat, Vec2, warn, log } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 角色状态枚举
 */
export enum CharacterState {
    IDLE,    // 待机
    PATROL,  // 巡逻
    CHASE,   // 追击
    ATTACK,  // 攻击
    HIT,     // 受击
    STUN,    // 眩晕
    DIE,     // 死亡
    VICTORY  // 胜利
}

/**
 * 角色控制基类，使用操控行为处理移动、动画、状态管理等通用逻辑。
 */
@ccclass('CharacterControl')
export class CharacterControl extends Component {

    // --- 基本属性 ---
    @property({
        type: CCFloat,
        tooltip: '角色的最大移动速度'
    })
    maxSpeed: number = 150;

    @property({
        type: CCFloat,
        tooltip: '施加转向力的最大限制'
    })
    maxForce: number = 500;

    @property({
        type: sp.Skeleton,
        tooltip: '关联的 Spine 动画组件'
    })
    spineAnimation: sp.Skeleton = null;

    // --- 操控行为属性 ---
    @property({
        type: CCFloat,
        tooltip: '检测邻居的半径'
    })
    neighborRadius: number = 80;

    @property({
        type: CCFloat,
        tooltip: '分离力的权重'
    })
    separationWeight: number = 1.5;

    @property({
        type: CCFloat,
        tooltip: '到达目标时开始减速的半径'
    })
    slowingRadius: number = 100;

    // --- 内部状态 ---
    /** @internal */ protected _currentState: CharacterState = CharacterState.IDLE;
    /** @internal */ protected velocity: Vec3 = new Vec3();
    /** @internal */ protected steeringTarget: Vec3 = null;
    /** @internal */ protected steeringForce: Vec3 = new Vec3();
    /** @internal */ protected squadMates: CharacterControl[] = [];

    // --- Getter/Setter ---
    public get currentState(): CharacterState {
        return this._currentState;
    }

    // --- 初始化 ---
    start() {
        // 初始化是被动的，等待 SquadManager
    }

    /**
     * 由 SquadManager 调用，提供其他小队成员的列表。
     * @param mates 其他成员的 CharacterControl 列表
     */
    public setSquadMates(mates: CharacterControl[]) {
        this.squadMates = mates.filter(m => m !== this);
    }

    // --- 更新逻辑 ---
    update(deltaTime: number) {
        if (deltaTime === 0 || !this.enabled) return;

        // 重置本帧的操控力
        this.steeringForce.set(0, 0, 0);

        // 根据当前状态和目标计算操控力
        this.calculateSteeringForces();

        // 应用操控力到速度
        this.applySteeringToVelocity(deltaTime);

        // 根据速度更新位置
        this.updatePosition(deltaTime);

        // 更新动画和朝向
        this.updateAnimationAndOrientation();
    }

    /** @internal */
    calculateSteeringForces() {
        let targetForce = new Vec3();
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
        this.applyForce(targetForce);

        // 计算与附近队友的分离力
        const separationForce = this.separate(this.squadMates);
        this.applyForce(separationForce.multiplyScalar(this.separationWeight));
    }

    /** @internal */
    applySteeringToVelocity(deltaTime: number) {
        // 限制操控力
        if (this.steeringForce.lengthSqr() > this.maxForce * this.maxForce) {
            this.steeringForce.normalize().multiplyScalar(this.maxForce);
        }

        // 将力应用到速度: velocity += steeringForce * deltaTime
        this.velocity.add(this.steeringForce.clone().multiplyScalar(deltaTime));

        // 限制速度到最大速度
        if (this.velocity.lengthSqr() > this.maxSpeed * this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }
    }

    /** @internal */
    updatePosition(deltaTime: number) {
        // 1) 先算本帧移动的世界量
        const moveDelta = this.velocity.clone().multiplyScalar(deltaTime);
        // 2) 在世界坐标系下更新位置
        const newWorld = this.node.worldPosition.clone().add(moveDelta);
        this.node.setWorldPosition(newWorld);
    }

    /** @internal */
    updateAnimationAndOrientation() {
        // 根据速度确定动画
        const speedSqr = this.velocity.lengthSqr();
        let desiredAnim = 'idle';
        if (speedSqr > 1.0) {
            desiredAnim = 'run';
        }

        // 只在需要时更改动画
        const currentAnim = this.spineAnimation?.animation;
        if (currentAnim !== desiredAnim) {
            this.playAnimation(desiredAnim, true);
        }

        // 根据速度方向更新朝向
        if (speedSqr > 0.1) {
            const directionX = this.velocity.x;
            if (Math.abs(directionX) > 0.01) {
                // 假设原始资产面向左侧
                this.node.scale = new Vec3(directionX < 0 ? 1 : -1, 1, 1);
            }
        }
    }

    // --- 操控行为 ---

    /**
     * 计算平滑到达目标位置的操控力 (Arrive 行为)。
     * @param target 目标位置
     * @returns 计算出的到达力向量
     */
    arrive(target: Vec3): Vec3 {
        const desired = target.clone().subtract(this.node.worldPosition);
        const distance = desired.length();

        // 非常接近时直接设置位置并停止
        if (distance < 5) {
            log(`角色 ${this.node.name}: 到达目标点!`);
            this.velocity.set(0, 0, 0);
            this.steeringTarget = null;
            return Vec3.ZERO;
        }

        let desiredSpeed = this.maxSpeed;
        const effectiveSlowingRadius = this.slowingRadius;

        // 在减速半径内调整期望速度
        if (distance < effectiveSlowingRadius) {
            desiredSpeed = this.maxSpeed * (distance / Math.max(effectiveSlowingRadius, 0.1));
            desiredSpeed = Math.max(desiredSpeed, 5);
        }

        // 计算期望速度向量
        if (distance > 0.1) {
            desired.normalize().multiplyScalar(desiredSpeed);
        } else {
            desired.set(0, 0, 0);
            if (this.velocity.lengthSqr() < 1.0) {
                this.velocity.set(0, 0, 0);
            }
        }

        // 转向力 = 期望速度 - 当前速度
        const steer = desired.subtract(this.velocity);

        // 如果非常接近目标，增加转向力的强度以确保能到达
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
    separate(neighbors: CharacterControl[]): Vec3 {
        const desiredSeparation = this.neighborRadius * 0.8;
        const steer = new Vec3();
        let count = 0;

        for (const other of neighbors) {
            if (!other || !other.isValid || other === this) continue;

            const distance = Vec3.distance(this.node.position, other.node.position);

            // 检查其他角色是否是邻居（在半径内）
            if (distance > 0 && distance < desiredSeparation) {
                // 计算指向远离邻居的力向量
                const diff = this.node.position.clone().subtract(other.node.position);
                diff.normalize();
                diff.multiplyScalar(1.0 / distance);
                steer.add(diff);
                count++;
            }
        }

        // 如果有邻居，对转向向量取平均值
        if (count > 0) {
            steer.multiplyScalar(1.0 / count);
        }

        // 如果分离力显著，将其缩放到最大速度
        if (steer.lengthSqr() > 0) {
            steer.normalize().multiplyScalar(this.maxSpeed);
            // 转向力 = 期望分离速度 - 当前速度
            steer.subtract(this.velocity);
        }

        return steer;
    }

    /**
     * 对角色施加一个操控力。
     * @param force 要施加的力向量
     */
    applyForce(force: Vec3) {
        this.steeringForce.add(force);
    }

    // --- 供 SquadManager 使用的公共方法 ---

    /**
     * 设置角色的操控目标。
     * @param target 世界坐标目标，或 null 表示停止/刹车
     */
    public setSteeringTarget(target: Vec3 | null) {
        this.steeringTarget = target ? target.clone() : null;
    }

    /**
     * 切换角色状态。
     * @param newState 要切换到的新状态
     */
    changeState(newState: CharacterState) {
        if (this._currentState === newState) return;
        log(`角色 ${this.node.name} 状态改变: ${CharacterState[this._currentState]} -> ${CharacterState[newState]}`);
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
    playAnimation(animName: string, loop: boolean = true) {
        if (!this.spineAnimation) {
            return;
        }
        const currentTrackEntry = this.spineAnimation.getCurrent(0);
        if (!currentTrackEntry || currentTrackEntry.animation.name !== animName || loop) {
            if (currentTrackEntry && currentTrackEntry.animation.name === animName && !loop) {
            } else {
                this.spineAnimation.setAnimation(0, animName, loop);
            }
        }
    }
} 