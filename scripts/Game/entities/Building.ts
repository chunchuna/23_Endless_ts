import {LayerManager} from "../utils/Layer.js";
import {ObjectYsort} from "./Ysort.js";
import {Grid} from "./Grid.js";
import {ConstructSystem} from "../utils/ConstructSystem.js";
import {DebugMessage, MesType} from "./DebugMessage.js";

enum SpwnTypeEnum { //The type of building, in what way is the building generated?
    Mouse, //Near the mouse
    NearPlayer,//Near the player
    CustomPosition, //Instead of setting the location where the building is generated, return [ building itself]
}


export class Building extends ConstructSystem {

    static get SelectedCreatBuildingType(): IObjectType<InstanceType.BuildingGroup> {
        return this._SelectedCreatBuildingType;
    }

    static set SelectedCreatBuildingType(value: IObjectType<InstanceType.BuildingGroup>) {
        this._SelectedCreatBuildingType = value;
    }

    static get BuildMaxGridCount(): number {
        return this._BuildMaxGridCount;
    }

    static set BuildMaxGridCount(value: number) {
        this._BuildMaxGridCount = value;
    }

    /** var **/
    private static _SelectedCreatBuildingType: IObjectType<InstanceType.BuildingGroup>; // What is the type of building selected by the current player?
    /** Build mod max grid count **/
    private static _BuildMaxGridCount = 15;



    public Update(runtime: IRuntime) {
        Building.RoundInstances(runtime, runtime.objects.BuildingGroup.instances());
        Building.RoundInstances(runtime, runtime.objects.Grid.instances());

    }

    public async Init(runtime: IRuntime) {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        Building.Event(runtime)
        Building._SelectedCreatBuildingType = runtime.objects.wall;

    }

    private static async Event(runtime: IRuntime) {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await runtime.objects.BuildingGroup.addEventListener("instancecreate", (e) => {
            this.OnBuildingCreated(e, runtime);
        });

        await (EventHnadlerInstance?.addEventListener as any)("[click-buildingmodebutton]", (e: any) => {
            this.OnClickedButton(e, runtime);
        })

        await (EventHnadlerInstance?.addEventListener as any)("[buildingmode-toggle-on]", () => {
            this.OnBuildModeOn(runtime);
        })

        await (EventHnadlerInstance?.addEventListener as any)("[buildingmode-toggle-off]", () => {
            this.OnBuildModeOff(runtime);
        })

        await (EventHnadlerInstance?.addEventListener as any)("[Grid_MouseClickGrid]", (e: any) => {
            this.OnClickGrid(runtime, e);
        })

    }

    private static OnBuildingCreated(e: ObjectClassInstanceCreateEvent<InstanceType.BuildingGroup>, runtime: IRuntime) {
    }

    private static OnClickedButton(e: any, runtime: IRuntime) {
        runtime.globalVars.ISBuildingMode = !runtime.globalVars.ISBuildingMode;
    }

    private static OnBuildModeOn(runtime: IRuntime) {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        console.log("building mode on")
        /** creat grid on player postion **/
        Grid.CreateGridArrayByPlayer(runtime, Building.BuildMaxGridCount, 256)
        LayerManager.SetLayerVisibel(runtime, LayerManager.GetLayer(runtime, "BuildingLayer"), true);
        LayerManager.SetLayerVisibel(runtime, LayerManager.GetLayer(runtime, "Light"), false);
        runtime.objects.BuildingModeSpButton.getFirstPickedInstance()?.setAnimation("Enable");


        (EventHnadlerInstance?.addEventListener as any)("[doubleclick-buildinggroup]", (e: any) => {
            var getBuilding: InstanceType.BuildingGroup = e.buildings;
            console.log(getBuilding)
            if (getBuilding && runtime.globalVars.ISBuildingMode) {
                getBuilding.destroy();
            }
        })

        DebugMessage.sm("Building ON", MesType.Warm)


    }

    private static OnBuildModeOff(runtime: IRuntime) {

        console.log("building mode off")
        Grid.ClearAllGrid(runtime)
        LayerManager.SetLayerVisibel(runtime, LayerManager.GetLayer(runtime, "BuildingLayer"), false);
        ObjectYsort.YsortFixbug(runtime);
        LayerManager.SetLayerVisibel(runtime, LayerManager.GetLayer(runtime, "Light"), true);
        runtime.objects.BuildingModeSpButton.getFirstPickedInstance()?.setAnimation("Disable");

        DebugMessage.sm("Building Off", MesType.Warm)
    }

    private static OnClickGrid(runtime: IRuntime, e: any) {
        if (!runtime.globalVars.ISBuildingMode) return;

        var IsMouseOver: boolean = e.MouseOver;
        var GetGrid: InstanceType.Grid = e.ThisGrid[0];
        /** set building **/
        var InstanceClass = Building._SelectedCreatBuildingType;

        if (!GetGrid.instVars.IsCanPlace) return;

        var GetCretedBuilding = Building.PlaceBuildingInstance(runtime, InstanceClass, SpwnTypeEnum.CustomPosition);
        GetCretedBuilding!.x = GetGrid.getImagePointX(0);
        GetCretedBuilding!.y = GetGrid.getImagePointY(0);


    }

    private static RoundInstances(runtime: IRuntime, Instancesclass: IObjectClass<any> | any) {
        /** set instance position to round **/
        for (var instance of Instancesclass) {
            var Postion = Building.SetPositionRound(runtime, instance.x, instance.y);
            instance.x = Postion[0];
            instance.y = Postion[1];
        }

    }


    private static PlaceBuildingInstance(runtime: IRuntime, buildingStuffClass: IObjectType<InstanceType.BuildingGroup>, SpwnType: SpwnTypeEnum) {
        var objectClass = buildingStuffClass;
        var layer = runtime.getLayout("Game").getLayer("Object");
        var playerOffset = 500;
        if (!layer) {
            return
        }
        var objectInstance: InstanceType.BuildingGroup;
        objectInstance = objectClass.createInstance(layer.name, -1000, -1000, true, "wallwithmask")


        if (SpwnType == SpwnTypeEnum.NearPlayer) {
            var PlayerInstance = runtime.objects.player.getFirstInstance();
            if (PlayerInstance) {
                objectInstance.x = PlayerInstance.x + playerOffset;
                objectInstance.y = PlayerInstance.y + playerOffset;
            }

        }
        if (SpwnType == SpwnTypeEnum.Mouse) {
            var mouseX = runtime.mouse?.getMouseX(layer?.name) ?? 0;
            var mouseY = runtime.mouse?.getMouseY(layer?.name) ?? 0;
            objectInstance.x = mouseX;
            objectInstance.y = mouseY;
        }
        if (SpwnType == SpwnTypeEnum.CustomPosition) {
            return objectInstance;
        }


    }

    private static SetAllBuildingsToLayer(runtime: IRuntime, LayerName: LayerParameter, Type: String) {
        var BuildingGroupClass: IObjectClass<InstanceType.BuildingGroup>;
        var Layer: IAnyProjectLayer | null = runtime.getLayout("Game").getLayer(LayerName);
        BuildingGroupClass = runtime.objects.BuildingGroup;
        for (var bdgi of BuildingGroupClass.instances()) {
            if (bdgi && Layer) {
                bdgi.moveToLayer(Layer);
            }
        }
    }

    private static SetPositionRound(runtime: IRuntime, x: number, y: number): [number, number] {
        var BuidlingGirdSize = 256;
        var Mathx = Math.round(x / BuidlingGirdSize) * BuidlingGirdSize;
        var Mathy = Math.round(y / BuidlingGirdSize) * BuidlingGirdSize;

        var Position: [number, number] = [Mathx, Mathy];
        return Position;

    }

    private static GetAllBuildings(runtime: IRuntime) {
        let allBuildings: InstanceType.BuildingGroup[] = [];
        for (let buildings of runtime.objects.BuildingGroup.instances()) {
            allBuildings.push(buildings);
        }
        return allBuildings;
    }


}