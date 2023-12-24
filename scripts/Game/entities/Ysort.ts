export class ObjectYsort {

    public static YsortInit(runtime: IRuntime) {
        var YsortGroupClass = runtime.objects.YsortGroup.instances();
        for (let YsortGroups of YsortGroupClass) {
            YsortGroups.instVars["LocalLayerName"] = YsortGroups.layer.name;
        }
        runtime.objects.YsortGroup.addEventListener("instancecreate", (e) => {
            e.instance.instVars["LocalLayerName"] = e.instance.layer.name;
        });
    }

    /*
     �޸�y���������������л���ͬlayerʱ���ֵ�һЩ����
    */
    public static YsortFixbug(runtime: IRuntime) {
        var YsortGroupClass = runtime.objects.YsortGroup.instances();
        for (let YsortGroups of YsortGroupClass) {
            var Layer: IAnyProjectLayer | null = runtime.getLayout("Game").getLayer(YsortGroups.instVars["LocalLayerName"])
            if (Layer)
                YsortGroups.moveToLayer(Layer);
        }
    }
}
