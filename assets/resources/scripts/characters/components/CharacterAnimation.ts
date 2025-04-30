import { _decorator, Component, sp } from 'cc';

const { ccclass, property, requireComponent } = _decorator;

/**
 * 监听动画相关事件 (如 'play-animation') 并控制 Spine (或其他) 动画组件。
 * 需要挂载在与 AIComponent 等相同的节点上。
 */
@ccclass('CharacterAnimation')
@requireComponent(sp.Skeleton) // 强制要求节点上有 Spine 组件
export class CharacterAnimation extends Component {

    private spine: sp.Skeleton = null;
    private currentAnimation: string = '';

    onLoad() {
        this.spine = this.getComponent(sp.Skeleton);
        if (!this.spine) {
            console.warn(`CharacterAnimation on [${this.node.name}] requires a sp.Skeleton component.`);
            this.enabled = false;
        }
    }

    start() {
        if (!this.enabled) return;
        // 监听来自其他组件的动画播放请求事件
        this.node.on('play-animation', this.onPlayAnimation, this);
        // 可以监听更具体的事件，如 'state-changed', 'attack-performed' 等

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
    private onPlayAnimation(animName: string, loop: boolean) {
        this.playAnimation(animName, loop);
    }

    /**
     * 播放指定的 Spine 动画。
     * @param animName 动画名称
     * @param loop 是否循环
     */
    public playAnimation(animName: string, loop: boolean) {
        if (!this.spine || !this.enabled) {
            return;
        }

        // 检查动画是否存在 (可选但推荐)
        const animation = this.spine.findAnimation(animName);
        if (!animation) {
            console.warn(`[${this.node.name}] Animation [${animName}] not found on sp.Skeleton.`);
            // 尝试播放默认动画，如 idle
            if (animName !== 'idle') { // 防止找不到 idle 时无限递归
                this.playAnimation('idle', true);
            }
            return;
        }

        // 避免不必要的重复设置相同动画 (特别是循环动画)
        if (this.currentAnimation === animName && loop) {
            return;
        }

        try {
            this.spine.setAnimation(0, animName, loop);
            this.currentAnimation = animName;

            // 如果是非循环动画，播放完毕后自动切回 idle (或之前的循环动画)
            if (!loop) {
                this.spine.setCompleteListener((trackEntry) => {
                    if (trackEntry.animation.name === animName) {
                        this.playAnimation('idle', true);
                        this.spine.setCompleteListener(null); // 清除监听器，避免重复触发
                    }
                });
            } else {
                 this.spine.setCompleteListener(null); // 清除循环动画的监听器
            }

        } catch (error) {
            console.warn(`[${this.node.name}] Error playing animation [${animName}]: ${error}`);
            // 出错时也尝试播放 idle
            if (animName !== 'idle') {
                 this.playAnimation('idle', true);
            }
        }
    }
} 