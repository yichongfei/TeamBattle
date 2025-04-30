import { _decorator, BitmapFont, CCBoolean, CCFloat, CCInteger, Color, Sprite, SpriteAtlas, SpriteFrame } from 'cc';
import { LabelAnimData } from './label-anim-data';
import { LabelAnimRuntimeInfo } from './label-anim-runtime-data';
import { ObjectPool } from './object-pool';
import { popUpLabelAssembler } from './popup-label-assembler';
const { ccclass, property } = _decorator;

@ccclass('PopUpLabel')
export class PopUpLabel extends Sprite {
    //useMult = false;
    @property(SpriteFrame)
    get defaultSpriteFrame(): SpriteFrame | null {
        return this._fonts?.[0]?.spriteFrame;
    }

    @property(BitmapFont)
    get defaultFont(): BitmapFont | null {
        return this._fonts?.[0];
    }

    @property({
        type: [BitmapFont],
    })
    private _fonts: Array<BitmapFont> = [];
    @property({
        type: [BitmapFont],
        tooltip: "所有位图字体需要使用同一张位图资源"
    })
    public get fonts(): Array<BitmapFont> {
        return this._fonts;
    }
    public set fonts(v: Array<BitmapFont>) {
        const spr = v[0]?.spriteFrame;
        this._fonts = v.map(f => (f?.spriteFrame === spr) ? f : undefined);
        this.spriteFrame = this._fonts[0]?.spriteFrame;
        this.markForUpdateRenderData();
    }

    @property(CCFloat)
    private _spacingX: number = 0;
    @property({
        type: CCFloat,
        tooltip: "字间距"
    })
    public get spacingX(): number {
        return this._spacingX;
    }
    public set spacingX(v: number) {
        if (this._spacingX === v) {
            return;
        }
        this._spacingX = v;
        this.markForUpdateRenderData();
    }

    @property({
        type: SpriteAtlas,
        override: true,
        visible: false
    })
    get spriteAtlas(): SpriteAtlas {
        return this._atlas;
    }

    @property({
        type: CCInteger,
        override: true,
        visible: false
    })
    get type(): typeof this._type {
        return this._type;
    }

    @property({
        type: CCBoolean,
        override: true,
        visible: false
    })
    get trim(): boolean {
        return this._isTrimmedMode;
    }

    @property({
        type: CCInteger,
        override: true,
        visible: false
    })
    get sizeMode(): typeof this._sizeMode {
        return this._sizeMode;
    }

    @property({
        type: CCBoolean,
        override: true,
        visible: false
    })
    get grayscale(): boolean {
        return this._useGrayscale;
    }

    @property({
        type: Color,
        override: true,
        visible: false
    })
    get color(): Color {
        return this._color;
    }

    // 添加一个可配置的最大动画数量
    @property({
        type: CCInteger,
        tooltip: "允许同时存在的最大动画数量"
    })
    public maxAnimations: number = 100; // 设置一个上限，例如 100

    /** 
     * 添加一个动画
     * @description 使用 ObjectPool.allocate 创建新的动画
     * @description 三角形过多可能超过MeshBuffer顶点数量上限，详见下面的链接
     * @see https://docs.cocos.com/creator/manual/zh/ui-system/components/engine/ui-batch.html#v341-%E4%B9%8B%E5%90%8E
     */
    public addAnim(data: LabelAnimData) {
        // *** 新增：检查当前动画数量是否已达上限 ***
        if (this._anims.length >= this.maxAnimations) {
            // 如果达到上限，可以选择直接返回，或者快速回收最早的动画来腾出空间
            // 这里先简单返回，不显示新的伤害数字
            // console.warn(`PopUpLabel: 达到最大动画数量 (${this.maxAnimations})，忽略新的伤害数字。`);
            // 注意：这里需要确保传入的 data (LabelAnimData) 也要被回收
            // 假设 LabelAnimData 也有 release 方法 (根据你的 object-pool 实现)
            ObjectPool.allocate(LabelAnimData).release(); // 从池中取一个再立刻释放，确保计数平衡
            // 或者如果 LabelAnimData 不需要池管理，直接 return 即可
            // data.release?.(); // 如果你的 LabelAnimData 需要 release
            return; 
        }
        // *** 结束新增检查 ***

        const anim = ObjectPool.allocate(LabelAnimRuntimeInfo, data, this._fonts[data.font], this.spacingX);
        this._anims.push(anim);
    }

    private _anims: LabelAnimRuntimeInfo[] = [];
    public get anims(): LabelAnimRuntimeInfo[] {
        return this._anims;
    }

    onEnable() {
        super.onEnable();
        this.markForUpdateRenderData();
    }

    update(dt: number) {
        let flag = false;
        this._anims.forEach(a => {
            if (a.shouldRecycle) {
                flag = true;
                a.release();
            }
        });
        this._anims = this._anims.filter(a => !a.shouldRecycle);
        this._anims.forEach(a => a.update(dt));
        if (this._anims.length || flag) {
            this.markForUpdateRenderData();
        }
    }

    protected _flushAssembler() {
        if (this._assembler !== popUpLabelAssembler) {
            this.destroyRenderData();
            this._assembler = popUpLabelAssembler;
        }
        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData.material = this.getRenderMaterial(0);
                this.markForUpdateRenderData();
                this._updateColor();
            }
        }
    }
}
