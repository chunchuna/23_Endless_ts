import { Building } from "./Building.js";
import { Grid } from "./Grid.js";
import { ConstructSystem } from "../utils/ConstructSystem.js";
import { EventSystem } from "../utils/EventSystem.js";
import { Input, KeyCode } from "../utils/Input.js";
import { DebugMessage, MesType } from "./DebugMessage.js";
var InputKey;
(function (InputKey) {
    InputKey[InputKey["ForwardKey"] = 87] = "ForwardKey";
    InputKey[InputKey["BackKey"] = 83] = "BackKey";
    InputKey[InputKey["MoveLeftKey"] = 65] = "MoveLeftKey";
    InputKey[InputKey["MoveRightKey"] = 68] = "MoveRightKey";
})(InputKey || (InputKey = {}));
var MoveType;
(function (MoveType) {
    MoveType["Forward"] = "Forward";
    MoveType["Back"] = "Back";
    MoveType["MoveLeft"] = "MoveLeft";
    MoveType["MoveRight"] = "MoveRight";
})(MoveType || (MoveType = {}));
export class Player extends ConstructSystem {
    static get PLayerInstanceClass() {
        return this._PLayerInstanceClass;
    }
    static set PLayerInstanceClass(value) {
        this._PLayerInstanceClass = value;
    }
    static _PLayerInstanceClass = null;
    async Init(runtime) {
        super.Init(runtime);
        Player.Event(runtime);
        Player.SetInstanceClass(runtime);
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
        //await runtime.addEventListener("keydown", (e) => {
        //})
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
        Player.MoveCharacterByMoveTo(runtime, MouseInstance.getMousePosition("Object")[0], MouseInstance.getMousePosition("Object")[1]);
    }
    static OnPlayerMoving(runtime) {
        if (runtime.globalVars.ISBuildingMode)
            Grid.UpdateGridPositionByPlayer(runtime, Building.BuildMaxGridCount);
    }
    static OnPlayerIsArriveMoverTarget(runtime) {
        this.ClearDrawPlayerPathFindPoint(runtime);
    }
    static OnInput(runtime, e) {
        /** move **/
        if (e === InputKey.ForwardKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.Forward);
        }
        if (e === InputKey.BackKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.Back);
        }
        if (e === InputKey.MoveLeftKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.MoveLeft);
        }
        if (e === InputKey.MoveRightKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.MoveRight);
        }
    }
    /** Function **/
    static SetInstanceClass(runtime) {
        this.PLayerInstanceClass = runtime.objects.player;
    }
    static MoveCharaterBySimulation(runtime, MoveType_) {
        var player = Player.GetPlayerInstance(runtime);
        var MoveSimulation = player.behaviors.SimulationMove;
        if (MoveType_ == MoveType.Forward) {
            MoveSimulation.simulateControl("up");
        }
        if (MoveType_ == MoveType.Back) {
            MoveSimulation.simulateControl("down");
        }
        if (MoveType_ == MoveType.MoveLeft) {
            MoveSimulation.simulateControl("left");
        }
        if (MoveType_ == MoveType.MoveRight) {
            MoveSimulation.simulateControl("right");
        }
    }
    /** out-of-date **/
    static async InputUpdate_outofdate(runtime) {
        const { keyboard, objects: { player } } = runtime;
        const playerInstance = player.getFirstInstance();
        const simulMover = playerInstance?.behaviors.SimulationMove;
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
    static async InputUpdate(runtime) {
        var keyboard = runtime.keyboard;
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var SimulMoverBehavior = PlayerInstance?.behaviors.SimulationMove;
        if (!keyboard || !PlayerInstance || !SimulMoverBehavior) {
            return;
        }
        var AllKeys = Object.values(KeyCode);
        AllKeys.forEach((keyCode) => {
            if (keyboard.isKeyDown(keyCode)) {
                this.OnInput(runtime, keyCode);
            }
        });
    }
    static GetPlayerInstance(runtime) {
        return this.PLayerInstanceClass.getFirstInstance();
    }
    static async MoveCharacterByPathFind(runtime, PositionX, PositionY) {
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
    static MoveCharacterByMoveTo(runtime, PositionX, PositionY) {
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
