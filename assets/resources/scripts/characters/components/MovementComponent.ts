import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/** 兼容 AIComponent 的 IMovable 实现 */
@ccclass('MovementComponent')
export class MovementComponent extends Component {

    /* ---------- 内部参数，不再暴露给编辑器 ---------- */
    /** 角色半径(px)，用于软碰撞推开 */
    private personalRadius = 28;
    /** 允许的最小重叠比 (0~1)，0 表示硬碰撞 */
    private overlapTolerance = 0.4; // 允许 40% 重叠
    /** 分离力权重 (越大推力越强) */
    private separationWeight = 60;
    /** 抵达槽位时的容差(px) */
    private arriveTolerance = 6;
    /** 减速半径(px) */
    private arriveSlowingRadius = 80;
    /** 最大速度(px/s) */
    private maxSpeed = 1600;
    /** 最大Steering力 */
    private maxForce = 2200;

    /* ---------- 内部状态 ---------- */
    private _neighborRadiusSq = 0;
    private _velocity = new Vec3();
    private _accel = new Vec3();
    private _moveTarget: Vec3 | null = null;
    private _squadMates: MovementComponent[] = [];
    private _isMoving = false;

    onLoad() {
        // 根据个人半径与容差动态计算邻居感知距离 (≈ 两个圆心距离阈值)
        const minDist = this.personalRadius * (2 - this.overlapTolerance);
        this._neighborRadiusSq = minDist * minDist;
    }

    /* ======== AIComponent 期望的接口 ======== */
    /** 传 null 表示停止 */
    public moveTo(worldPos: Vec3 | null): void {
        this._moveTarget = worldPos ? worldPos.clone() : null;
        this._isMoving = !!worldPos;
        if (!worldPos) {
            this._velocity.set(0, 0, 0);
        }
    }
    public stopMovement(): void {
        this.moveTo(null);
    }
    public isMoving(): boolean {
        return this._isMoving && this._velocity.lengthSqr() > 1;
    }
    public getCurrentSpeed(): number {
        return this._velocity.length();
    }
    /** 由 SquadManager 注入队友引用 */
    public setSquadMates(mates: MovementComponent[]) {
        this._squadMates = mates;
    }

    /* =============== 更新循环 =============== */
    protected update(dt: number) {
        this._accel.set(Vec3.ZERO);

        if (this._moveTarget) {
            const distToTarget = Vec3.distance(this.node.worldPosition, this._moveTarget);

            // 1. 未到槽位 →正常 Arrive + Separation
            if (distToTarget > this.arriveTolerance) {
                this.applyForce(this.arrive(this._moveTarget));

                // 根据距离槽位远近动态衰减分离力，越接近槽位分离力越弱，避免临门推搡
                let sepFactor = 1;
                if (distToTarget < this.arriveSlowingRadius) {
                    sepFactor = (distToTarget - this.arriveTolerance) / (this.arriveSlowingRadius - this.arriveTolerance);
                    sepFactor = Math.max(0, Math.min(1, sepFactor));
                }
                if (sepFactor > 0.01) {
                    this.applyForce(this.separate().multiplyScalar(this.separationWeight * sepFactor));
                }

                this._isMoving = true;
            } else {
                // 2. 已抵达槽位 → 停止移动，避免持续推搡
                this._moveTarget = null;
                this._velocity.set(0, 0, 0);
                this._isMoving = false;
            }
        } else {
            // 没有移动目标，进行被动减速
            if (this._velocity.lengthSqr() > 1) {
                const brake = this._velocity.clone().multiplyScalar(-1);
                this.applyForce(brake);
            }
        }

        /* 速度积分 + 阻尼 */
        this._velocity.add(this._accel.multiplyScalar(dt));
        this._velocity.multiplyScalar(0.92);                 // 阻尼
        if (this._velocity.lengthSqr() > this.maxSpeed ** 2) {
            this._velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        /* 更新位置（局部坐标） */
        const pos = this.node.position;
        pos.add(Vec3.multiplyScalar(new Vec3(), this._velocity, dt));
        this.node.setPosition(pos);
    }

    /* -------------- Steering -------------- */
    private applyForce(f: Vec3) {
        if (f.lengthSqr() > this.maxForce ** 2) f.normalize().multiplyScalar(this.maxForce);
        this._accel.add(f);
    }
    private arrive(target: Vec3): Vec3 {
        const desired = target.clone().subtract(this.node.worldPosition);
        const dist = desired.length();
        if (dist < 0.1) return Vec3.ZERO;

        let speed = this.maxSpeed;
        if (dist < this.arriveSlowingRadius) speed *= dist / this.arriveSlowingRadius;
        return desired.normalize().multiplyScalar(speed).subtract(this._velocity);
    }
    private separate(): Vec3 {
        const steer = new Vec3(); let count = 0;
        const minDist = this.personalRadius * (2 - this.overlapTolerance);
        const minDistSq = minDist * minDist;

        for (const mate of this._squadMates) {
            if (mate === this || !mate.isValid) continue; // 添加 isValid 检查

            const diff = this.node.worldPosition.clone().subtract(mate.node.worldPosition);
            const dSq = diff.lengthSqr();

            if (dSq > 0 && dSq < minDistSq) {
                // 检查 mate 是否已经到达目标
                const mateHasArrived = !mate._moveTarget || Vec3.distance(mate.node.worldPosition, mate._moveTarget) < mate.arriveTolerance;
                
                // 推力随距离成线性递增
                const strength = (minDistSq - dSq) / minDistSq; // 0~1
                const pushForce = diff.normalize().multiplyScalar(strength);

                // 如果 mate 已经到达，则大幅降低其推力
                if (mateHasArrived) {
                    pushForce.multiplyScalar(0); // 例如，只施加 10% 的力
                }

                steer.add(pushForce);
                count++;
            }
        }

        if (count > 0) steer.multiplyScalar(1 / count);
        if (steer.lengthSqr() > 0) {
            steer.normalize().multiplyScalar(this.maxSpeed).subtract(this._velocity);
        }
        return steer;
    }
}
