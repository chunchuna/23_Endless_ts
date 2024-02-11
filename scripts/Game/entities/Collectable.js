import { ConstructSystem } from "../utils/ConstructSystem.js";
export class Collectable extends ConstructSystem {
    Update(runtime) {
    }
    async Init(runtime) {
        Collectable.Event(runtime);
    }
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("OnMouseOverCollectableGroup", () => {
            Collectable.OnMouseOverColGroup(runtime);
        });
        await (EventHnadlerInstance?.addEventListener)("OnMouseClickOneceCollectableGroup", (e) => {
            Collectable.OnMouseClickColGroup(runtime, e);
        });
    }
    static OnMouseClickColGroup(runtime, e) {
        const getCollectableStuff = e.detail[0];
        if (getCollectableStuff.instVars["Distance"] > runtime.globalVars.CollectableEffectiveRange)
            return;
        if (getCollectableStuff.instVars["Heath"] > 0) {
            getCollectableStuff.instVars["Heath"] -= 1;
            Collectable.CollectableStuffShakeOnece(runtime, getCollectableStuff);
        }
        else if (getCollectableStuff.instVars["Heath"] <= 0) {
            getCollectableStuff.destroy();
        }
    }
    static OnMouseOverColGroup(runtime) {
        document.body.style.cursor = 'pointer';
    }
    static CollectableStuffShakeOnece(runtime, CollectableInstance) {
        const Instance = CollectableInstance;
        if (!Instance)
            return;
        const ShakeBehavior = Instance.behaviors.ShakeSine;
        if (ShakeBehavior) {
            ShakeBehavior.isEnabled = true;
            setTimeout(() => {
                ShakeBehavior.isEnabled = false;
            }, 500);
        }
        else {
            console.log("not shake behaviors");
        }
    }
}
