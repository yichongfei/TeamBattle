import { _decorator, Component, Vec3, CCFloat } from 'cc';
import { CharacterStats } from './CharacterStats'; // 需要获取移动速度
import { IMovable } from '../../common/Interfaces';

const { ccclass, property } = _decorator;

/**
 * 负责处理角色移动的具体执行。
 * 接收来自 AIComponent 的移动指令。
 * 可以包含操控行为 (Steering Behaviors) 或寻路逻辑。
 */
@ccclass('MovementComponent')
export class MovementComponent extends Component implements IMovable {

    @property(CharacterStats)
    private stats: CharacterStats = null;

    // --- 操控行为参数 (Steering Behaviors) ---
    // 这些可以从 CharacterControl 迁移过来或重新设计
   
    maxForce: number = 1500;


    slowingRadius: number = 100;

  
    separationWeight: number = 155;

  
    neighborRadius: number = 250;

    // --- 内部状态 ---
    private _velocity: Vec3 = new Vec3();
    private _steeringForce: Vec3 = new Vec3();
    private _targetPosition: Vec3 | null = null; // AI 请求的目标点
    private _isMoving: boolean = false;
    private _squadMates: Component[] = []; // 用于计算分离力

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
    public setSquadMates(mates: Component[]) {
        this._squadMates = mates.filter(m => m !== this && m.isValid);
    }

    update(deltaTime: number) {
        if (deltaTime === 0 || !this.enabled || !this.stats) return;

        this.calculateSteeringForces(deltaTime);
        this.applySteeringToVelocity(deltaTime);
        this.updatePosition(deltaTime);
        this.updateOrientation();
    }

    // --- IMovable Implementation & Control --- (由 AIComponent 调用)
    public moveTo(targetPosition: Vec3): void {
        this._targetPosition = targetPosition.clone();
        this._isMoving = true;
    }

    public stopMovement(): void {
        if (!this._targetPosition && this._velocity.lengthSqr() < 0.1*0.1) {
             return;
        }
        this._targetPosition = null;
        this._isMoving = false;
        this._velocity.set(0, 0, 0);
        this._steeringForce.set(0, 0, 0);
    }

    public getCurrentSpeed(): number {
        return this._velocity.length();
    }

    public isMoving(): boolean {
        // 可以根据速度或是否有目标来判断
        return this._isMoving && this._velocity.lengthSqr() > 1.0;
    }

    // --- 内部移动逻辑 (可以沿用或改进 CharacterControl 的逻辑) ---

    private calculateSteeringForces(deltaTime: number) {
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

    private applySteeringToVelocity(deltaTime: number) {
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

    private updatePosition(deltaTime: number) {
        if (this._velocity.lengthSqr() < 0.1*0.1) return; // 速度过小则不移动

        // 计算位移: deltaPos = velocity * deltaTime
        const moveDelta = this._velocity.clone().multiplyScalar(deltaTime);
        // 更新世界坐标
        this.node.setWorldPosition(this.node.worldPosition.clone().add(moveDelta));
    }

    private updateOrientation() {
        // 仅在速度足够大时才更新朝向，避免停止时因微小抖动导致晃动
        const speedThresholdSq = 1.0 * 1.0; // 速度平方阈值，可以调整
        if (this._velocity.lengthSqr() > speedThresholdSq) {
            // 根据速度方向更新节点朝向 (左右翻转)
            if (Math.abs(this._velocity.x) > 0.1) {
                 // 假设模型默认朝左
                const currentScaleX = Math.abs(this.node.scale.x);
                this.node.scale = new Vec3(this._velocity.x < 0 ? currentScaleX : -currentScaleX, this.node.scale.y, this.node.scale.z);
            }
        } 
        // else { // 速度小时不更新朝向，保持上一次的朝向
        //    console.warn("Speed too low, skipping orientation update.");
        // }
    }

    // --- 操控行为实现 (从 CharacterControl 迁移并适配) ---

    private arrive(target: Vec3, maxSpeed: number): Vec3 {
        const desired = target.clone().subtract(this.node.worldPosition);
        const distance = desired.length();

        if (distance < 1) { // 非常近时直接停止
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

    private separate(neighbors: Component[], maxSpeed: number): Vec3 {
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

    private applyForce(force: Vec3) {
        this._steeringForce.add(force);
    }
} 