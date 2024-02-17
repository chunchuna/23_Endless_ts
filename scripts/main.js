import { game } from "./Game/gameplay/game.js";
import { EventSystem } from "./Game/utils/EventSystem.js";
runOnStartup(async (runtime) => {
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
async function OnBeforeProjectStart(runtime) {
    BindRoom(runtime);
}
async function BindRoom(runtime) {
    //const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstInstance();
    /** Game Room **/
    await EventSystem.TouchEvent(runtime, "Game->Tick", (e) => {
        game.Update(runtime);
    });
    await EventSystem.TouchEvent(runtime, "Game->Init", (e) => {
        game.Init(runtime);
    });
}
