import {GameMath} from "../utils/Math.js";
import {Player} from "./Player.js";

export class Grid {
    public static Init(runtime: IRuntime) {
        Grid.Event(runtime);
    }

    public static Update(runtime: IRuntime) {

    }

    /** Event **/
    private static async Event(runtime: IRuntime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();


        await (EventHnadlerInstance?.addEventListener as any)("[Grid_MouseOverGrid]", (e: any) => {
            this.OnMouseOverGrid(runtime, e);
        })

        await (EventHnadlerInstance?.addEventListener as any)("[Grid_MouseClickGrid]", (e: any) => {
            this.OnClickGrid(runtime, e);
        })

        await (EventHnadlerInstance?.addEventListener as any)("[Grid_GridOverPlayer]", (e: any) => {
            this.OnGridOverPlayer(runtime, e);

        })
        await (EventHnadlerInstance?.addEventListener as any)("[!Grid_GridOverPlayer]", (e: any) => {
            this.OnUnGridOverPlayer(runtime, e);

        })
    }

    static OnUnGridOverPlayer(runtime: IRuntime, e: any) {
        var IsMouseOver: boolean = e.MouseOver;
        var GetGrid: InstanceType.Grid = e.ThisGrid[0];
        GetGrid.instVars.IsCanPlace = true;

    }

    static OnGridOverPlayer(runtime: IRuntime, e: any) {
        var IsMouseOver: boolean = e.MouseOver;
        var GetGrid: InstanceType.Grid = e.ThisGrid[0];
        GetGrid.instVars.IsCanPlace = false;
    }

    static OnClickGrid(runtime: IRuntime, e: any) {
    }

    static OnMouseOverGrid(runtime: IRuntime, e: any) {
        var IsMouseOver: boolean = e.MouseOver;
        var GetGrid: InstanceType.Grid = e.ThisGrid[0];

        GetGrid.setAnimation("MouseOver");
        setTimeout(() => {
            GetGrid.setAnimation("Normal")
        }, 50);
    }


    /** Function **/

    private static GetClosestGrid(building: InstanceType.BuildingGroup, grids: InstanceType.Grid[]): InstanceType.Grid | null {
        let closestGrid: InstanceType.Grid | null = null;
        let minDistance = Number.MAX_VALUE;

        for (let grid of grids) {
            let distance = GameMath.calculateDistance(building.x, building.y, grid.x, grid.y);
            if (distance < minDistance && grid.instVars.IsCanPlace) {
                minDistance = distance;
                closestGrid = grid;

            } else {
                console.log("can not find closest grid")
            }
        }

        return closestGrid;
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
        //console.log("grid")
        return GridInstance;

    }

    public static ClearAllGrid(runtime: IRuntime) {
        for (var Grid of runtime.objects.Grid.instances()) {
            Grid.destroy();
        }
        for (var GridBoss of runtime.objects.GridBoss.instances()) {
            GridBoss.destroy();
        }
    }

    public static CreateGridArrayByPlayer(runtime: IRuntime, ArraySize: number, CellSize: number) {
        var StartX: number = Player.GetPlayerInstance(runtime)!.x - (ArraySize / 2) * CellSize;
        var StartY: number = Player.GetPlayerInstance(runtime)!.y - (ArraySize / 2) * CellSize;
        //var GirdBossInstance = runtime.objects.GridBoss.createInstance("Object", StartX, StartY);
        for (let x = 0; x < ArraySize; x++) {
            for (let y = 0; y < ArraySize; y++) {
                var spawnX = StartX + x * CellSize;
                var spawnY = StartY + y * CellSize;
                var Position = [spawnX, spawnY];
                var GetGrid = Grid.SpwnGrid(runtime, Position);

            }
        }

    }

    public static UpdateGridPositionByPlayer(runtime: IRuntime,) {
        var IsGridHas = runtime.objects.Grid.getFirstInstance();
        if (IsGridHas != null) {
            Grid.ClearAllGrid(runtime);
            Grid.CreateGridArrayByPlayer(runtime, 5, 256);

        }
    }
}