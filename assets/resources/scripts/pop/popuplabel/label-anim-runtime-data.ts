import { BitmapFont, Rect, easing, lerp } from "cc";
import { LabelAnimData } from "./label-anim-data";
import { LabelAnimState } from "./label-anim-state";
import { ObjectPool, PoolItem } from "./object-pool";

@ObjectPool.register()
export class LabelAnimRuntimeInfo implements PoolItem {
    initialize(anim: LabelAnimData, font: BitmapFont, spacingX: number) {
        this.progress = 0;
        this.ts = 0;
        this.shouldRecycle = false;
        this.len = anim.text.length;
        this.data.copy(anim);
        this._prepareLayoutData(font, spacingX);
    }

    release() {
        this.current.reset();
        this.layout.length = 0;
    }

    update(dt: number) {
        this.ts += dt;
        this.progress = Math.min(1, this.ts / this.data.duration);
        const r = easing[this.data.ease](this.progress);
        this.current.scale = lerp(this.data.from.scale, this.data.to.scale, r);
        this.current.rotate = lerp(this.data.from.rotate, this.data.to.rotate, r);
        this.current.color.r = lerp(this.data.from.color.r, this.data.to.color.r, r);
        this.current.color.g = lerp(this.data.from.color.g, this.data.to.color.g, r);
        this.current.color.b = lerp(this.data.from.color.b, this.data.to.color.b, r);
        this.current.color.a = lerp(this.data.from.color.a, this.data.to.color.a, r);
        this.current.position.x = lerp(this.data.from.position.x, this.data.to.position.x, r);
        this.current.position.y = lerp(this.data.from.position.y, this.data.to.position.y, r);
        if (this.progress >= 1) {
            this.shouldRecycle = true;
        }
    }

    private _prepareLayoutData(font: BitmapFont, spacingX: number) {
        this.layout.length = this.len * LabelAnimRuntimeInfo.LetterOffset;
        const fontHeight = font.fntConfig.commonHeight as number;
        let indexOffset = 0;
        let letterW = 0;
        for (let i = 0; i < this.len; i++) {
            /**
             * @see https://www.angelcode.com/products/bmfont/doc/file_format.html
             */
            const config = font.fntConfig.fontDefDictionary[this.data.text.charCodeAt(i)] as {
                rect: Rect;
                /** 渲染字体时x方向的调整 */
                xOffset: number;
                /** 渲染字体时y方向的调整 */
                yOffset: number;
                /** 渲染字体时字体的宽度, 渲染一个字体后, 下一个字体从x+=xadvance处开始 */
                xAdvance: number;
            };
            if (letterW === 0) {
                letterW = -config.xAdvance / 2;
            }
            this.layout[indexOffset++] = config.rect.x;
            this.layout[indexOffset++] = config.rect.y;
            this.layout[indexOffset++] = config.rect.width;
            this.layout[indexOffset++] = config.rect.height;
            this.layout[indexOffset++] = config.xAdvance + letterW + spacingX;
            this.layout[indexOffset++] = -fontHeight / 2 + config.yOffset;
            letterW += (config.xAdvance + spacingX);
        }
        for (let i = 0; i < this.len; i++) {
            this.layout[i * LabelAnimRuntimeInfo.LetterOffset + 4] -= letterW / 2;
        }
    }

    /** u v w h offsetx offsety */
    static readonly LetterOffset = 6;

    /** layout data */
    layout: number[] = [];
    /** 动画数据 */
    data = ObjectPool.allocate(LabelAnimData);
    /** 字符串长度 */
    len: number;
    /** 运行时间，单位ms */
    ts: number;
    /** 当前进度 */
    progress: number = 0;
    /** 当前状态 */
    current = new LabelAnimState();
    /** 回收标记 */
    shouldRecycle: boolean = false;
}