System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sp, _dec, _dec2, _class, _crd, ccclass, property, requireComponent, CharacterAnimation;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      sp = _cc.sp;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9261acd5xtAyrVMhzK6GdCc", "CharacterAnimation", undefined);

      __checkObsolete__(['_decorator', 'Component', 'sp']);

      ({
        ccclass,
        property,
        requireComponent
      } = _decorator);
      /**
       * 监听动画相关事件 (如 'play-animation') 并控制 Spine (或其他) 动画组件。
       * 需要挂载在与 AIComponent 等相同的节点上。
       */

      _export("CharacterAnimation", CharacterAnimation = (_dec = ccclass('CharacterAnimation'), _dec2 = requireComponent(sp.Skeleton), _dec(_class = _dec2(_class = class CharacterAnimation extends Component {
        constructor(...args) {
          super(...args);
          this.spine = null;
          this.currentAnimation = '';
        }

        onLoad() {
          this.spine = this.getComponent(sp.Skeleton);

          if (!this.spine) {
            console.warn(`CharacterAnimation on [${this.node.name}] requires a sp.Skeleton component.`);
            this.enabled = false;
          }
        }

        start() {
          if (!this.enabled) return; // 监听来自其他组件的动画播放请求事件

          this.node.on('play-animation', this.onPlayAnimation, this); // 可以监听更具体的事件，如 'state-changed', 'attack-performed' 等
          // 初始播放待机动画

          this.playAnimation('idle', true);
        }

        onDestroy() {
          // 移除事件监听
          this.node.off('play-animation', this.onPlayAnimation, this);
        }
        /**
         * 处理 'play-animation' 事件。
         * @param animName 要播放的动画名称
         * @param loop 是否循环
         */


        onPlayAnimation(animName, loop) {
          this.playAnimation(animName, loop);
        }
        /**
         * 播放指定的 Spine 动画。
         * @param animName 动画名称
         * @param loop 是否循环
         */


        playAnimation(animName, loop) {
          if (!this.spine || !this.enabled) {
            return;
          } // 检查动画是否存在 (可选但推荐)


          const animation = this.spine.findAnimation(animName);

          if (!animation) {
            console.warn(`[${this.node.name}] Animation [${animName}] not found on sp.Skeleton.`); // 尝试播放默认动画，如 idle

            if (animName !== 'idle') {
              // 防止找不到 idle 时无限递归
              this.playAnimation('idle', true);
            }

            return;
          } // 避免不必要的重复设置相同动画 (特别是循环动画)


          if (this.currentAnimation === animName && loop) {
            return;
          }

          try {
            this.spine.setAnimation(0, animName, loop);
            this.currentAnimation = animName; // 如果是非循环动画，播放完毕后自动切回 idle (或之前的循环动画)

            if (!loop) {
              this.spine.setCompleteListener(trackEntry => {
                if (trackEntry.animation.name === animName) {
                  this.playAnimation('idle', true);
                  this.spine.setCompleteListener(null); // 清除监听器，避免重复触发
                }
              });
            } else {
              this.spine.setCompleteListener(null); // 清除循环动画的监听器
            }
          } catch (error) {
            console.warn(`[${this.node.name}] Error playing animation [${animName}]: ${error}`); // 出错时也尝试播放 idle

            if (animName !== 'idle') {
              this.playAnimation('idle', true);
            }
          }
        }

      }) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1cbb0864940f3d76fb74963e8065d156f839db30.js.map