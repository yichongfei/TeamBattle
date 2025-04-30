System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, find, UITransform, Color, director, LabelAnimData, ObjectPool, PopUpLabel, DamageSystemAttackType, _dec, _dec2, _class, _class2, _descriptor, _class3, _crd, ccclass, property, PopupType, DamageControl;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLabelAnimData(extras) {
    _reporterNs.report("LabelAnimData", "../pop/popuplabel/label-anim-data", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPool(extras) {
    _reporterNs.report("ObjectPool", "../pop/popuplabel/object-pool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPopUpLabel(extras) {
    _reporterNs.report("PopUpLabel", "../pop/popuplabel/popup-label", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDamageSystemAttackType(extras) {
    _reporterNs.report("DamageSystemAttackType", "../common/Enums", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
      find = _cc.find;
      UITransform = _cc.UITransform;
      Color = _cc.Color;
      director = _cc.director;
    }, function (_unresolved_2) {
      LabelAnimData = _unresolved_2.LabelAnimData;
    }, function (_unresolved_3) {
      ObjectPool = _unresolved_3.ObjectPool;
    }, function (_unresolved_4) {
      PopUpLabel = _unresolved_4.PopUpLabel;
    }, function (_unresolved_5) {
      DamageSystemAttackType = _unresolved_5.AttackType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8378bvItpNLRIY2+SlEub/p", "DamageControl", undefined); // DamageControl.ts


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Vec3', 'find', 'UITransform', 'tween', 'UIOpacity', 'Color', 'Canvas', 'Camera', 'director', 'view']);

      // 重命名避免与 DamageControl 内部的 DamageType 冲突
      ({
        ccclass,
        property
      } = _decorator); // DamageControl 内部用于区分显示类型的枚举

      _export("PopupType", PopupType = /*#__PURE__*/function (PopupType) {
        PopupType[PopupType["PhysicalDamage"] = 0] = "PhysicalDamage";
        PopupType[PopupType["MagicDamage"] = 1] = "MagicDamage";
        PopupType[PopupType["TrueDamage"] = 2] = "TrueDamage";
        PopupType[PopupType["Heal"] = 3] = "Heal";
        PopupType[PopupType["CritPhysicalDamage"] = 4] = "CritPhysicalDamage";
        PopupType[PopupType["CritMagicDamage"] = 5] = "CritMagicDamage";
        return PopupType;
      }({}));

      _export("DamageControl", DamageControl = (_dec = ccclass('DamageControl'), _dec2 = property(_crd && PopUpLabel === void 0 ? (_reportPossibleCrUseOfPopUpLabel({
        error: Error()
      }), PopUpLabel) : PopUpLabel), _dec(_class = (_class2 = (_class3 = class DamageControl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "damagePopup", _descriptor, this);

          // 移除伤害计算相关属性
          // private damageFloatRange: number = 0.1;
          this.baseFontScale = 1.0;
          this.critFontScale = 1.2;
          this.popupDuration = 1.2;
          this.popupMoveEase = "sineOut";
          this.popupEndScaleFactor = 0.5;
          this.popupDriftHeight = 120;
        }

        static getInstance() {
          if (!DamageControl._instance) {
            var _find;

            DamageControl._instance = (_find = find('Canvas/DamageControl')) == null ? void 0 : _find.getComponent(DamageControl);

            if (!DamageControl._instance) {
              console.error("DamageControl: 未找到 Canvas 上的 DamageControl 组件！");
            }
          }

          return DamageControl._instance;
        }

        onDestroy() {
          if (DamageControl._instance === this) {
            DamageControl._instance = null;
          } // 移除事件监听


          director.off('final-damage-applied', this.handleDamageEvent, this);
          director.off('final-heal-applied', this.handleHealEvent, this);
        }

        start() {
          if (!this.damagePopup) {
            var _find2;

            this.damagePopup = (_find2 = find('Canvas/DamagePopup')) == null ? void 0 : _find2.getComponent(_crd && PopUpLabel === void 0 ? (_reportPossibleCrUseOfPopUpLabel({
              error: Error()
            }), PopUpLabel) : PopUpLabel);
          } // 注册全局事件监听


          director.on('final-damage-applied', this.handleDamageEvent, this);
          director.on('final-heal-applied', this.handleHealEvent, this);
          console.log("DamageControl started and listening for events.");
        } // 添加设置PopUpLabel的方法


        setPopUpLabel(popupLabel) {
          this.damagePopup = popupLabel;
        } // 处理最终伤害事件


        handleDamageEvent(eventData) {
          if (!eventData || !eventData.targetNode || eventData.damage <= 0) return; // 确定显示类型

          let popupType;

          if (eventData.isCrit) {
            popupType = eventData.damageType === (_crd && DamageSystemAttackType === void 0 ? (_reportPossibleCrUseOfDamageSystemAttackType({
              error: Error()
            }), DamageSystemAttackType) : DamageSystemAttackType).PHYSICAL ? PopupType.CritPhysicalDamage : PopupType.CritMagicDamage; // 简化处理
          } else {
            popupType = eventData.damageType === (_crd && DamageSystemAttackType === void 0 ? (_reportPossibleCrUseOfDamageSystemAttackType({
              error: Error()
            }), DamageSystemAttackType) : DamageSystemAttackType).PHYSICAL ? PopupType.PhysicalDamage : PopupType.MagicDamage;
          }

          if (eventData.damageType === (_crd && DamageSystemAttackType === void 0 ? (_reportPossibleCrUseOfDamageSystemAttackType({
            error: Error()
          }), DamageSystemAttackType) : DamageSystemAttackType).TRUE) {
            popupType = PopupType.TrueDamage;
          }

          const damageStr = Math.round(eventData.damage).toString();
          this.showNumberPopup(eventData.targetNode, damageStr, eventData.isCrit, popupType);
        } // 处理最终治疗事件


        handleHealEvent(eventData) {
          if (!eventData || !eventData.targetNode || eventData.healAmount <= 0) return;
          const healStr = Math.round(eventData.healAmount).toString(); // 治疗默认不暴击，类型为 Heal

          this.showNumberPopup(eventData.targetNode, `+${healStr}`, false, PopupType.Heal);
        }
        /**
         * 通用的数字飘字显示方法
         * @param targetNode 目标节点
         * @param numberStr 要显示的数字字符串 (已包含 +/- 或暴击前缀)
         * @param isCrit 是否暴击 (影响动画和字体大小)
         * @param popupType 显示类型 (影响颜色等)
         */


        showNumberPopup(targetNode, numberStr, isCrit, popupType) {
          if (!this.damagePopup) {
            var _find3;

            this.damagePopup = (_find3 = find('Canvas/DamagePopup')) == null ? void 0 : _find3.getComponent(_crd && PopUpLabel === void 0 ? (_reportPossibleCrUseOfPopUpLabel({
              error: Error()
            }), PopUpLabel) : PopUpLabel);

            if (!this.damagePopup) {
              console.error("DamageControl: 未找到PopUpLabel组件，无法显示伤害数字");
              return;
            }
          }

          if (!targetNode || !targetNode.isValid) return;
          const uiTransTarget = targetNode.getComponent(UITransform);
          if (!uiTransTarget) return;
          const headOffset = uiTransTarget.height / 2;
          const worldPos = uiTransTarget.convertToWorldSpaceAR(new Vec3(0, 0, 0));
          const uiTransPopup = this.damagePopup.node.getComponent(UITransform);
          if (!uiTransPopup) return;
          const localPos = uiTransPopup.convertToNodeSpaceAR(worldPos);
          const anim = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
            error: Error()
          }), ObjectPool) : ObjectPool).allocate(_crd && LabelAnimData === void 0 ? (_reportPossibleCrUseOfLabelAnimData({
            error: Error()
          }), LabelAnimData) : LabelAnimData);
          anim.text = numberStr;
          anim.duration = this.popupDuration;
          anim.ease = "backOut";
          const displayColor = this.getPopupTypeColor(popupType);
          const initialHorizontalOffset = (Math.random() * 2 - 1) * 60;
          const initialVerticalOffset = (Math.random() * 2 - 1) * 10;
          anim.from.position.x = localPos.x + initialHorizontalOffset;
          anim.from.position.y = localPos.y + headOffset + initialVerticalOffset;
          anim.from.scale = isCrit ? this.critFontScale : this.baseFontScale;
          anim.from.color.set(displayColor);
          const endHorizontalOffset = initialHorizontalOffset + (Math.random() * 2 - 1) * 30;
          anim.to.position.x = localPos.x + endHorizontalOffset;
          anim.to.position.y = localPos.y + headOffset + this.popupDriftHeight + initialVerticalOffset;
          anim.to.scale = (isCrit ? this.critFontScale : this.baseFontScale) * this.popupEndScaleFactor;
          anim.to.color.set(displayColor);
          anim.to.color.a = 0;
          this.damagePopup.addAnim(anim);
          anim.release();
        } // 根据显示类型获取颜色


        getPopupTypeColor(popupType) {
          switch (popupType) {
            case PopupType.PhysicalDamage:
              return new Color(255, 255, 255, 255);
            // 白

            case PopupType.CritPhysicalDamage:
              return new Color(255, 100, 0, 255);
            // 橙红 (暴击物理)

            case PopupType.MagicDamage:
              return new Color(138, 43, 226, 255);
            // 紫 (魔法)

            case PopupType.CritMagicDamage:
              return new Color(255, 0, 255, 255);
            // 品红 (暴击魔法)

            case PopupType.TrueDamage:
              return new Color(218, 165, 32, 255);
            // 金黄 (真实)

            case PopupType.Heal:
              return new Color(0, 255, 0, 255);
            // 绿 (治疗)

            default:
              return Color.WHITE;
          }
        }

      }, _class3._instance = void 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "damagePopup", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=50fb82f8a960a5638bdd52803be5036d28a16573.js.map