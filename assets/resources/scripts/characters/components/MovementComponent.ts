import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/** 兼容 AIComponent 的 IMovable 实现 */
@ccclass('MovementComponent')
export class MovementComponent extends Component {

    /* ---------- 内部参数，不再暴露给编辑器 ---------- */
    /** 感知邻居半径(px) */
    private neighborRadius = 120;
    /** 分离权重 */
    private separationWeight = 160;
    /** 减速半径(px) */
    private arriveSlowingRadius = 80;
    /** 最大速度(px/s) */
    private maxSpeed = 2000;
    /** 最大Steering力 */
    private maxForce = 2700;

    /* ---------- 内部状态 ---------- */
    private readonly _neighborRadiusSq = 0;
    private _velocity = new Vec3();
    private _accel = new Vec3();
    private _moveTarget: Vec3 | null = null;
    private _squadMates: MovementComponent[] = [];
    private _isMoving = false;

    onLoad() {
        (this as any)._neighborRadiusSq = this.neighborRadius * this.neighborRadius;
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
            this.applyForce(this.arrive(this._moveTarget));
            this._isMoving = true;
        } else {
            // 自动刹车
            if (this._velocity.lengthSqr() > 1) {
                const brake = this._velocity.clone().multiplyScalar(-1);
                this.applyForce(brake);
            } else {
                this._isMoving = false;
            }
        }

        // 分离
        this.applyForce(this.separate().multiplyScalar(this.separationWeight));

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
        for (const mate of this._squadMates) {
            if (mate === this) continue;
            const diff = this.node.worldPosition.clone().subtract(mate.node.worldPosition);
            const dSq = diff.lengthSqr();
            if (dSq > 0 && dSq < (this as any)._neighborRadiusSq) {
                diff.normalize().multiplyScalar(1 / dSq);
                steer.add(diff); ++count;
            }
        }
        if (count > 0) steer.multiplyScalar(1 / count);
        if (steer.lengthSqr() > 0) {
            steer.normalize().multiplyScalar(this.maxSpeed).subtract(this._velocity);
        }
        return steer;
    }
}
