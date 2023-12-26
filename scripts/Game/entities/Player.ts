export class Player {

    public static Update() {
    }

    public static Init() {



    }


    public static GetPlayerInstance(runtime: IRuntime) {
        return runtime.objects.player.getFirstInstance();

    }
    public static PlayerMoveByWASD(runtime: IRuntime) {
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
            if (keyboard?.isKeyDown(key)) simulMover?.simulateControl(value as SimulateControlType8Direction);
        });
    }
}