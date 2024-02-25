import { ConstructSystem } from "../utils/ConstructSystem.js";
import { LayerManager } from "../utils/Layer.js";
export class GameGuideWindow extends ConstructSystem {
    async Init(runtime) {
        super.Init(runtime);
        GameGuideWindow.Event(runtime);
        runtime.objects.DrawingCanvas.getFirstInstance()?.line;
    }
    Update(runtime) {
        super.Update(runtime);
    }
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("Input->OnPressedKey", (e) => {
            this.Input(runtime, e);
        });
        await (EventHnadlerInstance?.addEventListener)("[GuideWindow->OnClickCloseButton]", (e) => {
            this.OnClickCloseButton(runtime);
        });
    }
    static Input(runtime, e) {
        if (e.key == "Pkey") {
            GameGuideWindow.SwitchWindow(runtime);
        }
    }
    static OnClickCloseButton(runtime) {
        GameGuideWindow.CloseWindow(runtime);
    }
    static GetGuideWindowLayer(runtime) {
        return LayerManager.GetLayerFromTestMAP(runtime, "GameGuideWindow");
    }
    static SetGuideContent(runtime, Content) {
        var GuideTextInstance = runtime.objects.GameGuideText.getFirstInstance();
        if (GuideTextInstance == null) {
            console.log("gameguide- gameguide text null");
        }
        else {
            GuideTextInstance.text = Content;
        }
    }
    static OpenWindow(runtime) {
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime);
        if (typeof Layer === "boolean")
            return;
        Layer.isVisible = true;
    }
    static CloseWindow(runtime) {
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime);
        if (typeof Layer === "boolean")
            return;
        Layer.isVisible = false;
    }
    static SwitchWindow(runtime) {
        console.log("click p ");
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime);
        if (typeof Layer === "boolean")
            return;
        Layer.isVisible = !Layer.isVisible;
    }
}
