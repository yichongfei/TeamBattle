System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, LabelAnimState, ObjectPool, _dec, _class, _crd, LabelAnimData;

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
    }, function (_unresolved_2) {
      LabelAnimState = _unresolved_2.LabelAnimState;
    }, function (_unresolved_3) {
      ObjectPool = _unresolved_3.ObjectPool;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f66d8/0uc5KJZLFwRlfszYf", "label-anim-data", undefined);

      __checkObsolete__(['easing']);

      _export("LabelAnimData", LabelAnimData = (_dec = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
        error: Error()
      }), ObjectPool) : ObjectPool).register(128, 16), _dec(_class = class LabelAnimData {
        constructor() {
          /** 文本内容 */
          this.text = "";

          /** 起始状态 */
          this.from = new (_crd && LabelAnimState === void 0 ? (_reportPossibleCrUseOfLabelAnimState({
            error: Error()
          }), LabelAnimState) : LabelAnimState)();

          /** 结束状态 */
          this.to = new (_crd && LabelAnimState === void 0 ? (_reportPossibleCrUseOfLabelAnimState({
            error: Error()
          }), LabelAnimState) : LabelAnimState)();

          /** 持续时间，单位s */
          this.duration = 0;

          /** 
           * 字体下标
           * @default 0
           */
          this.font = 0;

          /** 
           * 缓动函数
           * @default "linear"
           */
          this.ease = "linear";
        }

        initialize(...args) {}

        release() {
          this.from.reset();
          this.to.reset();
          this.duration = 0;
          this.font = 0;
        }

        copy(data) {
          this.text = data.text;
          this.from.copy(data.from);
          this.to.copy(data.to);
          this.duration = data.duration;
          this.font = data.font;
          this.ease = data.ease;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5ec8deddb1bc319e56e37307bb956f6936030e0c.js.map