import {Building} from "./Building.js";

export class Player {

    public static Update() {
    }

    public static async Init(runtime: IRuntime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("[player-moving]", (e: any) => {
            var PlayerPosition = [Player.GetPlayerInstance(runtime)!.x, Player.GetPlayerInstance(runtime)!.y] as [number, number];
            Building.UpdateGridPosition(runtime, PlayerPosition)
        });

    }

    public static Input(runtime: IRuntime) {

        const {keyboard, objects: {player}} = runtime;
        const playerInstance = player.getFirstInstance();
        const simulMover = playerInstance?.behaviors["8DirMove"];
        const keyMap = {
            KeyA: "left",
            KeyD: "right",
            KeyW: "up",
            KeyS: "down"
        };
        Object.entries(keyMap).forEach(([key, value]) => {
            if (keyboard?.isKeyDown(key)) simulMover?.simulateControl(value as SimulateControlType8Direction);
        });

    }

    public static GetPlayerInstance(runtime: IRuntime) {
        return runtime.objects.player.getFirstInstance();

    }

}