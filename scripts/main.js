import { gameplay } from "./Game/gameplay/GamePlay_Game.js";
runOnStartup(async (runtime) => {
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
async function OnBeforeProjectStart(runtime) {
    RegisterEvent(runtime);
}
async function RegisterEvent(runtime) {
    const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstInstance();
    await (EventHnadlerInstance?.addEventListener)("event_gametick", () => {
        gameplay.tick(runtime);
    });
    await (EventHnadlerInstance?.addEventListener)("event_gamestart", () => {
        gameplay.start(runtime);
    });
}
