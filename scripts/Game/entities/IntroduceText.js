export class IntroduceTextInstance {
    static TextUpdate(runtime) {
        var ControlIntroductionTextInstance = runtime.objects.ControlIntroductionText.getFirstInstance();
        var StringGroup = {
            BuildingMode: "[icon=mouse] [color=red]MOUSE[/color] drag drag and move editable buildings \n [icon=mouse][color=red] MOUSE[/color] double click delete buildings",
            NormalMode: "[icon=WASD] [color=red]WASD[/color] move character \n [icon=mouse] [color=red]MOUSE[/color] wheel zoom lens"
        };
        var EvnentHandlerInstance = runtime.objects.EventHnadler.getFirstInstance();
        (EvnentHandlerInstance?.addEventListener)("[buildingmode-toggle-on]", () => {
            // when building mode is on
            ControlIntroductionTextInstance.text = StringGroup.BuildingMode;
        });
        (EvnentHandlerInstance?.addEventListener)("[buildingmode-toggle-off]", () => {
            // when building mode is off
            ControlIntroductionTextInstance.text = StringGroup.NormalMode;
        });
    }
}
