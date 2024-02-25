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
/**
 * for game room
 */
export class game {
    static EventSystem = new EventSystem();
    static Building = new Building();
    static WallInstance = new WallInstance();
    static Player = new Player();
    static Grid = new Grid();
    static DebugMessage = new DebugMessage();
    static Collectable = new Collectable();
    static IntroduceTextInstance = new IntroduceTextInstance();
    static ObjectYsort = new ObjectYsort();
    static GameGuideWindow = new GameGuideWindow();
    static Update(runtime) {
        this.EventSystem.Update(runtime);
        this.Building.Update(runtime);
        this.WallInstance.Update(runtime);
        this.Player.Update(runtime);
        this.Grid.Update(runtime);
        this.DebugMessage.Update(runtime);
        this.Collectable.Update(runtime);
        this.IntroduceTextInstance.Update(runtime);
        // Add other Update calls for additional classes as needed
    }
    static Init(runtime) {
        this.EventSystem.Init(runtime);
        this.Building.Init(runtime);
        this.ObjectYsort.Init(runtime);
        this.Collectable.Init(runtime);
        this.Player.Init(runtime);
        this.GameGuideWindow.Init(runtime);
        this.Grid.Init(runtime);
        this.DebugMessage.Init(runtime);
        this.IntroduceTextInstance.Init(runtime);
        this.WallInstance.Init(runtime);
        // Add other Init calls for additional classes as needed
    }
}
