import { Building } from "../entities/Building.js";
import { Collectable } from "../entities/Collectable.js";
import { IntroduceTextInstance } from "../entities/IntroduceText.js";
import { Player } from "../entities/Player.js";
import { WallInstance } from "../entities/Wall.js";
import { ObjectYsort } from "../entities/Ysort.js";
export class gameplay {
    static tick(runtime) {
        [
            Player.PlayerMoveByWASD,
            IntroduceTextInstance.FixControlIntroductionText,
            Building.BuildingModeMoveBuildingToLayer,
            Building.BuildingWall2AWLASSetTop,
            WallInstance.Wall1StateSwitch,
        ].forEach((func) => func(runtime));
    }
    static start(runtime) {
        [
            Building.BuildingAddWall,
            ObjectYsort.YsortInit,
            Collectable.CollectableInit
        ].forEach((func) => func(runtime));
    }
}
