import {Layer} from "../utils/Layer.js";
import {Player} from "./Player.js";
import {ObjectYsort} from "./Ysort.js";
import Grid = InstanceType.Grid;
import {GameMath} from "../utils/Math.js";

enum SpwnTypeEnum { //The type of building, in what way is the building generated?
    Mouse, //Near the mouse
    NearPlayer,//Near the player
    CustomPosition, //Instead of setting the location where the building is generated, return [ building itself]
}

export class Building {

    public static SelectedCreatBuildingType: IObjectType<InstanceType.BuildingGroup>; // What is the type of building selected by the current player?


    public static Update(runtime: IRuntime) {

        // Set all placed objects within the rule 256: 256
        for (var Buildings of runtime.objects.BuildingGroup.instances()) {
            var Postion = Building.SetPositionRound(runtime, Buildings.x, Buildings.y)
            Buildings.x = Postion[0];
            Buildings.y = Postion[1];
        }

        var AllGrids = Building.GetAllGrids(runtime);
        AllGrids.forEach((Grid) => {
            var Postion = Building.SetPositionRound(runtime, Grid.x, Grid.y)
            Grid.x = Postion[0];
            Grid.y = Postion[1];
        })


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

            //Building.SpwnGrid(runtime, Postion);
            Building.CreateGridArray(runtime, 5, 256)


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


            // Listen for lick event on building groups
            (EventHnadlerInstance?.addEventListener as any)("[doubleclick-buildinggroup]", (e: any) => {
                var getBuilding: InstanceType.BuildingGroup = e.buildings;
                console.log(getBuilding)
                if (getBuilding && runtime.globalVars.ISBuildingMode) {
                    getBuilding.destroy();
                }
            })

            // Set the light layer invisible
            Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "Light"), false);

            // Set UI
            runtime.objects.BuildingModeSpButton.getFirstPickedInstance()?.setAnimation("Enable");


        });

        // Handling the building mode toggle off event
        await (EventHnadlerInstance?.addEventListener as any)("[buildingmode-toggle-off]", () => {
            /*
               Mode OFF
            */
            console.log("building mode off")
            Building.ClearAllGrid(runtime)

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

            // Set UI
            runtime.objects.BuildingModeSpButton.getFirstPickedInstance()?.setAnimation("Disable");
        });


        //Drag and drop event
        await (EventHnadlerInstance?.addEventListener as any)("[build-dragstart]", (e: any) => {
        })
        await (EventHnadlerInstance?.addEventListener as any)("[build-dragrunning]", (e: any) => {
        })
        await (EventHnadlerInstance?.addEventListener as any)("[build-dragfinish]", (e: any) => {
            var BuildingInstance: InstanceType.BuildingGroup = e.buildings;
            // if (!BuildingInstance.instVars.IsInGrid) {
            //     BuildingInstance.x = BuildingInstance.instVars.PrePositionX;
            //     BuildingInstance.y = BuildingInstance.instVars.PrePositionY;
            // }
            var GetCloseGrid = Building.GetClosestGrid(BuildingInstance, Building.GetAllGrids(runtime))
            BuildingInstance.x = GetCloseGrid!.x;
            BuildingInstance.y = GetCloseGrid!.y;


        })

        // Grids

        Building.SelectedCreatBuildingType = runtime.objects.wall;

        await (EventHnadlerInstance?.addEventListener as any)("[build-MouseOverGrid]", (e: any) => {
            var IsMouseOver: boolean = e.MouseOver;
            var GetGrid: InstanceType.Grid = e.ThisGrid[0];
            GetGrid.setAnimation("MouseOver");
            setTimeout(() => {
                GetGrid.setAnimation("Normal")
            }, 50);

        })

        await (EventHnadlerInstance?.addEventListener as any)("[build-MouseClickGrid]", (e: any) => {
            var IsMouseOver: boolean = e.MouseOver;
            var GetGrid: InstanceType.Grid = e.ThisGrid[0];
            var InstanceClass = Building.SelectedCreatBuildingType;
            if (!GetGrid.instVars.IsCanPlace) return;
            var GetCretedBuilding = Building.SpwnStuff(runtime, InstanceClass, SpwnTypeEnum.CustomPosition);
            GetCretedBuilding!.x = GetGrid.getImagePointX(0);
            GetCretedBuilding!.y = GetGrid.getImagePointY(0);

        })

        await (EventHnadlerInstance?.addEventListener as any)("[build-GridOverPlayer]", (e: any) => {
            var IsMouseOver: boolean = e.MouseOver;
            var GetGrid: InstanceType.Grid = e.ThisGrid[0];
            GetGrid.instVars.IsCanPlace = false;

        })
        await (EventHnadlerInstance?.addEventListener as any)("[!build-GridOverPlayer]", (e: any) => {
            var IsMouseOver: boolean = e.MouseOver;
            var GetGrid: InstanceType.Grid = e.ThisGrid[0];
            GetGrid.instVars.IsCanPlace = true;

        })


    }


    private static GetClosestGrid(building: InstanceType.BuildingGroup, grids: InstanceType.Grid[]): InstanceType.Grid | null {
        let closestGrid: InstanceType.Grid | null = null;
        let minDistance = Number.MAX_VALUE;

        for (let grid of grids) {
            let distance = GameMath.calculateDistance(building.x, building.y, grid.x, grid.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestGrid = grid;
            }
        }

        return closestGrid;
    }

    private static SpwnStuff(runtime: IRuntime, buildingStuffClass: IObjectType<InstanceType.BuildingGroup>, SpwnType: SpwnTypeEnum) {
        var objectClass = buildingStuffClass;
        var layer = runtime.getLayout("Game").getLayer("Object");
        var playerOffset = 500;
        if (!layer) {
            return
        }
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

    private static GetAllGrids(runtime: IRuntime) {
        let allGrids: InstanceType.Grid[] = [];
        for (let grid of runtime.objects.Grid.instances()) {
            allGrids.push(grid);
        }
        return allGrids;
    }

    private static SpwnGrid(runtime: IRuntime, Postion: Array<number>) {
        var GridInstance = runtime.objects.Grid.createInstance("Ground", Postion[0], Postion[1])
        console.log("grid")
        return GridInstance;

    }

    private static ClearAllGrid(runtime: IRuntime) {
        for (var Grid of runtime.objects.Grid.instances()) {
            Grid.destroy();
        }
        for (var GridBoss of runtime.objects.GridBoss.instances()) {
            GridBoss.destroy();
        }
    }

    private static CreateGridArray(runtime: IRuntime, ArraySize: number, CellSize: number) {
        var StartX: number = Player.GetPlayerInstance(runtime)!.x - (ArraySize / 2) * CellSize;
        var StartY: number = Player.GetPlayerInstance(runtime)!.y - (ArraySize / 2) * CellSize;
        var GirdBossInstance = runtime.objects.GridBoss.createInstance("Object", StartX, StartY);
        for (let x = 0; x < ArraySize; x++) {
            for (let y = 0; y < ArraySize; y++) {
                var spawnX = StartX + x * CellSize;
                var spawnY = StartY + y * CellSize;
                var Position = [spawnX, spawnY];
                var GetGrid = Building.SpwnGrid(runtime, Position);
                GirdBossInstance.addChild(GetGrid, {
                    transformY: true,
                    transformX: true,
                })
                console.log(GetGrid.getParent());
            }
        }


    }

    public static UpdateGridPosition(runtime: IRuntime, Position: [number, number]) {
        var GetGridBoss = runtime.objects.GridBoss.getFirstInstance();
        // GetGridBoss!.x=Position[0];
        // GetGridBoss!.y=Position[1];
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        PlayerInstance?.addChild(GetGridBoss!, {
            transformX: true,
            transformY: true,

        })
    }
}