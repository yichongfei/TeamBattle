import { easing } from "cc";
import { LabelAnimState } from "./label-anim-state";
import { ObjectPool, PoolItem } from "./object-pool";

@ObjectPool.register(128, 16)
export class LabelAnimData implements PoolItem {
    initialize(...args: any[]): void { }

    release(): void {
        this.from.reset();
        this.to.reset();
        this.duration = 0;
        this.font = 0;
    }

    copy(data: LabelAnimData) {
        this.text = data.text;
        this.from.copy(data.from);
        this.to.copy(data.to);
        this.duration = data.duration;
        this.font = data.font;
        this.ease = data.ease;
    }

    /** 文本内容 */
    text: string = "";
    /** 起始状态 */
    from = new LabelAnimState();
    /** 结束状态 */
    to = new LabelAnimState();
    /** 持续时间，单位s */
    duration: number = 0;
    /** 
     * 字体下标
     * @default 0
     */
    font: number = 0;
    /** 
     * 缓动函数
     * @default "linear"
     */
    ease: keyof typeof easing = "linear";
}