System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, BitmapFont, CCBoolean, CCFloat, CCInteger, Color, Sprite, SpriteAtlas, SpriteFrame, LabelAnimData, LabelAnimRuntimeInfo, ObjectPool, popUpLabelAssembler, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, PopUpLabel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _reportPossibleCrUseOfLabelAnimData(extras) {
    _reporterNs.report("LabelAnimData", "./label-anim-data", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLabelAnimRuntimeInfo(extras) {
    _reporterNs.report("LabelAnimRuntimeInfo", "./label-anim-runtime-data", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPool(extras) {
    _reporterNs.report("ObjectPool", "./object-pool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfpopUpLabelAssembler(extras) {
    _reporterNs.report("popUpLabelAssembler", "./popup-label-assembler", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      BitmapFont = _cc.BitmapFont;
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Color = _cc.Color;
      Sprite = _cc.Sprite;
      SpriteAtlas = _cc.SpriteAtlas;
      SpriteFrame = _cc.SpriteFrame;
    }, function (_unresolved_2) {
      LabelAnimData = _unresolved_2.LabelAnimData;
    }, function (_unresolved_3) {
      LabelAnimRuntimeInfo = _unresolved_3.LabelAnimRuntimeInfo;
    }, function (_unresolved_4) {
      ObjectPool = _unresolved_4.ObjectPool;
    }, function (_unresolved_5) {
      popUpLabelAssembler = _unresolved_5.popUpLabelAssembler;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "337d5iclVNP7Je8kRmfQY7f", "popup-label", undefined);

      __checkObsolete__(['_decorator', 'BitmapFont', 'CCBoolean', 'CCFloat', 'CCInteger', 'Color', 'Sprite', 'SpriteAtlas', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PopUpLabel", PopUpLabel = (_dec = ccclass('PopUpLabel'), _dec2 = property(SpriteFrame), _dec3 = property(BitmapFont), _dec4 = property({
        type: [BitmapFont]
      }), _dec5 = property({
        type: [BitmapFont],
        tooltip: "所有位图字体需要使用同一张位图资源"
      }), _dec6 = property(CCFloat), _dec7 = property({
        type: CCFloat,
        tooltip: "字间距"
      }), _dec8 = property({
        type: SpriteAtlas,
        override: true,
        visible: false
      }), _dec9 = property({
        type: CCInteger,
        override: true,
        visible: false
      }), _dec10 = property({
        type: CCBoolean,
        override: true,
        visible: false
      }), _dec11 = property({
        type: CCInteger,
        override: true,
        visible: false
      }), _dec12 = property({
        type: CCBoolean,
        override: true,
        visible: false
      }), _dec13 = property({
        type: Color,
        override: true,
        visible: false
      }), _dec14 = property({
        type: CCInteger,
        tooltip: "允许同时存在的最大动画数量"
      }), _dec(_class = (_class2 = class PopUpLabel extends Sprite {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "_fonts", _descriptor, this);

          _initializerDefineProperty(this, "_spacingX", _descriptor2, this);

          // 添加一个可配置的最大动画数量
          _initializerDefineProperty(this, "maxAnimations", _descriptor3, this);

          this._anims = [];
        }

        //useMult = false;
        get defaultSpriteFrame() {
          var _this$_fonts;

          return (_this$_fonts = this._fonts) == null || (_this$_fonts = _this$_fonts[0]) == null ? void 0 : _this$_fonts.spriteFrame;
        }

        get defaultFont() {
          var _this$_fonts2;

          return (_this$_fonts2 = this._fonts) == null ? void 0 : _this$_fonts2[0];
        }

        get fonts() {
          return this._fonts;
        }

        set fonts(v) {
          var _v$, _this$_fonts$;

          const spr = (_v$ = v[0]) == null ? void 0 : _v$.spriteFrame;
          this._fonts = v.map(f => (f == null ? void 0 : f.spriteFrame) === spr ? f : undefined);
          this.spriteFrame = (_this$_fonts$ = this._fonts[0]) == null ? void 0 : _this$_fonts$.spriteFrame;
          this.markForUpdateRenderData();
        }

        get spacingX() {
          return this._spacingX;
        }

        set spacingX(v) {
          if (this._spacingX === v) {
            return;
          }

          this._spacingX = v;
          this.markForUpdateRenderData();
        }

        get spriteAtlas() {
          return this._atlas;
        }

        get type() {
          return this._type;
        }

        get trim() {
          return this._isTrimmedMode;
        }

        get sizeMode() {
          return this._sizeMode;
        }

        get grayscale() {
          return this._useGrayscale;
        }

        get color() {
          return this._color;
        }

        // 设置一个上限，例如 100

        /** 
         * 添加一个动画
         * @description 使用 ObjectPool.allocate 创建新的动画
         * @description 三角形过多可能超过MeshBuffer顶点数量上限，详见下面的链接
         * @see https://docs.cocos.com/creator/manual/zh/ui-system/components/engine/ui-batch.html#v341-%E4%B9%8B%E5%90%8E
         */
        addAnim(data) {
          // *** 新增：检查当前动画数量是否已达上限 ***
          if (this._anims.length >= this.maxAnimations) {
            // 如果达到上限，可以选择直接返回，或者快速回收最早的动画来腾出空间
            // 这里先简单返回，不显示新的伤害数字
            // console.warn(`PopUpLabel: 达到最大动画数量 (${this.maxAnimations})，忽略新的伤害数字。`);
            // 注意：这里需要确保传入的 data (LabelAnimData) 也要被回收
            // 假设 LabelAnimData 也有 release 方法 (根据你的 object-pool 实现)
            (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
              error: Error()
            }), ObjectPool) : ObjectPool).allocate(_crd && LabelAnimData === void 0 ? (_reportPossibleCrUseOfLabelAnimData({
              error: Error()
            }), LabelAnimData) : LabelAnimData).release(); // 从池中取一个再立刻释放，确保计数平衡
            // 或者如果 LabelAnimData 不需要池管理，直接 return 即可
            // data.release?.(); // 如果你的 LabelAnimData 需要 release

            return;
          } // *** 结束新增检查 ***


          const anim = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
            error: Error()
          }), ObjectPool) : ObjectPool).allocate(_crd && LabelAnimRuntimeInfo === void 0 ? (_reportPossibleCrUseOfLabelAnimRuntimeInfo({
            error: Error()
          }), LabelAnimRuntimeInfo) : LabelAnimRuntimeInfo, data, this._fonts[data.font], this.spacingX);

          this._anims.push(anim);
        }

        get anims() {
          return this._anims;
        }

        onEnable() {
          super.onEnable();
          this.markForUpdateRenderData();
        }

        update(dt) {
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

        _flushAssembler() {
          if (this._assembler !== (_crd && popUpLabelAssembler === void 0 ? (_reportPossibleCrUseOfpopUpLabelAssembler({
            error: Error()
          }), popUpLabelAssembler) : popUpLabelAssembler)) {
            this.destroyRenderData();
            this._assembler = _crd && popUpLabelAssembler === void 0 ? (_reportPossibleCrUseOfpopUpLabelAssembler({
              error: Error()
            }), popUpLabelAssembler) : popUpLabelAssembler;
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

      }, (_applyDecoratedDescriptor(_class2.prototype, "defaultSpriteFrame", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "defaultSpriteFrame"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "defaultFont", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "defaultFont"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_fonts", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "fonts", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "fonts"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_spacingX", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "spacingX", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "spacingX"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spriteAtlas", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "spriteAtlas"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "type", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "trim", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "trim"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "sizeMode", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "sizeMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "grayscale", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "grayscale"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "maxAnimations", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fa9ffaecf4ddfd58457a850297bf3d1122c895f5.js.map