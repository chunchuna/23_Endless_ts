import { Layer } from "../utils/Layer.js";
import { Player } from "./Player.js";
import { ObjectYsort } from "./Ysort.js";
var Grid = InstanceType.Grid;
import { GameMath } from "../utils/Math.js";
var SpwnTypeEnum;
(function (SpwnTypeEnum) {
    SpwnTypeEnum[SpwnTypeEnum["Mouse"] = 0] = "Mouse";
    SpwnTypeEnum[SpwnTypeEnum["NearPlayer"] = 1] = "NearPlayer";
    SpwnTypeEnum[SpwnTypeEnum["CustomPosition"] = 2] = "CustomPosition";
})(SpwnTypeEnum || (SpwnTypeEnum = {}));
export class Building {
    static SelectedCreatBuildingType; // What is the type of building selected by the current player?
    static Update(runtime) {
        // Set all placed objects within the rule 256: 256
        for (var Buildings of runtime.objects.BuildingGroup.instances()) {
            var Postion = Building.SetPositionRound(runtime, Buildings.x, Buildings.y);
            Buildings.x = Postion[0];
            Buildings.y = Postion[1];
        }
        var AllGrids = Building.GetAllGrids(runtime);
        AllGrids.forEach((Grid) => {
            var Postion = Building.SetPositionRound(runtime, Grid.x, Grid.y);
            Grid.x = Postion[0];
            Grid.y = Postion[1];
        });
    }
    static async Init(runtime) {
        // When a building is generated
        runtime.objects.BuildingGroup.addEventListener("instancecreate", (e) => {
            e.instance.behaviors.Drag.isEnabled = runtime.globalVars.ISBuildingMode;
            console.log(e.instance.behaviors.Drag.isEnabled);
        });
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        /*
        For Debug
        */
        await (EventHnadlerInstance?.addEventListener)("[build-spwan]", (e) => {
            if (e.walltype == "wall1") {
                Building.SpwnStuff(runtime, runtime.objects.wall, SpwnTypeEnum.NearPlayer);
            }
        });
        // When click the button to switch the building mode
        await (EventHnadlerInstance?.addEventListener)("[click-buildingmodebutton]", (e) => {
            runtime.globalVars.ISBuildingMode = !runtime.globalVars.ISBuildingMode;
        });
        // Handling the building mode toggle on event
        await (EventHnadlerInstance?.addEventListener)("[buildingmode-toggle-on]", () => {
            /*
               Mode On
            */
            console.log("building mode on");
            var Postion = [Player.GetPlayerInstance(runtime).x, Player.GetPlayerInstance(runtime).y];
            //Building.SpwnGrid(runtime, Postion);
            Building.CreateGridArray(runtime, 5, 256);
            // Set the building layer visible
            var BuildingLayer = Layer.GetLayer(runtime, "BuildingLayer");
            Layer.SetLayerVisibel(runtime, BuildingLayer, true);
            Building.SetAllBuildingsToLayer(runtime, "BuildingLayer", "null");
            // Enable drag behavior for buildings
            // [bug -> If a building is created after that, it cannot be dragged by default]
            var AllBuildings = Building.GetAllBuildings(runtime);
            AllBuildings.forEach((buils) => {
                buils.behaviors.Drag.isEnabled = true;
            });
            // Listen for lick event on building groups
            (EventHnadlerInstance?.addEventListener)("[doubleclick-buildinggroup]", (e) => {
                var getBuilding = e.buildings;
                console.log(getBuilding);
                if (getBuilding && runtime.globalVars.ISBuildingMode) {
                    getBuilding.destroy();
                }
            });
            // Set the light layer invisible
            Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "Light"), false);
            // Set UI
            runtime.objects.BuildingModeSpButton.getFirstPickedInstance()?.setAnimation("Enable");
        });
        // Handling the building mode toggle off event
        await (EventHnadlerInstance?.addEventListener)("[buildingmode-toggle-off]", () => {
            /*
               Mode OFF
            */
            console.log("building mode off");
            Building.ClearAllGrid(runtime);
            // Set the building layer invisible
            Layer.SetLayerVisibel(runtime, Layer.GetLayer(runtime, "BuildingLayer"), false);
            Building.SetAllBuildingsToLayer(runtime, "Object", "null");
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
        await (EventHnadlerInstance?.addEventListener)("[build-dragstart]", (e) => {
        });
        await (EventHnadlerInstance?.addEventListener)("[build-dragrunning]", (e) => {
        });
        await (EventHnadlerInstance?.addEventListener)("[build-dragfinish]", (e) => {
            var BuildingInstance = e.buildings;
            // if (!BuildingInstance.instVars.IsInGrid) {
            //     BuildingInstance.x = BuildingInstance.instVars.PrePositionX;
            //     BuildingInstance.y = BuildingInstance.instVars.PrePositionY;
            // }
            var GetCloseGrid = Building.GetClosestGrid(BuildingInstance, Building.GetAllGrids(runtime));
            BuildingInstance.x = GetCloseGrid.x;
            BuildingInstance.y = GetCloseGrid.y;
        });
        // Grids
        Building.SelectedCreatBuildingType = runtime.objects.wall;
        await (EventHnadlerInstance?.addEventListener)("[build-MouseOverGrid]", (e) => {
            var IsMouseOver = e.MouseOver;
            var GetGrid = e.ThisGrid[0];
            GetGrid.setAnimation("MouseOver");
            setTimeout(() => {
                GetGrid.setAnimation("Normal");
            }, 50);
        });
        await (EventHnadlerInstance?.addEventListener)("[build-MouseClickGrid]", (e) => {
            var IsMouseOver = e.MouseOver;
            var GetGrid = e.ThisGrid[0];
            var InstanceClass = Building.SelectedCreatBuildingType;
            if (!GetGrid.instVars.IsCanPlace)
                return;
            var GetCretedBuilding = Building.SpwnStuff(runtime, InstanceClass, SpwnTypeEnum.CustomPosition);
            GetCretedBuilding.x = GetGrid.getImagePointX(0);
            GetCretedBuilding.y = GetGrid.getImagePointY(0);
        });
        await (EventHnadlerInstance?.addEventListener)("[build-GridOverPlayer]", (e) => {
            var IsMouseOver = e.MouseOver;
            var GetGrid = e.ThisGrid[0];
            GetGrid.instVars.IsCanPlace = false;
        });
        await (EventHnadlerInstance?.addEventListener)("[!build-GridOverPlayer]", (e) => {
            var IsMouseOver = e.MouseOver;
            var GetGrid = e.ThisGrid[0];
            GetGrid.instVars.IsCanPlace = true;
        });
    }
    static GetClosestGrid(building, grids) {
        let closestGrid = null;
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
    static SpwnStuff(runtime, buildingStuffClass, SpwnType) {
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
    static GetAllGrids(runtime) {
        let allGrids = [];
        for (let grid of runtime.objects.Grid.instances()) {
            allGrids.push(grid);
        }
        return allGrids;
    }
    static SpwnGrid(runtime, Postion) {
        var GridInstance = runtime.objects.Grid.createInstance("Ground", Postion[0], Postion[1]);
        console.log("grid");
        return GridInstance;
    }
    static ClearAllGrid(runtime) {
        for (var Grid of runtime.objects.Grid.instances()) {
            Grid.destroy();
        }
        for (var GridBoss of runtime.objects.GridBoss.instances()) {
            GridBoss.destroy();
        }
    }
    static CreateGridArray(runtime, ArraySize, CellSize) {
        var StartX = Player.GetPlayerInstance(runtime).x - (ArraySize / 2) * CellSize;
        var StartY = Player.GetPlayerInstance(runtime).y - (ArraySize / 2) * CellSize;
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
                });
                console.log(GetGrid.getParent());
            }
        }
    }
    static UpdateGridPosition(runtime, Position) {
        var GetGridBoss = runtime.objects.GridBoss.getFirstInstance();
        // GetGridBoss!.x=Position[0];
        // GetGridBoss!.y=Position[1];
        var PlayerInstance = Player.GetPlayerInstance(runtime);
        PlayerInstance?.addChild(GetGridBoss, {
            transformX: true,
            transformY: true,
        });
    }
}
