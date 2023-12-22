export class Collectable {
    static CollectableGrouptick(runtime) {
    }
    static async CollectableInit(runtime) {
        const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("OnMouseOverCollectableGroup", () => {
            document.body.style.cursor = 'pointer';
        });
        await (EventHnadlerInstance?.addEventListener)("OnMouseClickOneceCollectableGroup", (e) => {
            const getCollectableStuff = e.detail[0];
            if (getCollectableStuff.instVars["Distance"] > runtime.globalVars.CollectableEffectiveRange)
                return;
            if (getCollectableStuff.instVars["Heath"] > 0) {
                getCollectableStuff.instVars["Heath"] -= 1;
                Collectable.getCollectableStuffShakeOnece(runtime, getCollectableStuff);
            }
            else if (getCollectableStuff.instVars["Heath"] <= 0) {
                getCollectableStuff.destroy();
            }
        });
    }
    static getCollectableStuffShakeOnece(runtime, CollectableInstance) {
        const Instance = CollectableInstance;
        if (!Instance)
            return;
        const ShakeBehavior = Instance.behaviors.ShakeSine;
        console.log("SHAKE");
        if (ShakeBehavior) {
            ShakeBehavior.isEnabled = true;
            setTimeout(() => {
                ShakeBehavior.isEnabled = false;
            }, 500);
        }
    }
}
