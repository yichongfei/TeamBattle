import { EventTarget } from 'cc';

/**
 * 全局事件管理器单例
 * 用于解耦系统间的通信。
 */
export const GlobalEvent = new EventTarget();

/*
// 使用示例:

// 在 A 组件中发送事件
// GlobalEvent.emit('some-event-name', arg1, arg2, ...);

// 在 B 组件中监听事件 (通常在 onLoad 或 onEnable)
// GlobalEvent.on('some-event-name', this.onSomeEvent, this);

// 在 B 组件中处理事件的方法
// private onSomeEvent(arg1, arg2, ...) {
//     console.log('事件接收:', arg1, arg2);
// }

// 在 B 组件销毁或禁用时取消监听 (通常在 onDestroy 或 onDisable)
// GlobalEvent.off('some-event-name', this.onSomeEvent, this);
*/
