System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Color, Vec2, LabelAnimState, _crd;

  _export("LabelAnimState", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Color = _cc.Color;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b1c89F0F1RGq4ixWdqQviIR", "label-anim-state", undefined);

      __checkObsolete__(['Color', 'Vec2']);

      _export("LabelAnimState", LabelAnimState = class LabelAnimState {
        constructor() {
          /** 
           * 颜色
           * @default cc.Color.WHITE
           */
          this.color = Color.WHITE.clone();

          /** 
           * 本地坐标
           * @default cc.Vec2.ZERO
           */
          this.position = Vec2.ZERO.clone();

          /** 
           * 旋转
           * @default 0
           * @description 没实现
           */
          this.rotate = 0;

          /** 
           * 缩放
           * @default 1
           */
          this.scale = 1;
        }

        reset() {
          this.color.set(255, 255, 255, 255);
          this.position.set(0, 0);
          this.rotate = 0;
          this.scale = 1;
        }

        copy(data) {
          this.color.set(data.color);
          this.position.set(data.position);
          this.rotate = data.rotate;
          this.scale = data.scale;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=64b22f76682f29a66bd8889eb1b54a96e1509a68.js.map