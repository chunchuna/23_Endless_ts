import {ConstructSystem} from "../utils/ConstructSystem.js";

export class Collectable extends ConstructSystem {

    public Update(runtime: IRuntime) {
    }

    public async Init(runtime: IRuntime) {
        Collectable.Event(runtime);
    }


    public static async Event(runtime: IRuntime): Promise<void> {

        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("OnMouseOverCollectableGroup", () => {
            Collectable.OnMouseOverColGroup(runtime);
        });

        await (EventHnadlerInstance?.addEventListener as any)("OnMouseClickOneceCollectableGroup", (e: any) => {
            Collectable.OnMouseClickColGroup(runtime, e);
        });

    }

    private static OnMouseClickColGroup(runtime: IRuntime, e: any) {
        const getCollectableStuff: InstanceType.CollectableGroup = e.detail[0];
        if (getCollectableStuff.instVars["Distance"] > runtime.globalVars.CollectableEffectiveRange) return;
        if (getCollectableStuff.instVars["Heath"] > 0) {
            getCollectableStuff.instVars["Heath"] -= 1;
            Collectable.CollectableStuffShakeOnece(runtime, getCollectableStuff);
        } else if (getCollectableStuff.instVars["Heath"] <= 0) {
            getCollectableStuff.destroy();
        }

    }

    private static OnMouseOverColGroup(runtime: IRuntime) {
        document.body.style.cursor = 'pointer';

    }


    /** Function **/

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