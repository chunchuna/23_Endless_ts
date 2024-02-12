import { GameMath } from "../utils/Math.js";
import { Player } from "./Player.js";
export class Grid {
    static Init(runtime) {
        Grid.Event(runtime);
    }
    static Update(runtime) {
    }
    /** Event **/
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[Grid_MouseOverGrid]", (e) => {
            this.OnMouseOverGrid(runtime, e);
        });
        await (EventHnadlerInstance?.addEventListener)("[Grid_MouseClickGrid]", (e) => {
            this.OnClickGrid(runtime, e);
        });
        await (EventHnadlerInstance?.addEventListener)("[Grid_GridOverPlayer]", (e) => {
            this.OnGridOverPlayer(runtime, e);
        });
        await (EventHnadlerInstance?.addEventListener)("[!Grid_GridOverPlayer]", (e) => {
            this.OnUnGridOverPlayer(runtime, e);
        });
    }
    static OnUnGridOverPlayer(runtime, e) {
        var IsMouseOver = e.MouseOver;
        var GetGrid = e.ThisGrid[0];
        GetGrid.instVars.IsCanPlace = true;
    }
    static OnGridOverPlayer(runtime, e) {
        var IsMouseOver = e.MouseOver;
        var GetGrid = e.ThisGrid[0];
        GetGrid.instVars.IsCanPlace = false;
    }
    static OnClickGrid(runtime, e) {
    }
    static OnMouseOverGrid(runtime, e) {
        var IsMouseOver = e.MouseOver;
        var GetGrid = e.ThisGrid[0];
        GetGrid.setAnimation("MouseOver");
        setTimeout(() => {
            GetGrid.setAnimation("Normal");
        }, 50);
    }
    /** Function **/
    static GetClosestGrid(building, grids) {
        let closestGrid = null;
        let minDistance = Number.MAX_VALUE;
        for (let grid of grids) {
            let distance = GameMath.calculateDistance(building.x, building.y, grid.x, grid.y);
            if (distance < minDistance && grid.instVars.IsCanPlace) {
                minDistance = distance;
                closestGrid = grid;
            }
            else {
                console.log("can not find closest grid");
            }
        }
        return closestGrid;
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
        //console.log("grid")
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
    static CreateGridArrayByPlayer(runtime, GridCount, CellSize) {
        var StartX = Player.GetPlayerInstance(runtime).x - (GridCount / 2) * CellSize;
        var StartY = Player.GetPlayerInstance(runtime).y - (GridCount / 2) * CellSize;
        //var GirdBossInstance = runtime.objects.GridBoss.createInstance("Object", StartX, StartY);
        for (let x = 0; x < GridCount; x++) {
            for (let y = 0; y < GridCount; y++) {
                var spawnX = StartX + x * CellSize;
                var spawnY = StartY + y * CellSize;
                var Position = [spawnX, spawnY];
                var GetGrid = Grid.SpwnGrid(runtime, Position);
            }
        }
    }
    static UpdateGridPositionByPlayer(runtime, GridCount) {
        var IsGridHas = runtime.objects.Grid.getFirstInstance();
        if (IsGridHas != null) {
            Grid.ClearAllGrid(runtime);
            Grid.CreateGridArrayByPlayer(runtime, GridCount, 256);
        }
    }
}
