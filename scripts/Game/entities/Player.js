import { Building } from "./Building.js";
export class Player {
    static Update() {
    }
    static async Init(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[player-moving]", (e) => {
            var PlayerPosition = [Player.GetPlayerInstance(runtime).x, Player.GetPlayerInstance(runtime).y];
            if (runtime.globalVars.ISBuildingMode && runtime.objects.GridBoss.getFirstInstance())
                Building.UpdateGridPosition(runtime, PlayerPosition);
        });
    }
    static Input(runtime) {
        const { keyboard, objects: { player } } = runtime;
        const playerInstance = player.getFirstInstance();
        const simulMover = playerInstance?.behaviors["8DirMove"];
        const keyMap = {
            KeyA: "left",
            KeyD: "right",
            KeyW: "up",
            KeyS: "down"
        };
        Object.entries(keyMap).forEach(([key, value]) => {
            if (keyboard?.isKeyDown(key))
                simulMover?.simulateControl(value);
        });
    }
    static GetPlayerInstance(runtime) {
        return runtime.objects.player.getFirstInstance();
    }
}
