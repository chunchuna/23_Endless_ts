import { ObjectYsort } from "./Ysort.js";
var SpwnTypeEnum;
(function (SpwnTypeEnum) {
    SpwnTypeEnum[SpwnTypeEnum["Mouse"] = 0] = "Mouse";
    SpwnTypeEnum[SpwnTypeEnum["NearPlayer"] = 1] = "NearPlayer";
})(SpwnTypeEnum || (SpwnTypeEnum = {}));
export class Building {
    static async AddObjectDebug(runtime) {
        const Wall1Class = runtime.objects.wall;
        const Wall2Class = runtime.objects.wall2;
        const PlayerInstance = runtime.objects.player.getFirstPickedInstance();
        const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("build_creat_wall", (e) => {
            if (e.walltype == "wall1") {
                Building.SpwnBuildingStuff(runtime, Wall1Class, SpwnTypeEnum.NearPlayer);
            }
            if (e.walltype == "wall2") {
                Building.SpwnBuildingStuff(runtime, Wall2Class, SpwnTypeEnum.NearPlayer);
            }
        });
    }
    static SpwnBuildingStuff(runtime, buildingStuffClass, SpwnType) {
        var objectClass = buildingStuffClass;
        var layer = runtime.getLayout("Game").getLayer("Object");
        var playerOffset = 500;
        if (!layer) {
            return;
        }
        var objectInstance;
        objectInstance = objectClass.createInstance(layer.name, -1000, -1000);
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
    }
    static BuildingLayerSwitch(runtime) {
        var EvnentHandlerInstance = runtime.objects.EventHnadler.getFirstInstance();
        (EvnentHandlerInstance?.addEventListener)("buildingmode-toggle-on", () => {
            // building mode on
            console.log("building mode on");
            runtime.getLayout("Game").getLayer("BuildingLayer").isVisible = true;
            Building.MoveBuildingToLayer(runtime, "BuildingLayer", "null");
        });
        (EvnentHandlerInstance?.addEventListener)("buildingmode-toggle-off", () => {
            // building mode off
            console.log("building mode off");
            runtime.getLayout("Game").getLayer("BuildingLayer").isVisible = false;
            Building.MoveBuildingToLayer(runtime, "Object", "null");
            ObjectYsort.YsortFixbug(runtime);
        });
    }
    static MoveBuildingToLayer(runtime, LayerName, Type) {
        var BuildingGroupClass;
        var Layer = runtime.getLayout("Game").getLayer(LayerName);
        BuildingGroupClass = runtime.objects.BuildingGroup;
        for (var bdgi of BuildingGroupClass.instances()) {
            if (bdgi && Layer) {
                bdgi.moveToLayer(Layer);
            }
        }
    }
}
