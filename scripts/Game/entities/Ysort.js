export class ObjectYsort {
    static Init(runtime) {
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
    static YsortFixbug(runtime) {
        var YsortGroupClass = runtime.objects.YsortGroup.instances();
        for (let YsortGroups of YsortGroupClass) {
            var Layer = runtime.getLayout("Game").getLayer(YsortGroups.instVars["LocalLayerName"]);
            if (Layer)
                YsortGroups.moveToLayer(Layer);
        }
    }
}
