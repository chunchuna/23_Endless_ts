import { Layer } from "../utils/Layer.js";
import { Player } from "./Player.js";
import { ObjectYsort } from "./Ysort.js";

enum SpwnTypeEnum {
    Mouse,
    NearPlayer
}
export class Building {



    public static Update(runtime: IRuntime) {

        // Use Grid place
        for (var buildings of runtime.objects.BuildingGroup.instances()) {
            var postion = Building.SetPositionRound(runtime, buildings.x, buildings.y)
            buildings.x = postion[0];
            buildings.y = postion[1];
        }
    }


    public static async Init(runtime: IRuntime) {



        // When a building is generated
        runtime.objects.BuildingGroup!.addEventListener("instancecreate", (e) => {

            e.instance.behaviors.Drag.isEnabled = runtime.globalVars.ISBuildingMode;
            console.log(e.instance.behaviors.Drag.isEnabled)

        });




        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        /*
        For Debug
        */
        await (EventHnadlerInstance?.addEventListener as any)("[build-spwan]", (e: any) => {
            if (e.walltype == "wall1") {
                Building.SpwnStuff(runtime, runtime.objects.wall, SpwnTypeEnum.NearPlayer)
            }
            if (e.walltype == "wall2") {
                Building.SpwnStuff(runtime, runtime.objects.wall2, SpwnTypeEnum.NearPlayer)
            }
        });


        // When click the button to switch the building mode
        await (EventHnadlerInstance?.addEventListener as any)("[click-buildingmodebutton]", (e: any) => {
            runtime.globalVars.ISBuildingMode = !runtime.globalVars.ISBuildingMode;
        })



        // Handling the building mode toggle on event
        await (EventHnadlerInstance?.addEventListener as any)("[buildingmode-toggle-on]", () => {
            /*
               Mode On
            */
            console.log("building mode on")
            var Postion = [Player.GetPlayerInstance(runtime)!.x, Player.GetPlayerInstance(runtime)!.y]
            Building.SpwnGrid(runtime, Postion);




            // Set the building layer visible
            var BuildingLayer = Layer.GetLayer(runtime, "BuildingLayer");

            Layer.SetLayerVisibel(runtime, BuildingLayer, true);
            Building.SetAllBuildingsToLayer(runtime, "BuildingLayer", "null")




            // Enable drag behavior for buildings  
            // [bug -> If a building is created after that, it cannot be dragged by default]
            var AllBuildings = Building.GetAllBuildings(runtime);
            AllBuildings.forEach((buils) => {
                buils.behaviors.Drag.isEnabled = true;
            });






            // Listen for double-click event on building groups
            (EventHnadlerInstance?.addEventListener as any)("[doubleclick-buildinggroup]", (e: any) => {
                var getBuilding: InstanceType.BuildingGroup = e.buildings;
                console.log(getBuilding)
                if (getBuilding) {
                    getBuilding.destroy();
                }
            })

            // Set the light layer invisible
            Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "Light"), false);
        });

        // Handling the building mode toggle off event
        await (EventHnadlerInstance?.addEventListener as any)("[buildingmode-toggle-off]", () => {
            /*
               Mode OFF
            */
            console.log("building mode off")

            // Set the building layer invisible
            Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "BuildingLayer"), false);
            Building.SetAllBuildingsToLayer(runtime, "Object", "null")
            ObjectYsort.YsortFixbug(runtime);

            // Disable drag behavior for buildings
            var AllBuildings = Building.GetAllBuildings(runtime);
            AllBuildings.forEach((buils) => {
                buils.behaviors.Drag.isEnabled = false;
            });


            // Set the light layer visible
            Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "Light"), true);
        });

    }



    private static SpwnStuff(runtime: IRuntime, buildingStuffClass: IObjectType<InstanceType.BuildingGroup>, SpwnType: SpwnTypeEnum) {
        var objectClass = buildingStuffClass;
        var layer = runtime.getLayout("Game").getLayer("Object");
        var playerOffset = 500;
        if (!layer) { return }
        var objectInstance: InstanceType.BuildingGroup;
        objectInstance = objectClass.createInstance(layer.name, -1000, -1000)


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

    private static SpwnGrid(runtime: IRuntime, Postion: Array<number>) {
        var GridInstance = runtime.objects.Grid.createInstance("Ground", Postion[0], Postion[1])

    }

    private static ClearAllGrid(runtime: IRuntime) {
        for (var Grid of runtime.objects.Grid.instances()) {
            Grid.destroy();
        }
    }
}