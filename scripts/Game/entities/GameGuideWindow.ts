import { ConstructSystem } from "../utils/ConstructSystem.js";
import { LayerManager } from "../utils/Layer.js";

export class GameGuideWindow extends ConstructSystem {


    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        GameGuideWindow.Event(runtime);
        runtime.objects.DrawingCanvas.getFirstInstance()?.line
    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
    }

    public static async Event(runtime: IRuntime) {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener as any)("[OnPresskey]", (e: any) => {
            this.Input(runtime, e)

        });
        await (EventHnadlerInstance?.addEventListener as any)("[GuideWindow->OnClickCloseButton]", (e: any) => {
            this.OnClickCloseButton(runtime)
        });
    }

    private static Input(runtime: IRuntime, e: any) {
        if (e.key == "Pkey") {
            GameGuideWindow.SwitchWindow(runtime);
        }
    }

    private static OnClickCloseButton(runtime: IRuntime) {
        GameGuideWindow.CloseWindow(runtime);
    }


    public static GetGuideWindowLayer(runtime: IRuntime) {
        return LayerManager.GetLayerFromTestMAP(runtime, "GameGuideWindow")

    }

    public static SetGuideContent(runtime: IRuntime, Content: string) {

        var GuideTextInstance = runtime.objects.GameGuideText.getFirstInstance();
        if (GuideTextInstance == null) {
            console.log("gameguide- gameguide text null")

        } else {
            GuideTextInstance.text = Content;
        }
    }

    public static OpenWindow(runtime: IRuntime) {
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime)
        if (typeof Layer === "boolean") return
        Layer!.isVisible = true;

    }

    public static CloseWindow(runtime: IRuntime) {
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime)
        if (typeof Layer === "boolean") return
        Layer!.isVisible = false;

    }

    public static SwitchWindow(runtime: IRuntime) {
        console.log("click p ")
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime)
        if (typeof Layer === "boolean") return
        Layer!.isVisible = !Layer!.isVisible;

    }


}