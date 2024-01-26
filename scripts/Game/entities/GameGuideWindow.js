export class GameGuideWindow {
    static Init(runtime) {
        GameGuideWindow.Input(runtime);
    }
    static async Input(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[guide-callwindow]", (e) => {
            GameGuideWindow.SwitchWindow(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("[guide-cliseCloseButton]", (e) => {
            GameGuideWindow.CloseWindow(runtime);
        });
    }
    static GetLayer(runtime) {
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
        var Layer = GameGuideWindow.GetLayer(runtime);
        Layer.isVisible = true;
    }
    static CloseWindow(runtime) {
        var Layer = GameGuideWindow.GetLayer(runtime);
        Layer.isVisible = false;
    }
    static SwitchWindow(runtime) {
        var Layer = GameGuideWindow.GetLayer(runtime);
        Layer.isVisible = !Layer.isVisible;
    }
}
