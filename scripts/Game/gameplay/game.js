import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
import { GameGuideWindow } from "../entities/GameGuideWindow.js";
import { Grid } from "../entities/Grid.js";
export class game {
    static Update(runtime) {
        [
            Building.Update,
            Player.InputUpdate,
            WallInstance.Update,
            Player.Update,
            WallInstance.Update,
            Grid.Update,
        ].forEach((func) => func(runtime));
    }
    static Init(runtime) {
        [
            Building.Init,
            ObjectYsort.Init,
            Collectable.Init,
            IntroduceTextInstance.Init,
            Player.Init,
            GameGuideWindow.Init,
            Grid.Init,
        ].forEach((func) => func(runtime));
    }
}
