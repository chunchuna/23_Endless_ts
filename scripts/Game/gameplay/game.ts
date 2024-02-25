import {Building} from "../entities/Building.js";
import {Collectable} from "../entities/Collectable.js";
import {IntroduceTextInstance} from "../entities/IntroduceText.js";
import {Player} from "../entities/Player.js";
import {WallInstance} from "../entities/Wall.js";
import {ObjectYsort} from "../entities/Ysort.js";
import {GameGuideWindow} from "../entities/GameGuideWindow.js";
import {Grid} from "../entities/Grid.js";
import {DebugMessage} from "../entities/DebugMessage.js";
import {EventSystem} from "../utils/EventSystem.js";

/**
 * for game room
 */


export class game {

    private static EventSystem = new EventSystem();
    private static Building = new Building();
    private static WallInstance = new WallInstance();
    private static Player = new Player();
    private static Grid = new Grid();
    private static DebugMessage = new DebugMessage();
    private static Collectable = new Collectable();
    private static IntroduceTextInstance = new IntroduceTextInstance();
    private static ObjectYsort = new ObjectYsort();
    private static GameGuideWindow = new GameGuideWindow();

    public static Update(runtime: IRuntime) {
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

    public static Init(runtime: IRuntime) {
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
