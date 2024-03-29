import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
import player = InstanceType.player;
import { GameGuideWindow } from "../entities/GameGuideWindow.js";
export class game {
    public static Update(runtime: IRuntime) {
        [
            Building.Update,
            Player.InputUpdate,
            WallInstance.Update,
            Player.Update,
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
            GameGuideWindow.Init,

        ].forEach((func) => func(runtime));
    }
}
