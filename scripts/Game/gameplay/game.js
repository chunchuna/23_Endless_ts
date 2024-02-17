import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
import { GameGuideWindow } from "../entities/GameGuideWindow.js";
import { Grid } from "../entities/Grid.js";
import { DebugMessage } from "../entities/DebugMessage.js";
import { EventSystem } from "../utils/EventSystem.js";
export class game {
    static Update(runtime) {
        [
            new EventSystem().Update,
            new Building().Update,
            new WallInstance().Update,
            new Player().Update,
            new Grid().Update,
            new DebugMessage().Update,
            new Collectable().Update,
            new IntroduceTextInstance().Update,
            new GameGuideWindow().Update,
        ].forEach((func) => func(runtime));
    }
    static Init(runtime) {
        [
            new EventSystem().Init,
            new Building().Init,
            new ObjectYsort().Init,
            new Collectable().Init,
            new Player().Init,
            new GameGuideWindow().Init,
            new Grid().Init,
            new DebugMessage().Init,
            new IntroduceTextInstance().Init,
            new WallInstance().Init,
        ].forEach((func) => func(runtime));
    }
}
