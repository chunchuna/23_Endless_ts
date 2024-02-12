export class GameGuideWindow {
    static Init(runtime) {
        GameGuideWindow.Event(runtime);
    }
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[OnPresskey]", (e) => {
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
