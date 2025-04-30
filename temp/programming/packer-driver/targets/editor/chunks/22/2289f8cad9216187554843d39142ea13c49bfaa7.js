System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, easing, lerp, LabelAnimData, LabelAnimState, ObjectPool, _dec, _class, _class2, _crd, LabelAnimRuntimeInfo;

  function _reportPossibleCrUseOfLabelAnimData(extras) {
    _reporterNs.report("LabelAnimData", "./label-anim-data", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLabelAnimState(extras) {
    _reporterNs.report("LabelAnimState", "./label-anim-state", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPool(extras) {
    _reporterNs.report("ObjectPool", "./object-pool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolItem(extras) {
    _reporterNs.report("PoolItem", "./object-pool", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      easing = _cc.easing;
      lerp = _cc.lerp;
    }, function (_unresolved_2) {
      LabelAnimData = _unresolved_2.LabelAnimData;
    }, function (_unresolved_3) {
      LabelAnimState = _unresolved_3.LabelAnimState;
    }, function (_unresolved_4) {
      ObjectPool = _unresolved_4.ObjectPool;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4e3322nB/ZCKY0UBjxb6VEL", "label-anim-runtime-data", undefined);

      __checkObsolete__(['BitmapFont', 'Rect', 'easing', 'lerp']);

      _export("LabelAnimRuntimeInfo", LabelAnimRuntimeInfo = (_dec = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
        error: Error()
      }), ObjectPool) : ObjectPool).register(), _dec(_class = (_class2 = class LabelAnimRuntimeInfo {
        constructor() {
          /** layout data */
          this.layout = [];

          /** 动画数据 */
          this.data = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
            error: Error()
          }), ObjectPool) : ObjectPool).allocate(_crd && LabelAnimData === void 0 ? (_reportPossibleCrUseOfLabelAnimData({
            error: Error()
          }), LabelAnimData) : LabelAnimData);

          /** 字符串长度 */
          this.len = void 0;

          /** 运行时间，单位ms */
          this.ts = void 0;

          /** 当前进度 */
          this.progress = 0;

          /** 当前状态 */
          this.current = new (_crd && LabelAnimState === void 0 ? (_reportPossibleCrUseOfLabelAnimState({
            error: Error()
          }), LabelAnimState) : LabelAnimState)();

          /** 回收标记 */
          this.shouldRecycle = false;
        }

        initialize(anim, font, spacingX) {
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

        update(dt) {
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

        _prepareLayoutData(font, spacingX) {
          this.layout.length = this.len * LabelAnimRuntimeInfo.LetterOffset;
          const fontHeight = font.fntConfig.commonHeight;
          let indexOffset = 0;
          let letterW = 0;

          for (let i = 0; i < this.len; i++) {
            /**
             * @see https://www.angelcode.com/products/bmfont/doc/file_format.html
             */
            const config = font.fntConfig.fontDefDictionary[this.data.text.charCodeAt(i)];

            if (letterW === 0) {
              letterW = -config.xAdvance / 2;
            }

            this.layout[indexOffset++] = config.rect.x;
            this.layout[indexOffset++] = config.rect.y;
            this.layout[indexOffset++] = config.rect.width;
            this.layout[indexOffset++] = config.rect.height;
            this.layout[indexOffset++] = config.xAdvance + letterW + spacingX;
            this.layout[indexOffset++] = -fontHeight / 2 + config.yOffset;
            letterW += config.xAdvance + spacingX;
          }

          for (let i = 0; i < this.len; i++) {
            this.layout[i * LabelAnimRuntimeInfo.LetterOffset + 4] -= letterW / 2;
          }
        }
        /** u v w h offsetx offsety */


      }, _class2.LetterOffset = 6, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2289f8cad9216187554843d39142ea13c49bfaa7.js.map