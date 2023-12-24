export class WallInstance {
    static UpdateWall1State(runtime) {
        const PlayerInstance = runtime.objects.player.getFirstInstance();
        const ISBuildingMode = runtime.globalVars.ISBuildingMode;
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
