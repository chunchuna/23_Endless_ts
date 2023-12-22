import { gameplay } from "./Game/gameplay/GamePlay_Game.js";

runOnStartup(async runtime => {
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
async function OnBeforeProjectStart(runtime: IRuntime) {
    RegisterEvent(runtime);
}
async function RegisterEvent(runtime: IRuntime) {
    const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstInstance();
    await (EventHnadlerInstance?.addEventListener as any)("event_gametick", () => {
        gameplay.tick(runtime);
    });
    await (EventHnadlerInstance?.addEventListener as any)("event_gamestart", () => {
        gameplay.start(runtime);
    });
}
