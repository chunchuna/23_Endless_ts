import {Building} from "./Building.js";
import {Grid} from "./Grid.js";
import {ConstructSystem} from "../utils/ConstructSystem.js";

export class Player extends ConstructSystem {


    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        Player.Event(runtime);

    }

    public static async Event(runtime: IRuntime): Promise<void> {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("[player-mouseleftclick]", (e: any) => {
            Player.OnMouseLeftClick(runtime);
        });

        await (EventHnadlerInstance?.addEventListener as any)("[player-moving]", (e: any) => {
            Player.OnPlayerMoving(runtime);
        });

        await (EventHnadlerInstance?.addEventListener as any)("[player-dirmove-arrive]", (e: any) => {
            Player.OnPlayerIsArriveMoverTarget(runtime);
        });
    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
        Player.InputUpdate(runtime);
    }


    /** Event **/

    private static OnMouseLeftClick(runtime: IRuntime) {

        var MouseInstance = runtime.mouse;
        if (runtime.globalVars.ISBuildingMode) return;
        // Player.PlayerPathFindMove(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1])
        Player.ClearDrawPlayerPathFindPoint(runtime);
        Player.PlayerDirMove(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1]);

    }

    private static OnPlayerMoving(runtime: IRuntime) {
        if (runtime.globalVars.ISBuildingMode)
            Grid.UpdateGridPositionByPlayer(runtime)

    }

    private static OnPlayerIsArriveMoverTarget(runtime: IRuntime) {
        this.ClearDrawPlayerPathFindPoint(runtime);

    }


    /** Function **/



    public static async InputUpdate(runtime: IRuntime) {
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


    public static async PlayerPathFindMove(runtime: IRuntime, PositionX: number, PositionY: number) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindBehavior: IPathfindingBehaviorInstance<InstanceType.player> | undefined = PlayerInstance?.behaviors.PathFind;
        //PathFindBehavior?.map.regenerateMap(); // Cause serious performance problems
        await PathFindBehavior?.findPath(PositionX, PositionY);

        PathFindBehavior?.startMoving();
        console.log("player - path find move")


    }

    public static DrawPlayerPathFindPoint(runtime: IRuntime) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindBehavior: IPathfindingBehaviorInstance<InstanceType.player> | undefined = PlayerInstance?.behaviors.PathFind;
        for (let i = 0; i < PathFindBehavior!.getNodeCount(); i++) {
            var PathFindPoint = runtime.objects.PathFindPoint.createInstance("Ground", PathFindBehavior!.getNodeXAt(i), PathFindBehavior!.getNodeYAt(i));

        }
    }

    public static ClearDrawPlayerPathFindPoint(runtime: IRuntime) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindBehavior: IPathfindingBehaviorInstance<InstanceType.player> | undefined = PlayerInstance?.behaviors.PathFind;
        for (var PathfindPoints of runtime.objects.PathFindPoint.instances()) {
            PathfindPoints.destroy();
        }

    }

    private static PlayerDirMove(runtime: IRuntime, PositionX: number, PositionY: number) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var DirMoveBehavior: IMoveToBehaviorInstance<InstanceType.player> | undefined = PlayerInstance?.behaviors.DirMove;
        DirMoveBehavior?.moveToPosition(PositionX, PositionY);
        Player.DrawPlayerDirMovePoint(runtime, PositionX, PositionY)
    }

    public static DrawPlayerDirMovePoint(runtime: IRuntime, PositionX: number, PositionY: number) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        this.ClearDrawPlayerPathFindPoint(runtime);
        var PathFindPoint = runtime.objects.PathFindPoint.createInstance("Ground", PositionX, PositionY);

    }


}