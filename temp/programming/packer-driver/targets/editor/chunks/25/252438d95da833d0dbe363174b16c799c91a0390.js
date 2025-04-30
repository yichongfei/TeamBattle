System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _crd;

  function _reportPossibleCrUseOfAttackType(extras) {
    _reporterNs.report("AttackType", "./Enums", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "41b11TF1RZCga1P5WgTxYPn", "Interfaces", undefined);

      __checkObsolete__(['Node', 'Vec3']);
      /**
       * 代表可以受到伤害的实体
       */

      /**
       * 代表可以被治疗的实体
       */

      /**
       * 代表可以移动的实体
       */

      /**
       * 代表可以成为攻击/技能目标的实体
       */


      // 这里可以根据需要添加更多接口，例如 IBuffable, IInterruptable 等 
      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=252438d95da833d0dbe363174b16c799c91a0390.js.map