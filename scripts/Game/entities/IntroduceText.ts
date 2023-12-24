export class IntroduceTextInstance {

    public static TextUpdate(runtime: IRuntime) {

        var ControlIntroductionTextInstance: ITextInstance | null = runtime.objects.ControlIntroductionText.getFirstInstance();
        var StringGroup = {
            BuildingMode: "[icon=mouse] [color=red]MOUSE[/color] drag drag and move editable buildings \n [icon=mouse][color=red] MOUSE[/color] double click delete buildings",
            NormalMode: "[icon=wasd] [color=red]WASD[/color] move character \n [icon=mouse] [color=red]MOUSE[/color] wheel zoom lens"
        };

        var EvnentHandlerInstance = runtime.objects.EventHnadler.getFirstInstance();
        
        (EvnentHandlerInstance?.addEventListener as any)("buildingmode-toggle-on", () => {
            // when building mode is on
            ControlIntroductionTextInstance!.text = StringGroup.BuildingMode;
        });

        (EvnentHandlerInstance?.addEventListener as any)("buildingmode-toggle-off", () => {
            // when building mode is off
            ControlIntroductionTextInstance!.text = StringGroup.NormalMode;
        });

    }
}