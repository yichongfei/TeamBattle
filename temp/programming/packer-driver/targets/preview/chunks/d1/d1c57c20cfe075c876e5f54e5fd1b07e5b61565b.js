System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _crd, RoleType, CharacterState, TargetType, SkillTargetType, AttackType;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "57253cV3jtJz7VC91Rbikhg", "Enums", undefined);

      /**
       * 角色定位类型
       */
      __checkObsolete__(['_decorator']);

      _export("RoleType", RoleType = /*#__PURE__*/function (RoleType) {
        RoleType[RoleType["MELEE_DPS"] = 0] = "MELEE_DPS";
        RoleType[RoleType["RANGED_DPS"] = 1] = "RANGED_DPS";
        RoleType[RoleType["TANK"] = 2] = "TANK";
        RoleType[RoleType["HEALER"] = 3] = "HEALER";
        return RoleType;
      }({}));
      /**
       * 角色状态 (可以根据需要细化)
       * 这个可以替代 CharacterControl.ts 里的旧枚举
       */


      _export("CharacterState", CharacterState = /*#__PURE__*/function (CharacterState) {
        CharacterState[CharacterState["IDLE"] = 0] = "IDLE";
        CharacterState[CharacterState["MOVING"] = 1] = "MOVING";
        CharacterState[CharacterState["ATTACKING"] = 2] = "ATTACKING";
        CharacterState[CharacterState["CASTING"] = 3] = "CASTING";
        CharacterState[CharacterState["STUNNED"] = 4] = "STUNNED";
        CharacterState[CharacterState["DEAD"] = 5] = "DEAD";
        return CharacterState;
      }({}));
      /**
       * 目标类型 (用于技能或索敌)
       */


      _export("TargetType", TargetType = /*#__PURE__*/function (TargetType) {
        TargetType[TargetType["ENEMY"] = 0] = "ENEMY";
        TargetType[TargetType["ALLY"] = 1] = "ALLY";
        TargetType[TargetType["SELF"] = 2] = "SELF";
        TargetType[TargetType["POINT"] = 3] = "POINT";
        TargetType[TargetType["AREA"] = 4] = "AREA";
        TargetType[TargetType["NONE"] = 5] = "NONE";
        return TargetType;
      }({}));
      /**
       * 技能目标类型 (更具体，用于技能定义)
       */


      _export("SkillTargetType", SkillTargetType = /*#__PURE__*/function (SkillTargetType) {
        SkillTargetType[SkillTargetType["SINGLE_ENEMY"] = 0] = "SINGLE_ENEMY";
        SkillTargetType[SkillTargetType["SINGLE_ALLY"] = 1] = "SINGLE_ALLY";
        SkillTargetType[SkillTargetType["SELF"] = 2] = "SELF";
        SkillTargetType[SkillTargetType["GROUND_POINT"] = 3] = "GROUND_POINT";
        SkillTargetType[SkillTargetType["CONE_ENEMY"] = 4] = "CONE_ENEMY";
        SkillTargetType[SkillTargetType["CIRCLE_ENEMY"] = 5] = "CIRCLE_ENEMY";
        SkillTargetType[SkillTargetType["CIRCLE_ALLY"] = 6] = "CIRCLE_ALLY";
        return SkillTargetType;
      }({}));
      /**
       * 攻击类型 (用于伤害计算或效果区分)
       */


      _export("AttackType", AttackType = /*#__PURE__*/function (AttackType) {
        AttackType[AttackType["PHYSICAL"] = 0] = "PHYSICAL";
        AttackType[AttackType["MAGICAL"] = 1] = "MAGICAL";
        AttackType[AttackType["TRUE"] = 2] = "TRUE";
        return AttackType;
      }({})); // 如果需要，可以在这里添加更多全局使用的枚举
      // 例如：阵营 (Faction), 资源类型 (ResourceType: Mana, Energy, Rage) 等 


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d1c57c20cfe075c876e5f54e5fd1b07e5b61565b.js.map