export class GameGuideWindow {
    static Init(runtime) {
        GameGuideWindow.Input(runtime);
        GameGuideWindow.Event(runtime);
    }
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[OnPressPkey]", (e) => {
            GameGuideWindow.SwitchWindow(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[GuideWindow->OnClickCloseButton]", (e) => {
            GameGuideWindow.CloseWindow(runtime);
        });
    }
    static async Input(runtime) {
    }
    static GetGuideWindowLayer(runtime) {
        return runtime.getLayout("Game").getLayer("GameGuideWindow");
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
        Layer.isVisible = true;
    }
    static CloseWindow(runtime) {
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime);
        Layer.isVisible = false;
    }
    static SwitchWindow(runtime) {
        console.log("click p ");
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime);
        Layer.isVisible = !Layer.isVisible;
    }
}
