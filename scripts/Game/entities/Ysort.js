export class ObjectYsort {
    static YsortInit(runtime) {
        const YsortGroupClass = runtime.objects.YsortGroup.instances();
        for (let YsortGroups of YsortGroupClass) {
            YsortGroups.instVars["LocalLayerName"] = YsortGroups.layer.name;
        }
        runtime.objects.YsortGroup.addEventListener("instancecreate", (e) => {
            e.instance.instVars["LocalLayerName"] = e.instance.layer.name;
        });
    }
}
