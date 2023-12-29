import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
export class game {
    static Update(runtime) {
        [
            Building.Update,
            Player.PlayerMoveByWASD,
            WallInstance.Update,
        ].forEach((func) => func(runtime));
    }
    static Init(runtime) {
        [
            Building.Init,
            ObjectYsort.Init,
            Collectable.Init,
            IntroduceTextInstance.TextUpdate,
        ].forEach((func) => func(runtime));
    }
}
