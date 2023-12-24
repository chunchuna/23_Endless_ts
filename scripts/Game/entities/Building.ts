export class Building {

    public static async BuildingAddWall(runtime: IRuntime) {
        const Wall1Class = runtime.objects.wall;
        const Wall2Class = runtime.objects.wall2;
        const PlayerInstance = runtime.objects.player.getFirstPickedInstance();
        const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener as any)("build_creat_wall", (e: any) => {
            if (e.walltype = "wall1") {
                Building.BuildCreatInstance(runtime, Wall1Class)
            }
            if (e.walltype = "wall2") {
                Building.BuildCreatInstance(runtime, Wall2Class)
            }
        });

    }

    private static BuildCreatInstance(runtime: IRuntime, instanceClass: IObjectType<any>) {
        const PlayerInstance = runtime.objects.player.getFirstInstance();
        const playerx = PlayerInstance?.x;
        const playery = PlayerInstance?.y;
        instanceClass.createInstance(runtime.getLayout("Game").getLayer("object"), playerx, playery, false);

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