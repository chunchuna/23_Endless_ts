export class IntroduceTextInstance {
    public static FixControlIntroductionText(runtime: IRuntime) {
        const ControlIntroductionTextInstance: ITextInstance | null = runtime.objects.ControlIntroductionText.getFirstInstance();
        const StringGroup = {
            BuildingMode: "[icon=mouse] [color=red]MOUSE[/color] drag drag and move editable buildings \n [icon=mouse][color=red] MOUSE[/color] double click delete buildings",
            NormalMode: "[icon=wasd] [color=red]WASD[/color] move character \n [icon=mouse] [color=red]MOUSE[/color] wheel zoom lens"
        };
        const ISBuildingMode = runtime.globalVars.ISBuildingMode;
        const textToShow = ISBuildingMode ? StringGroup.BuildingMode : StringGroup.NormalMode;
        if (ControlIntroductionTextInstance) {
            ControlIntroductionTextInstance.text = textToShow;
        }
    }
}