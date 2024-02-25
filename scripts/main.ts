import {game} from "./Game/gameplay/game.js";
import {EventSystem} from "./Game/utils/EventSystem.js";

export var gl_runtime: IRuntime;

runOnStartup(async runtime => {
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime: IRuntime) {
    gl_runtime = runtime;
    BindRoom(runtime);
}

async function BindRoom(runtime: IRuntime) {
    //const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstInstance();

    /** Game Room **/

    await EventSystem.TouchEvent(runtime, "Game->Tick", (e: any) => {
        game.Update(runtime);
    })

    await EventSystem.TouchEvent(runtime, "Game->Init", (e: any) => {
        game.Init(runtime);
    })


}
