
import *as GameDebug from "./Game/gameplay/GamePlay_Game.js"
runOnStartup(async runtime => {
	// 在加载界面运行的代码。
	// 注意：布局、对象等尚不可用。
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

/**
 * 在项目开始之前运行的代码
 * @param {IRuntime} runtime - 游戏运行时对象
 */


async function OnBeforeProjectStart(runtime: IRuntime) {
	// 在第一个布局的 'On start of layout' 之前运行的代码。
	// 加载已完成，初始实例已创建并可在此处使用

	//引擎自带的基于全局的tick事件
	runtime.addEventListener("tick", () => Tick(runtime));
	//其他场景需要自己写各自的监听事件
	RegisterEvent(runtime);
}
function Tick(runtime: IRuntime) {
	//管理全局Tick,并不局限于某一个场景
}

/**
 * 注册事件监听器，处理游戏Game场景中的事件
 * @param {IRuntime} runtime - 游戏运行时对象
 */
async function RegisterEvent(runtime: IRuntime) {
	// 获取事件处理器实例
	const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstInstance();
	// 监听Game场景每一帧的事件
	await (EventHnadlerInstance?.addEventListener as any)("event_gametick", () => {
		GameDebug.Tick(runtime); // 调用游戏每一帧的处理函数
	});
	// 监听Game场景开始的事件
	await (EventHnadlerInstance?.addEventListener as any)("event_gamestart", () => {
		GameDebug.OnLayoutStrat(runtime); // 调用游戏开始时的处理函数
	});
}
