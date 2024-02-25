import { ConstructSystem } from "../utils/ConstructSystem.js";
import { gl_runtime } from "../../main.js";
export class LightEntities extends ConstructSystem {
    static get LightEntitiesClass() {
        return this._LightEntitiesClass;
    }
    static set LightEntitiesClass(value) {
        this._LightEntitiesClass = value;
    }
    async Init(runtime) {
        super.Init(runtime);
        LightEntities.SetInstanceClass();
    }
    Update(runtime) {
        super.Update(runtime);
    }
    static _LightEntitiesClass;
    static SetInstanceClass() {
        this.LightEntitiesClass = gl_runtime.objects.Light;
    }
    static CreatLightEntities(PosX, PosY) {
        if (this.LightEntitiesClass == null || this.LightEntitiesClass == undefined) {
            this.SetInstanceClass();
        }
        var NewLightEntities = this.LightEntitiesClass.createInstance("Light", PosX, PosY, true);
        return NewLightEntities;
    }
    static SetLightEntitiesIntensity(LightE, Intensity) {
        if (LightE == null)
            return;
        LightE.opacity = Intensity;
    }
    static SetLightEntitiesColor(LightE, Color) {
        // Coalor : An array with 3 elements specifying the red, green and blue color filter of the instance, with color values as floats in the 0-1 range.
        if (LightE == null)
            return;
        LightE.colorRgb = Color;
    }
}
