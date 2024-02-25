import {Building} from "./Building.js";
import {Grid} from "./Grid.js";
import {ConstructSystem} from "../utils/ConstructSystem.js";
import {EventSystem} from "../utils/EventSystem.js";
import {Input, KeyCode} from "../utils/Input.js";
import {DebugMessage, MesType} from "./DebugMessage.js";


enum InputKey {
    ForwardKey = 87,
    BackKey = 83,
    MoveLeftKey = 65,
    MoveRightKey = 68,
}

enum MoveType {
    Forward = "Forward",
    Back = "Back",
    MoveLeft = "MoveLeft",
    MoveRight = "MoveRight",
}


export class Player extends ConstructSystem {
    static get PlayerInstance(): InstanceType.player {
        return this._PlayerInstance;
    }

    static set PlayerInstance(value: InstanceType.player) {
        this._PlayerInstance = value;
    }

    static get PLayerInstanceClass(): any {
        return this._PLayerInstanceClass;
    }

    static set PLayerInstanceClass(value: any) {
        this._PLayerInstanceClass = value;
    }


    private static _PLayerInstanceClass = null;
    private static _PlayerInstance: InstanceType.player;

    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        Player.Event(runtime);
        Player.SetInstanceClass(runtime);
        Player.SetInstance(runtime);


    }


    public static async Event(runtime: IRuntime): Promise<void> {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("Player->MouseClickAnyPostion", (e: any) => {
            Player.OnMouseLeftClick(runtime);
        });

        await (EventHnadlerInstance?.addEventListener as any)("Player->OnSimulationMoving", (e: any) => {
            Player.OnPlayerMoving(runtime);
        });

        await (EventHnadlerInstance?.addEventListener as any)("Player->OnDirMoveArrive", (e: any) => {
            Player.OnPlayerIsArriveMoverTarget(runtime);
        });

        //await runtime.addEventListener("keydown", (e) => {
        //})
        await EventSystem.TouchEvent(runtime, "Player->OnPlayerMoveingStop", (e: any) => {
            this.OnPlayerMoveingStopOnece(runtime, e)
        })

        await EventSystem.TouchEvent(runtime, "[buildingmode-toggle-on]", (e: any) => {
            this.OnBuildingModeIsOn(runtime, e)
        })


    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
        Player.InputUpdate(runtime)

    }


    /** Event **/


    private static OnBuildingModeIsOn(runtime: IRuntime, e: any) {
        var DirMoveBehavior = this.PlayerInstance.behaviors.DirMove;
        if (DirMoveBehavior.isMoving) {
            DirMoveBehavior.stop();
            this.ClearDrawPlayerPathFindPoint(runtime);
        }


    }

    private static OnPlayerMoveingStopOnece(runtime: IRuntime, e: any) {
        if (runtime.globalVars.ISBuildingMode)
            Grid.UpdateGridPositionByPlayer(runtime, Building.BuildMaxGridCount)

    }


    private static OnMouseLeftClick(runtime: IRuntime) {

        var MouseInstance = runtime.mouse;
        if (runtime.globalVars.ISBuildingMode) return;
        // Player.PlayerPathFindMove(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1])
        Player.ClearDrawPlayerPathFindPoint(runtime);
        Player.MoveCharacterByMoveTo(runtime, MouseInstance!.getMousePosition("Object")[0], MouseInstance!.getMousePosition("Object")[1]);

    }

    private static OnPlayerMoving(runtime: IRuntime) {
    }

    private static OnPlayerIsArriveMoverTarget(runtime: IRuntime) {
        this.ClearDrawPlayerPathFindPoint(runtime);


    }

    private static OnInput(runtime: IRuntime, e: any) {

        /** move **/
        if (e === InputKey.ForwardKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.Forward)
        }
        if (e === InputKey.BackKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.Back)
        }
        if (e === InputKey.MoveLeftKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.MoveLeft)
        }
        if (e === InputKey.MoveRightKey) {
            Player.MoveCharaterBySimulation(runtime, MoveType.MoveRight)
        }


    }


    /** Function **/


    private static SetInstance(runtime: IRuntime) {
        this.PlayerInstance = this.PLayerInstanceClass.getFirstInstance();
        return true;

    }

    private static SetInstanceClass(runtime: IRuntime) {
        this.PLayerInstanceClass = runtime.objects.player;
    }

    private static MoveCharaterBySimulation(runtime: IRuntime, MoveType_: string) {
        var player = Player.GetPlayerInstance(runtime)!;
        var MoveSimulation = player.behaviors.SimulationMove!;


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
    public static async InputUpdate_outofdate(runtime: IRuntime) {
        const {keyboard, objects: {player}} = runtime;
        const playerInstance = player.getFirstInstance();
        const simulMover = playerInstance?.behaviors.SimulationMove;
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

    public static async InputUpdate(runtime: IRuntime) {

        var keyboard = runtime.keyboard!;
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var SimulMoverBehavior = PlayerInstance?.behaviors.SimulationMove;

        if (!keyboard || !PlayerInstance || !SimulMoverBehavior) {
            return;
        }

        var AllKeys = Object.values(KeyCode);

        AllKeys.forEach((keyCode) => {
            if (keyboard.isKeyDown(keyCode)) {
                this.OnInput(runtime, keyCode)
            }
        });
    }


    public static GetPlayerInstance(runtime: IRuntime) {
        return this.PLayerInstanceClass.getFirstInstance();

    }


    public static async MoveCharacterByPathFind(runtime: IRuntime, PositionX: number, PositionY: number) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var PathFindBehavior: IPathfindingBehaviorInstance<InstanceType.player> | undefined = PlayerInstance?.behaviors.PathFind;
        //PathFindBehavior?.map.regenerateMap(); // Cause serious performance problems
        await PathFindBehavior?.findPath(PositionX, PositionY);

        PathFindBehavior?.startMoving();
        console.log("player - path find move")
        DebugMessage.sm("Player->is path finding move")


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

    private static MoveCharacterByMoveTo(runtime: IRuntime, PositionX: number, PositionY: number) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        var DirMoveBehavior: IMoveToBehaviorInstance<InstanceType.player> | undefined = PlayerInstance?.behaviors.DirMove;
        DirMoveBehavior?.moveToPosition(PositionX, PositionY);
        Player.DrawPlayerDirMovePoint(runtime, PositionX, PositionY)
        DebugMessage.sm("Player->is Dir move")
    }

    public static DrawPlayerDirMovePoint(runtime: IRuntime, PositionX: number, PositionY: number) {
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        this.ClearDrawPlayerPathFindPoint(runtime);
        var PathFindPoint = runtime.objects.PathFindPoint.createInstance("Ground", PositionX, PositionY);

    }


}