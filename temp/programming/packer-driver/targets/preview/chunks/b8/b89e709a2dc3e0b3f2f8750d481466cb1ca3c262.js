System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UITransform, LabelAnimData, ObjectPool, PopUpLabel, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, add_anim;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLabelAnimData(extras) {
    _reporterNs.report("LabelAnimData", "./popuplabel/label-anim-data", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPool(extras) {
    _reporterNs.report("ObjectPool", "./popuplabel/object-pool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPopUpLabel(extras) {
    _reporterNs.report("PopUpLabel", "./popuplabel/popup-label", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      LabelAnimData = _unresolved_2.LabelAnimData;
    }, function (_unresolved_3) {
      ObjectPool = _unresolved_3.ObjectPool;
    }, function (_unresolved_4) {
      PopUpLabel = _unresolved_4.PopUpLabel;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "eaf49nrHtZNVKchMIslwtKa", "add-anim", undefined);

      __checkObsolete__(['_decorator', 'Component', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("add_anim", add_anim = (_dec = ccclass('add_anim'), _dec2 = property(_crd && PopUpLabel === void 0 ? (_reportPossibleCrUseOfPopUpLabel({
        error: Error()
      }), PopUpLabel) : PopUpLabel), _dec(_class = (_class2 = class add_anim extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "popup", _descriptor, this);
        }

        update() {
          var width = this.node.getComponent(UITransform).contentSize.width;
          var height = this.node.getComponent(UITransform).contentSize.height;
          var x = ~~(width / 2 - width * Math.random());
          var y = ~~(height / 2 - height * Math.random());
          var anim = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
            error: Error()
          }), ObjectPool) : ObjectPool).allocate(_crd && LabelAnimData === void 0 ? (_reportPossibleCrUseOfLabelAnimData({
            error: Error()
          }), LabelAnimData) : LabelAnimData);
          anim.duration = 6;
          anim.ease = "backIn";
          anim.text = x + " ," + y;
          anim.from.scale = 0.3;
          anim.from.color.r = ~~(255 * Math.random());
          anim.from.color.g = ~~(255 * Math.random());
          anim.from.color.b = ~~(255 * Math.random());
          anim.from.position.x = x;
          anim.from.position.y = y;
          anim.to.scale = 0.2;
          anim.to.color.r = 255;
          anim.to.color.r = 255;
          anim.to.color.r = 255;
          anim.to.color.a = 0;
          this.popup.addAnim(anim);
          anim.release();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "popup", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b89e709a2dc3e0b3f2f8750d481466cb1ca3c262.js.map