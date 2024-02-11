import { Building } from "./Building.js";
import { Grid } from "./Grid.js";
import { ConstructSystem } from "../utils/ConstructSystem.js";
export class Player extends ConstructSystem {
    async Init(runtime) {
        super.Init(runtime);
        Player.Event(runtime);
    }
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[player-mouseleftclick]", (e) => {
            Player.OnMouseLeftClick(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[player-moving]", (e) => {
            Player.OnPlayerMoving(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[player-dirmove-arrive]", (e) => {
            Player.OnPlayerIsArriveMoverTarget(runtime);
        });
    }
    Update(runtime) {
        super.Update(runtime);
        Player.InputUpdate(runtime);
    }
    /** Event **/
    static OnMouseLeftClick(runtime) {
        var MouseInstance = runtime.mouse;
        if (runtime.globalVars.ISBuildingMode)
            return;
        // Player.PlayerPathFindMove(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1])
        Player.ClearDrawPlayerPathFindPoint(runtime);
        Player.PlayerDirMove(runtime, MouseInstance.getMousePosition("Object")[0], MouseInstance.getMousePosition("Object")[1]);
    }
    static OnPlayerMoving(runtime) {
        if (runtime.globalVars.ISBuildingMode)
            Grid.UpdateGridPositionByPlayer(runtime);
    }
    static OnPlayerIsArriveMoverTarget(runtime) {
        this.ClearDrawPlayerPathFindPoint(runtime);
    }
    /** Function **/
    static async InputUpdate(runtime) {
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
        this.ClearDrawPlayerPathFindPoint(runtime);
        var PathFindPoint = runtime.objects.PathFindPoint.createInstance("Ground", PositionX, PositionY);
    }
}
