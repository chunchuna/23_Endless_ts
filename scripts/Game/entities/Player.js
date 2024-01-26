import { Building } from "./Building.js";
export class Player {
    static Update(runtime) {
        var Player3Dbox = runtime.objects.Player3Dbox.getFirstInstance();
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        Player3Dbox.x = PlayerInstance.x;
        Player3Dbox.y = PlayerInstance.y;
    }
    static async Init(runtime) {
        Player.InputInit(runtime);
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[player-moving]", (e) => {
            //Constantly reset the position of the grid as players move
            var PlayerPosition = [Player.GetPlayerInstance(runtime).x, Player.GetPlayerInstance(runtime).y];
            if (runtime.globalVars.ISBuildingMode)
                Building.UpdateGridPositionByPlayer(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[player-pathfind-findpos]", (e) => {
            // Send this event when pathfind finds a path for special operations, such as drawing path points, etc.
            Player.DrawPlayerPathFindPoint(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[player-pathfind-arrive]", (e) => {
            Player.ClearDrawPlayerPathFindPoint(runtime);
            if (runtime.globalVars.ISBuildingMode)
                Building.UpdateGridPositionByPlayer(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[player-dirmove-arrive]", (e) => {
            Player.ClearDrawPlayerPathFindPoint(runtime);
            if (runtime.globalVars.ISBuildingMode)
                Building.UpdateGridPositionByPlayer(runtime);
        });
    }
    static async InputUpdate(runtime) {
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
            if (keyboard?.isKeyDown(key))
                simulMover?.simulateControl(value);
        });
    }
    static async InputInit(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        var MouseInstance = runtime.mouse;
        await (EventHnadlerInstance?.addEventListener)("[player-mouseleftclick]", (e) => {
            if (runtime.globalVars.ISBuildingMode)
                return;
            // Player.PlayerPathFindMove(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1])
            Player.ClearDrawPlayerPathFindPoint(runtime);
            Player.PlayerDirMove(runtime, MouseInstance.getMousePosition("Object")[0], MouseInstance.getMousePosition("Object")[1]);
        });
    }
    static GetPlayerInstance(runtime) {
        return runtime.objects.player.getFirstInstance();
    }
    static async PlayerPathFindMove(runtime, PositionX, PositionY) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindBehavior = PlayerInstance?.behaviors.PathFind;
        //PathFindBehavior?.map.regenerateMap(); // Cause serious performance problems
        await PathFindBehavior?.findPath(PositionX, PositionY);
        PathFindBehavior?.startMoving();
        console.log("player - path find move");
    }
    static DrawPlayerPathFindPoint(runtime) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindBehavior = PlayerInstance?.behaviors.PathFind;
        for (let i = 0; i < PathFindBehavior.getNodeCount(); i++) {
            var PathFindPoint = runtime.objects.PathFindPoint.createInstance("Ground", PathFindBehavior.getNodeXAt(i), PathFindBehavior.getNodeYAt(i));
        }
    }
    static ClearDrawPlayerPathFindPoint(runtime) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindBehavior = PlayerInstance?.behaviors.PathFind;
        for (var PathfindPoints of runtime.objects.PathFindPoint.instances()) {
            PathfindPoints.destroy();
        }
    }
    static PlayerDirMove(runtime, PositionX, PositionY) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var DirMoveBehavior = PlayerInstance?.behaviors.DirMove;
        DirMoveBehavior?.moveToPosition(PositionX, PositionY);
        Player.DrawPlayerDirMovePoint(runtime, PositionX, PositionY);
    }
    static DrawPlayerDirMovePoint(runtime, PositionX, PositionY) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindPoint = runtime.objects.PathFindPoint.createInstance("Ground", PositionX, PositionY);
    }
}
