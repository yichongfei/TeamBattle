import { _decorator, Component } from 'cc';
import { RoleType } from '../../common/Enums';

const { ccclass, property } = _decorator;

/**
 * 标识角色的定位（职责），影响 AI 决策和目标选择。
 */
@ccclass('RoleComponent')
export class RoleComponent extends Component {

    @property({
        type: RoleType,
        tooltip: '角色的主要定位',
        displayOrder: 1
    })
    role: RoleType = RoleType.MELEE_DPS;

    // --- 定位相关的特定参数 (可选) ---

    @property({
        type: Number,
        tooltip: '远程/治疗职业希望保持的最小距离',
        min: 0,
        displayOrder: 10,
        visible: function(this: RoleComponent) {
            return this.role === RoleType.RANGED_DPS || this.role === RoleType.HEALER;
        }
    })
    preferredMinDistance: number = 200;

    @property({
        type: Number,
        tooltip: '远程/治疗职业希望保持的最大距离 (超出则靠近)',
        min: 0,
        displayOrder: 11,
        visible: function(this: RoleComponent) {
            return this.role === RoleType.RANGED_DPS || this.role === RoleType.HEALER;
        }
    })
    preferredMaxDistance: number = 400;

    @property({
        type: Number,
        tooltip: '坦克吸引仇恨的基础值或倍率',
        min: 0,
        displayOrder: 20,
        visible: function(this: RoleComponent) { return this.role === RoleType.TANK; }
    })
    threatModifier: number = 1.5;

    @property({
        type: Number,
        tooltip: '治疗者开始关注友方单位的生命值百分比阈值',
        range: [0, 1, 0.01],
        displayOrder: 30,
        visible: function(this: RoleComponent) { return this.role === RoleType.HEALER; }
    })
    healTriggerThreshold: number = 0.8;

    // start() {}

    // update(deltaTime: number) {}
} 