export class Building {

    public static async BuildingAddWall(runtime: IRuntime) {
        const Wall1Class = runtime.objects.wall;
        const Wall2Class = runtime.objects.wall2;
        const PlayerInstance = runtime.objects.player.getFirstPickedInstance();
        const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        const addWall = async (key: string, wallClass: any) => {
            await (EventHnadlerInstance?.addEventListener as any)(key, () => {
                if (PlayerInstance) {
                    wallClass.createInstance("Object", PlayerInstance.x + 10, PlayerInstance.y + 10, false);
                }
            });
        };
        await addWall("keyPress_Num1", Wall1Class);
        await addWall("keyPress_Num2", Wall2Class);
    }
    public static BuildingModeMoveBuildingToLayer(runtime: IRuntime) {
        const ISBuildingMode = runtime.globalVars.ISBuildingMode; 
        const BuildingGroup = runtime.objects.BuildingGroup.instances();
        const PlayerInstance = runtime.objects.player.getFirstInstance();
        let BuildingLayer = runtime.getLayout("Game").getLayer("BuildingLayer");
        if (ISBuildingMode) {
            if (BuildingLayer) {
                BuildingLayer.isVisible = true;
                for (let BuildingGroups of BuildingGroup) {
                    BuildingGroups.moveToLayer(BuildingLayer);
                    BuildingGroups.moveToTop();
                }
            }
        } else {
            if (BuildingLayer) BuildingLayer.isVisible = false;
            for (let BuildingGroups of BuildingGroup) {
                for (let ysortGroups of runtime.objects.YsortGroup.instances()) {
                    const theseLocalLayer = runtime.getLayout("Game").getLayer(ysortGroups.instVars["LocalLayerName"]);
                    if (theseLocalLayer) ysortGroups.moveToLayer(theseLocalLayer);
                }
            }
        }
    }
    public static BuildingWall2AWLASSetTop(runtime: IRuntime) {
        const ISBuildingMode = runtime.globalVars.ISBuildingMode;
        if (ISBuildingMode) {
            if (ISBuildingMode == true) {
                for (let Wall2s of runtime.objects.wall2.instances()) {
                    Wall2s.moveToTop();
                    for (let wall1 of runtime.objects.wall.instances()) {
                        if (Wall2s.testOverlap(wall1)) {
                            Wall2s.moveToTop();
                        }
                    }
                }
            }
        }
    }
}