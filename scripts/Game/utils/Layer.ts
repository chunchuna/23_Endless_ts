import {ConstructSystem} from "./ConstructSystem.js";

export class Layer extends ConstructSystem {

    async Init(runtime: IRuntime) {
        super.Init(runtime);
    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
    }

    async Event(runtime: IRuntime) {
    }
    
    /** Fcuntion **/
    public static SetLayerVisibel(runtime: IRuntime, Layer: IAnyProjectLayer | boolean | any, type: boolean) {
        if (Layer instanceof Boolean) {
            console.log("Layer is empty")
        }
        var GetLayer: IAnyProjectLayer = Layer;
        GetLayer.isVisible = type;
    }

    public static GetLayer(runtime: IRuntime, LayerName: string): IAnyProjectLayer | boolean {
        var Layer = runtime.getLayout("Game").getLayer(LayerName);
        if (Layer != undefined)
            return Layer
        else {
            return false
        }

    }
}