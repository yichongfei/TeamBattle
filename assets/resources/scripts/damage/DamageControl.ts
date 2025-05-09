// DamageControl.ts
import { _decorator, Component, Node, Label, Vec3, find, UITransform, tween, UIOpacity, Color, Canvas, Camera, director, view } from 'cc';
import { LabelAnimData } from '../pop/popuplabel/label-anim-data';
import { ObjectPool } from '../pop/popuplabel/object-pool';
import { PopUpLabel } from '../pop/popuplabel/popup-label';
import { DamageType as DamageSystemAttackType } from '../common/Enums'; // 重命名避免与 DamageControl 内部的 DamageType 冲突

const { ccclass, property } = _decorator;

// DamageControl 内部用于区分显示类型的枚举
export enum PopupType {
    PhysicalDamage,
    MagicDamage, // 示例，根据 AttackType 映射
    TrueDamage,
    Heal,
    CritPhysicalDamage, // 区分暴击显示
    CritMagicDamage,
    // ... 可以添加更多类型
}

@ccclass('DamageControl')
export class DamageControl extends Component {
    private static _instance: DamageControl;

    @property(PopUpLabel)
    private damagePopup: PopUpLabel = null;

    // 移除伤害计算相关属性
    // private damageFloatRange: number = 0.1;

    private baseFontScale: number = 1.0;
    private critFontScale: number = 1.2;
    private popupDuration: number = 1.2;
    private popupMoveEase: string = "sineOut";
    private popupEndScaleFactor: number = 0.5;
    private popupDriftHeight: number = 120;

    public static getInstance(): DamageControl {
        if (!DamageControl._instance) {
            DamageControl._instance = find('Canvas/DamageControl')?.getComponent(DamageControl);
            if (!DamageControl._instance) {
                console.error("DamageControl: 未找到 Canvas 上的 DamageControl 组件！");
            }
        }
        return DamageControl._instance;
    }

    onDestroy() {
        if (DamageControl._instance === this) {
            DamageControl._instance = null;
        }
        // 移除事件监听
        director.off('final-damage-applied', this.handleDamageEvent, this);
        director.off('final-heal-applied', this.handleHealEvent, this);
    }

    start() {
        if (!this.damagePopup) {
            this.damagePopup = find('Canvas/DamagePopup')?.getComponent(PopUpLabel);
        }
        // 注册全局事件监听
        director.on('final-damage-applied', this.handleDamageEvent, this);
        director.on('final-heal-applied', this.handleHealEvent, this);
        console.log("DamageControl started and listening for events.");
    }

    // 添加设置PopUpLabel的方法
    public setPopUpLabel(popupLabel: PopUpLabel) {
        this.damagePopup = popupLabel;
    }

    // 处理最终伤害事件
    private handleDamageEvent(eventData: { targetNode: Node, sourceNode?: Node, damage: number, damageType: DamageSystemAttackType, isCrit: boolean }) {
        if (!eventData || !eventData.targetNode || eventData.damage <= 0) return;

        // 确定显示类型
        let popupType: PopupType;
        if (eventData.isCrit) {
            popupType = eventData.damageType === DamageSystemAttackType.PHYSICAL ? PopupType.CritPhysicalDamage : PopupType.CritMagicDamage; // 简化处理
        } else {
            popupType = eventData.damageType === DamageSystemAttackType.PHYSICAL ? PopupType.PhysicalDamage : PopupType.MagicDamage;
        }
        if (eventData.damageType === DamageSystemAttackType.TRUE) {
            popupType = PopupType.TrueDamage;
        }

        const damageStr = Math.round(eventData.damage).toString();
        this.showNumberPopup(eventData.targetNode, damageStr, eventData.isCrit, popupType);
    }

    // 处理最终治疗事件
    private handleHealEvent(eventData: { targetNode: Node, sourceNode?: Node, healAmount: number }) {
        if (!eventData || !eventData.targetNode || eventData.healAmount <= 0) return;

        const healStr = Math.round(eventData.healAmount).toString();
        // 治疗默认不暴击，类型为 Heal
        this.showNumberPopup(eventData.targetNode, `+${healStr}`, false, PopupType.Heal);
    }

    /**
     * 通用的数字飘字显示方法
     * @param targetNode 目标节点
     * @param numberStr 要显示的数字字符串 (已包含 +/- 或暴击前缀)
     * @param isCrit 是否暴击 (影响动画和字体大小)
     * @param popupType 显示类型 (影响颜色等)
     */
    public showNumberPopup(targetNode: Node, numberStr: string, isCrit: boolean, popupType: PopupType) {
        
        if (!this.damagePopup) {
            this.damagePopup = find('Canvas/DamagePopup')?.getComponent(PopUpLabel);
            if (!this.damagePopup) {
                console.error("DamageControl: 未找到PopUpLabel组件，无法显示伤害数字");
                return;
            }
        }
        if (!targetNode || !targetNode.isValid) return;
        const uiTransTarget = targetNode.getComponent(UITransform);
        if (!uiTransTarget) return;

        const headOffset = uiTransTarget.height / 2;
        const worldPos = uiTransTarget.convertToWorldSpaceAR(new Vec3(0, 0, 0));
        const uiTransPopup = this.damagePopup.node.getComponent(UITransform);
        if (!uiTransPopup) return;
        const localPos = uiTransPopup.convertToNodeSpaceAR(worldPos);

        const anim = ObjectPool.allocate(LabelAnimData);
        anim.text = numberStr;
        anim.duration = this.popupDuration;
        anim.ease = "backOut";
        const displayColor = this.getPopupTypeColor(popupType);

        const initialHorizontalOffset = (Math.random() * 2 - 1) * 60;
        const initialVerticalOffset = (Math.random() * 2 - 1) * 10;
        anim.from.position.x = localPos.x + initialHorizontalOffset;
        anim.from.position.y = localPos.y + headOffset + initialVerticalOffset;
        anim.from.scale = isCrit ? this.critFontScale : this.baseFontScale;
        anim.from.color.set(displayColor);

        const endHorizontalOffset = initialHorizontalOffset + (Math.random() * 2 - 1) * 30;
        anim.to.position.x = localPos.x + endHorizontalOffset;
        anim.to.position.y = localPos.y + headOffset + this.popupDriftHeight + initialVerticalOffset;
        anim.to.scale = (isCrit ? this.critFontScale : this.baseFontScale) * this.popupEndScaleFactor;
        anim.to.color.set(displayColor);
        anim.to.color.a = 0;

        this.damagePopup.addAnim(anim);
        anim.release();
    }

    // 根据显示类型获取颜色
    private getPopupTypeColor(popupType: PopupType): Color {
        switch (popupType) {
            case PopupType.PhysicalDamage:
                return new Color(255, 255, 255, 255); // 白
            case PopupType.CritPhysicalDamage:
                return new Color(255, 100, 0, 255); // 橙红 (暴击物理)
            case PopupType.MagicDamage:
                return new Color(138, 43, 226, 255); // 紫 (魔法)
            case PopupType.CritMagicDamage:
                return new Color(255, 0, 255, 255); // 品红 (暴击魔法)
            case PopupType.TrueDamage:
                return new Color(218, 165, 32, 255); // 金黄 (真实)
            case PopupType.Heal:
                return new Color(0, 255, 0, 255);   // 绿 (治疗)
            default:
                return Color.WHITE;
        }
    }
}

