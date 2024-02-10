import { Building } from "./Building.js";
import {Grid} from "./Grid.js";

export class Player {

    public static Update(runtime: IRuntime) {

    }

    public static async Init(runtime: IRuntime) {
        Player.InputInit(runtime)

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("[player-moving]", (e: any) => {
            //Constantly reset the position of the grid as players move
            var PlayerPosition = [Player.GetPlayerInstance(runtime)!.x, Player.GetPlayerInstance(runtime)!.y] as [number, number];
            if (runtime.globalVars.ISBuildingMode)
                Grid.UpdateGridPositionByPlayer(runtime)
        });

        await (EventHnadlerInstance?.addEventListener as any)("[player-pathfind-findpos]", (e: any) => {
            // Send this event when pathfind finds a path for special operations, such as drawing path points, etc.
            Player.DrawPlayerPathFindPoint(runtime);


        });

        await (EventHnadlerInstance?.addEventListener as any)("[player-pathfind-arrive]", (e: any) => {

            Player.ClearDrawPlayerPathFindPoint(runtime);
            if (runtime.globalVars.ISBuildingMode)
                Grid.UpdateGridPositionByPlayer(runtime)

        });

        await (EventHnadlerInstance?.addEventListener as any)("[player-dirmove-arrive]", (e: any) => {
            Player.ClearDrawPlayerPathFindPoint(runtime);
            if (runtime.globalVars.ISBuildingMode)
                Grid.UpdateGridPositionByPlayer(runtime)


        });

    }

    public static async InputUpdate(runtime: IRuntime) {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

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

    public static async InputInit(runtime: IRuntime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        var MouseInstance = runtime.mouse;

        await (EventHnadlerInstance?.addEventListener as any)("[player-mouseleftclick]", (e: any) => {
            if (runtime.globalVars.ISBuildingMode) return;
            // Player.PlayerPathFindMove(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1])
            Player.ClearDrawPlayerPathFindPoint(runtime);
            Player.PlayerDirMove(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1]);


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
        var PathFindPoint = runtime.objects.PathFindPoint.createInstance("Ground", PositionX, PositionY);

    }


}