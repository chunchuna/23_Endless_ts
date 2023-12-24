export class WallInstance {
    public static UpdateWall1State(runtime: IRuntime) {
        const PlayerInstance: InstanceType.player | null = runtime.objects.player.getFirstInstance();
        const ISBuildingMode: boolean = runtime.globalVars.ISBuildingMode;
        for (let wall1 of runtime.objects.wall.instances()) {
            if (wall1 && PlayerInstance != null) {
                if (wall1.y < PlayerInstance.y) {
                    wall1.setAnimation("UptoPlayer");
                }
                if (wall1.y > PlayerInstance.y) {
                    wall1.setAnimation("DownPlayer");
                }
                if (ISBuildingMode) {
                    wall1.setAnimation("BuildingMode");
                }
            }
        }
    }
}