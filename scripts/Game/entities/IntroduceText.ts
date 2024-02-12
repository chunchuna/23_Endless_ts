import {ConstructSystem} from "../utils/ConstructSystem.js";

export class IntroduceTextInstance extends ConstructSystem {

    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        IntroduceTextInstance.GetInstance(runtime)!.isVisible = false;

    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
    }

    private static GetInstance(runtime: IRuntime) {
        return runtime.objects.ControlIntroductionText.getFirstInstance();
    }

    private static SetContent(runtime: IRuntime, Content: string) {
        var Instance = this.GetInstance(runtime)!;
        Instance.text = Content;

    }


}