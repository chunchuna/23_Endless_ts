
export class Collectable {
    public static Update(runtime: IRuntime) {
    }



    public static async Init(runtime: IRuntime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("OnMouseOverCollectableGroup", () => {
            document.body.style.cursor = 'pointer';
        });

        await (EventHnadlerInstance?.addEventListener as any)("OnMouseClickOneceCollectableGroup", (e: any) => {
            const getCollectableStuff: InstanceType.CollectableGroup = e.detail[0];
            if (getCollectableStuff.instVars["Distance"] > runtime.globalVars.CollectableEffectiveRange) return;
            if (getCollectableStuff.instVars["Heath"] > 0) {
                getCollectableStuff.instVars["Heath"] -= 1;
                Collectable.CollectableStuffShakeOnece(runtime, getCollectableStuff);
            } else if (getCollectableStuff.instVars["Heath"] <= 0) {
                getCollectableStuff.destroy();
            }
        });
    }



    private static CollectableStuffShakeOnece(runtime: IRuntime, CollectableInstance: InstanceType.CollectableGroup) {
        const Instance = CollectableInstance;
        if (!Instance) return;
        const ShakeBehavior = Instance.behaviors.ShakeSine;
        if (ShakeBehavior) {
            ShakeBehavior.isEnabled = true;
            setTimeout(() => {
                ShakeBehavior.isEnabled = false;
            }, 500);
        } else {
            console.log("not shake behaviors")
        }

    }
}