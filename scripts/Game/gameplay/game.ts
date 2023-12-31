import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
import player = InstanceType.player;
export class game {
     public static Update(runtime: IRuntime) {
        [
            Building.Update,
            Player.Input,
            WallInstance.Update,
        ].forEach((func) => func(runtime));
    }
    public static Init(runtime: IRuntime) {
        [
            Building.Init,
            ObjectYsort.Init,
            Collectable.Init,
            IntroduceTextInstance.Init,
            Player.Init,
        ].forEach((func) => func(runtime));
    }
}
