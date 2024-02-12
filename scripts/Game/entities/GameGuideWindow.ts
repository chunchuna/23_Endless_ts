export class GameGuideWindow {
    public static Init(runtime: IRuntime) {

        GameGuideWindow.Event(runtime);
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
        return runtime.getLayout("Game").getLayer("GameGuideWindow");
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
        Layer!.isVisible = true;

    }

    public static CloseWindow(runtime: IRuntime) {
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime)
        Layer!.isVisible = false;

    }

    public static SwitchWindow(runtime: IRuntime) {
        console.log("click p ")
        var Layer = GameGuideWindow.GetGuideWindowLayer(runtime)
        Layer!.isVisible = !Layer!.isVisible;

    }


}