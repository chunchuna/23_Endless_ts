import { ConstructSystem } from "../utils/ConstructSystem.js";
var YsortGroup = InstanceType.YsortGroup;
import { LayerManager } from "../utils/Layer.js";
import { DebugMessage } from "./DebugMessage.js";
export class ObjectYsort extends ConstructSystem {
    static get YsorGrouptInstanceClass() {
        return this._YsorGrouptInstanceClass;
    }
    static set YsorGrouptInstanceClass(value) {
        this._YsorGrouptInstanceClass = value;
    }
    static _YsorGrouptInstanceClass = null;
    Update(runtime) {
        super.Update(runtime);
    }
    async Init(runtime) {
        super.Init(runtime);
        ObjectYsort.Event(runtime);
        ObjectYsort.SetUpInstanceClass(runtime);
        ObjectYsort.SetAllObjectLayerName(runtime);
    }
    static Event(runtime) {
        runtime.objects.YsortGroup.addEventListener("instancecreate", (e) => {
            this.OnYsortInsrabceBeCreated(runtime, e);
        });
    }
    static OnYsortInsrabceBeCreated(runtime, e) {
        /** 用于记住所有物体的初始图层，在场景开始的时候执行一次。在物体被生存的时候执行一次**/
        e.instance.instVars["LocalLayerName"] = e.instance.layer.name;
    }
    static SetUpInstanceClass(runtime) {
        ObjectYsort._YsorGrouptInstanceClass = runtime.objects.YsortGroup;
    }
    static SetAllObjectLayerName(runtime) {
        /** 用于记住所有物体的初始图层，在场景开始的时候执行一次。在物体被生存的时候执行一次**/
        var YsortGroupClass = ObjectYsort.YsorGrouptInstanceClass.instances();
        for (let YsortGroups of YsortGroupClass) {
            YsortGroups.instVars["LocalLayerName"] = YsortGroups.layer.name;
        }
    }
    static YsortFixbug(runtime) {
        var YsortGroupClass = runtime.objects.YsortGroup.instances();
        for (let YsortGroups of YsortGroupClass) {
            var LayerName = YsortGroups.instVars["LocalLayerName"];
            var Layer = LayerManager.GetLayer(runtime, LayerName);
            if (typeof Layer !== "boolean")
                YsortGroups.moveToLayer(Layer);
            else {
                DebugMessage.sm(LayerName + "Layer is invidl");
            }
        }
    }
}
