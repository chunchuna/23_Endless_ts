import { Layer } from "../utils/Layer.js";
import { Player } from "./Player.js";
import { ObjectYsort } from "./Ysort.js";
import { GameMath } from "../utils/Math.js";
import { Grid } from "./Grid.js";
var SpwnTypeEnum;
(function (SpwnTypeEnum) {
    SpwnTypeEnum[SpwnTypeEnum["Mouse"] = 0] = "Mouse";
    SpwnTypeEnum[SpwnTypeEnum["NearPlayer"] = 1] = "NearPlayer";
    SpwnTypeEnum[SpwnTypeEnum["CustomPosition"] = 2] = "CustomPosition";
})(SpwnTypeEnum || (SpwnTypeEnum = {}));
export class Building {
    static SelectedCreatBuildingType; // What is the type of building selected by the current player?
    static Update(runtime) {
        Building.RoundInstances(runtime, runtime.objects.BuildingGroup.instances());
        Building.RoundInstances(runtime, runtime.objects.Grid.instances());
    }
    static async Init(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        Building.Event(runtime);
        Building.SelectedCreatBuildingType = runtime.objects.wall;
    }
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await runtime.objects.BuildingGroup.addEventListener("instancecreate", (e) => {
            this.OnBuildingCreated(e, runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[click-buildingmodebutton]", (e) => {
            this.OnClickedButton(e, runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[buildingmode-toggle-on]", () => {
            this.OnBuildModeOn(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[buildingmode-toggle-off]", () => {
            this.OnBuildModeOff(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[Grid_MouseClickGrid]", (e) => {
            this.OnClickGrid(runtime, e);
        });
    }
    static OnBuildingCreated(e, runtime) {
    }
    static OnClickedButton(e, runtime) {
        runtime.globalVars.ISBuildingMode = !runtime.globalVars.ISBuildingMode;
    }
    static OnBuildModeOn(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        console.log("building mode on");
        /** creat grid on player postion **/
        Grid.CreateGridArrayByPlayer(runtime, 5, 256);
        Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "BuildingLayer"), true);
        Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "Light"), false);
        runtime.objects.BuildingModeSpButton.getFirstPickedInstance()?.setAnimation("Enable");
        (EventHnadlerInstance?.addEventListener)("[doubleclick-buildinggroup]", (e) => {
            var getBuilding = e.buildings;
            console.log(getBuilding);
            if (getBuilding && runtime.globalVars.ISBuildingMode) {
                getBuilding.destroy();
            }
        });
    }
    static OnBuildModeOff(runtime) {
        console.log("building mode off");
        Grid.ClearAllGrid(runtime);
        Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "BuildingLayer"), false);
        ObjectYsort.YsortFixbug(runtime);
        Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "Light"), true);
        runtime.objects.BuildingModeSpButton.getFirstPickedInstance()?.setAnimation("Disable");
    }
    static OnClickGrid(runtime, e) {
        if (!runtime.globalVars.ISBuildingMode)
            return;
        var IsMouseOver = e.MouseOver;
        var GetGrid = e.ThisGrid[0];
        /** set building **/
        var InstanceClass = Building.SelectedCreatBuildingType;
        if (!GetGrid.instVars.IsCanPlace)
            return;
        var GetCretedBuilding = Building.PlaceBuildingInstance(runtime, InstanceClass, SpwnTypeEnum.CustomPosition);
        GetCretedBuilding.x = GetGrid.getImagePointX(0);
        GetCretedBuilding.y = GetGrid.getImagePointY(0);
    }
    static RoundInstances(runtime, Instancesclass) {
        /** set instance position to round **/
        for (var instance of Instancesclass) {
            var Postion = Building.SetPositionRound(runtime, instance.x, instance.y);
            instance.x = Postion[0];
            instance.y = Postion[1];
        }
    }
    static PlaceBuildingInstance(runtime, buildingStuffClass, SpwnType) {
        var objectClass = buildingStuffClass;
        var layer = runtime.getLayout("Game").getLayer("Object");
        var playerOffset = 500;
        if (!layer) {
            return;
        }
        var objectInstance;
        objectInstance = objectClass.createInstance(layer.name, -1000, -1000, true, "wallwithmask");
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
    static SetAllBuildingsToLayer(runtime, LayerName, Type) {
        var BuildingGroupClass;
        var Layer = runtime.getLayout("Game").getLayer(LayerName);
        BuildingGroupClass = runtime.objects.BuildingGroup;
        for (var bdgi of BuildingGroupClass.instances()) {
            if (bdgi && Layer) {
                bdgi.moveToLayer(Layer);
            }
        }
    }
    static SetPositionRound(runtime, x, y) {
        var BuidlingGirdSize = 256;
        var Mathx = Math.round(x / BuidlingGirdSize) * BuidlingGirdSize;
        var Mathy = Math.round(y / BuidlingGirdSize) * BuidlingGirdSize;
        var Position = [Mathx, Mathy];
        return Position;
    }
    static GetAllBuildings(runtime) {
        let allBuildings = [];
        for (let buildings of runtime.objects.BuildingGroup.instances()) {
            allBuildings.push(buildings);
        }
        return allBuildings;
    }
}
