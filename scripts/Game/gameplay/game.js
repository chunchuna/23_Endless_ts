import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
var player = InstanceType.player;
export class game {
    static Update(runtime) {
        [
            Building.Update,
            Player.Input,
            WallInstance.Update,
        ].forEach((func) => func(runtime));
    }
    static Init(runtime) {
        [
            Building.Init,
            ObjectYsort.Init,
            Collectable.Init,
            IntroduceTextInstance.TextUpdate,
            Player.Init,
        ].forEach((func) => func(runtime));
    }
}
