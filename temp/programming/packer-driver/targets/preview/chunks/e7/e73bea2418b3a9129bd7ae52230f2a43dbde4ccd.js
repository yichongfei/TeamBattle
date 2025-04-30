System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RoleType, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, RoleComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRoleType(extras) {
    _reporterNs.report("RoleType", "../../common/Enums", _context.meta, extras);
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
    }, function (_unresolved_2) {
      RoleType = _unresolved_2.RoleType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9337asS5YRBv4eLHd7jpH+P", "RoleComponent", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 标识角色的定位（职责），影响 AI 决策和目标选择。
       */

      _export("RoleComponent", RoleComponent = (_dec = ccclass('RoleComponent'), _dec2 = property({
        type: _crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
          error: Error()
        }), RoleType) : RoleType,
        tooltip: '角色的主要定位',
        displayOrder: 1
      }), _dec3 = property({
        type: Number,
        tooltip: '远程/治疗职业希望保持的最小距离',
        min: 0,
        displayOrder: 10,
        visible: function visible() {
          return this.role === (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
            error: Error()
          }), RoleType) : RoleType).RANGED_DPS || this.role === (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
            error: Error()
          }), RoleType) : RoleType).HEALER;
        }
      }), _dec4 = property({
        type: Number,
        tooltip: '远程/治疗职业希望保持的最大距离 (超出则靠近)',
        min: 0,
        displayOrder: 11,
        visible: function visible() {
          return this.role === (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
            error: Error()
          }), RoleType) : RoleType).RANGED_DPS || this.role === (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
            error: Error()
          }), RoleType) : RoleType).HEALER;
        }
      }), _dec5 = property({
        type: Number,
        tooltip: '坦克吸引仇恨的基础值或倍率',
        min: 0,
        displayOrder: 20,
        visible: function visible() {
          return this.role === (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
            error: Error()
          }), RoleType) : RoleType).TANK;
        }
      }), _dec6 = property({
        type: Number,
        tooltip: '治疗者开始关注友方单位的生命值百分比阈值',
        range: [0, 1, 0.01],
        displayOrder: 30,
        visible: function visible() {
          return this.role === (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
            error: Error()
          }), RoleType) : RoleType).HEALER;
        }
      }), _dec(_class = (_class2 = class RoleComponent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "role", _descriptor, this);

          // --- 定位相关的特定参数 (可选) ---
          _initializerDefineProperty(this, "preferredMinDistance", _descriptor2, this);

          _initializerDefineProperty(this, "preferredMaxDistance", _descriptor3, this);

          _initializerDefineProperty(this, "threatModifier", _descriptor4, this);

          _initializerDefineProperty(this, "healTriggerThreshold", _descriptor5, this);
        } // start() {}
        // update(deltaTime: number) {}


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "role", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && RoleType === void 0 ? (_reportPossibleCrUseOfRoleType({
            error: Error()
          }), RoleType) : RoleType).MELEE_DPS;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "preferredMinDistance", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "preferredMaxDistance", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 400;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "threatModifier", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "healTriggerThreshold", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e73bea2418b3a9129bd7ae52230f2a43dbde4ccd.js.map