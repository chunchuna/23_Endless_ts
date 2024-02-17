import {ConstructSystem} from "../utils/ConstructSystem.js";
import YsortGroup = InstanceType.YsortGroup;

export class ObjectYsort extends ConstructSystem {
    static get YsorGrouptInstanceClass(): any {
        return this._YsorGrouptInstanceClass;
    }

    static set YsorGrouptInstanceClass(value: any) {
        this._YsorGrouptInstanceClass = value;
    }


    private static _YsorGrouptInstanceClass: InstanceType.YsortGroup | any = null;

    Update(runtime: IRuntime) {
        super.Update(runtime);
    }


    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        ObjectYsort.Event(runtime);
        ObjectYsort.SetUpInstanceClass(runtime);
        ObjectYsort.SetAllObjectLayerName(runtime);


    }

    private static Event(runtime: IRuntime) {
        runtime.objects.YsortGroup.addEventListener("instancecreate", (e) => {

            this.OnYsortInsrabceBeCreated(runtime, e);
        });
    }


    private static OnYsortInsrabceBeCreated(runtime: IRuntime, e: any) {
        /** 用于记住所有物体的初始图层，在场景开始的时候执行一次。在物体被生存的时候执行一次**/
        e.instance.instVars["LocalLayerName"] = e.instance.layer.name;

    }

    private static SetUpInstanceClass(runtime: IRuntime) {
        ObjectYsort._YsorGrouptInstanceClass = runtime.objects.YsortGroup;
    }

    private static SetAllObjectLayerName(runtime: IRuntime) {
        /** 用于记住所有物体的初始图层，在场景开始的时候执行一次。在物体被生存的时候执行一次**/

        var YsortGroupClass = ObjectYsort.YsorGrouptInstanceClass.instances();
        for (let YsortGroups of YsortGroupClass) {
            YsortGroups.instVars["LocalLayerName"] = YsortGroups.layer.name;
        }
    }


    public static YsortFixbug(runtime: IRuntime) {
        var YsortGroupClass = runtime.objects.YsortGroup.instances();
        for (let YsortGroups of YsortGroupClass) {
            var Layer: IAnyProjectLayer | null = runtime.getLayout("Game").getLayer(YsortGroups.instVars["LocalLayerName"])
            if (Layer)
                YsortGroups.moveToLayer(Layer);
        }
    }
}
