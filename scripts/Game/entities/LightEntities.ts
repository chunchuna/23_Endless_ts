import {ConstructSystem} from "../utils/ConstructSystem.js";
import {gl_runtime} from "../../main.js";


export class LightEntities extends ConstructSystem {
    static get LightEntitiesClass(): IObjectType<InstanceType.Light> {
        return this._LightEntitiesClass;
    }

    static set LightEntitiesClass(value: IObjectType<InstanceType.Light>) {
        this._LightEntitiesClass = value;
    }


    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        LightEntities.SetInstanceClass()
    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
    }

    private static _LightEntitiesClass: IObjectType<InstanceType.Light>;


    private static SetInstanceClass() {
        this.LightEntitiesClass = gl_runtime.objects.Light;

    }

    public static CreatLightEntities(PosX: number, PosY: number) {
        if (this.LightEntitiesClass == null || this.LightEntitiesClass == undefined) {
            this.SetInstanceClass()
        }
        var NewLightEntities = this.LightEntitiesClass.createInstance("Light", PosX, PosY, true);
        return NewLightEntities;
    }


    public static SetLightEntitiesIntensity(LightE: InstanceType.Light, Intensity: number) {
        if (LightE == null)
            return
        LightE.opacity = Intensity;

    }

    public static SetLightEntitiesColor(LightE: InstanceType.Light, Color: number[]) {
        // Coalor : An array with 3 elements specifying the red, green and blue color filter of the instance, with color values as floats in the 0-1 range.
        if (LightE == null)
            return
        LightE.colorRgb = Color;

    }
}