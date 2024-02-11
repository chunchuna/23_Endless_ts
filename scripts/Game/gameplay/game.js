import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
import { GameGuideWindow } from "../entities/GameGuideWindow.js";
import { Grid } from "../entities/Grid.js";
import { DebugMessage } from "../entities/DebugMessage.js";
export class game {
    static Update(runtime) {
        [
            Building.Update,
            WallInstance.Update,
            new Player().Update,
            WallInstance.Update,
            Grid.Update,
            new DebugMessage().Update,
            new Collectable().Update,
        ].forEach((func) => func(runtime));
    }
    static Init(runtime) {
        [
            Building.Init,
            ObjectYsort.Init,
            new Collectable().Init,
            new Player().Init,
            GameGuideWindow.Init,
            Grid.Init,
            new DebugMessage().Init,
        ].forEach((func) => func(runtime));
    }
}
