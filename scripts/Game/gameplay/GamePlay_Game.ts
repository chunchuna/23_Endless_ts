import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js"
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
export class gameplay {
    public static tick(runtime: IRuntime) {
        [
            Building.Update,
            Player.PlayerMoveByWASD,
            WallInstance.UpdateWall1State,
        ].forEach((func) => func(runtime));
    }
    public static start(runtime: IRuntime) {
        [
            Building.Init,
            ObjectYsort.Init,
            Collectable.Init,
            IntroduceTextInstance.TextUpdate,
        ].forEach((func) => func(runtime));
    }
}
