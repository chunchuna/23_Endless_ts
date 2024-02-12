import { ConstructSystem } from "../utils/ConstructSystem.js";
export class IntroduceTextInstance extends ConstructSystem {
    async Init(runtime) {
        super.Init(runtime);
        IntroduceTextInstance.GetInstance(runtime).isVisible = false;
    }
    Update(runtime) {
        super.Update(runtime);
    }
    static GetInstance(runtime) {
        return runtime.objects.ControlIntroductionText.getFirstInstance();
    }
    static SetContent(runtime, Content) {
        var Instance = this.GetInstance(runtime);
        Instance.text = Content;
    }
}
