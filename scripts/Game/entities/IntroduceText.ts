export class IntroduceTextInstance {

    private static StringGroup = {
        BuildingMode: "[icon=mouse] [color=red]MOUSE[/color] drag drag and move editable buildings \n [icon=mouse][color=red] MOUSE[/color] double click delete buildings",
        NormalMode: "[icon=WASD] [color=red]WASD[/color] move character \n [icon=mouse] [color=red]MOUSE[/color] wheel zoom lens"
    };


    public static Init(runtime: IRuntime) {


        var ControlIntroductionTextInstance: ITextInstance | null = runtime.objects.ControlIntroductionText.getFirstInstance();
        ControlIntroductionTextInstance!.isVisible=false;
        

        var EvnentHandlerInstance = runtime.objects.EventHnadler.getFirstInstance();

        (EvnentHandlerInstance?.addEventListener as any)("[buildingmode-toggle-on]", () => {
            // when building mode is on
            ControlIntroductionTextInstance!.text = IntroduceTextInstance.StringGroup.BuildingMode;
        });

        (EvnentHandlerInstance?.addEventListener as any)("[buildingmode-toggle-off]", () => {
            // when building mode is off
            ControlIntroductionTextInstance!.text = IntroduceTextInstance.StringGroup.NormalMode;
        });

    }

    public static Update() {

    }


    public static TextUpdate(runtime: IRuntime) {


    }

    public static SetStringGroup() {

    }
}