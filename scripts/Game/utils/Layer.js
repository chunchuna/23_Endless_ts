export class Layer {
    static SetLayerVisibel(runtime, Layer, type) {
        if (Layer instanceof Boolean) {
            console.log("Layer is empty");
        }
        var GetLayer = Layer;
        GetLayer.isVisible = type;
    }
    static GetLayer(runtime, LayerName) {
        var Layer = runtime.getLayout("Game").getLayer(LayerName);
        if (Layer != undefined)
            return Layer;
        else {
            return false;
        }
    }
}
