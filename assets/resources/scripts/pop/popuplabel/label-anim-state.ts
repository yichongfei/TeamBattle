import { Color, Vec2 } from "cc";

export class LabelAnimState {
    reset() {
        this.color.set(255, 255, 255, 255);
        this.position.set(0, 0);
        this.rotate = 0;
        this.scale = 1;
    }

    copy(data: LabelAnimState) {
        this.color.set(data.color);
        this.position.set(data.position);
        this.rotate = data.rotate;
        this.scale = data.scale;
    }

    /** 
     * 颜色
     * @default cc.Color.WHITE
     */
    color: Color = Color.WHITE.clone();
    /** 
     * 本地坐标
     * @default cc.Vec2.ZERO
     */
    position: Vec2 = Vec2.ZERO.clone();
    /** 
     * 旋转
     * @default 0
     * @description 没实现
     */
    rotate: number = 0;
    /** 
     * 缩放
     * @default 1
     */
    scale: number = 1;
}