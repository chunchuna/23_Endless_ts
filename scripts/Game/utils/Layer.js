import { ConstructSystem } from "./ConstructSystem.js";
export class LayerManager extends ConstructSystem {
    async Init(runtime) {
        super.Init(runtime);
    }
    Update(runtime) {
        super.Update(runtime);
    }
    async Event(runtime) {
    }
    /** Fcuntion **/
    static SetLayerVisibel(runtime, Layer, type) {
        if (Layer instanceof Boolean) {
            console.log("Layer is empty");
        }
        var GetLayer = Layer;
        GetLayer.isVisible = type;
    }
    static GetLayer(runtime, LayerName) {
        var Layer = runtime.getLayout("RGame").getLayer(LayerName);
        if (Layer != undefined)
            return Layer;
        else {
            return false;
        }
    }
}
