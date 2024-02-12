export class GameGuideWindow {
    public static Init(runtime: IRuntime) {
        GameGuideWindow.Input(runtime);
        GameGuideWindow.Event(runtime);
    }


    public static async Event(runtime: IRuntime) {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("[OnPressPkey]", (e: any) => {
            GameGuideWindow.SwitchWindow(runtime);
        });

        await (EventHnadlerInstance?.addEventListener as any)("[GuideWindow->OnClickCloseButton]", (e: any) => {
            GameGuideWindow.CloseWindow(runtime);
        });
    }


    private static async Input(runtime: IRuntime) {


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