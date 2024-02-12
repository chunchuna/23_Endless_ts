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
        await runtime.objects.CollectableGroup.addEventListener("instancedestroy", (e) => {
            this.OnCollectDestory(runtime, e);
        });
    }
    static OnMouseClickColGroup(runtime, e) {
        this.HitCollectOnece(runtime, e.detail[0]);
    }
    static OnMouseOverColGroup(runtime) {
        document.body.style.cursor = 'pointer';
    }
    static OnCollectDestory(runtime, e) {
        this.CreatGiftForCollecting(runtime, e);
    }
    /** Function **/
    static CollectHeath(runtime, Collect, newHeath) {
        if (newHeath !== undefined) {
            // Setter
            Collect.instVars.Heath = newHeath;
        }
        else {
            // Getter
            return Collect.instVars.Heath;
        }
    }
    static GetCollectDistance(runtime, Collect) {
        return Collect.instVars.Distance;
    }
    static HitCollectOnece(runtime, Collect) {
        var Distance = this.GetCollectDistance(runtime, Collect);
        var Heath = this.CollectHeath(runtime, Collect);
        if (Distance > runtime.globalVars.CollectableEffectiveRange) {
            return;
        }
        if (Heath > 0) {
            this.CollectableStuffShakeOnece(runtime, Collect);
            var newHeath = Heath - runtime.globalVars.CollectablePlayerDmg;
            this.CollectHeath(runtime, Collect, newHeath);
        }
        if (Heath <= 0) {
            Collect.destroy();
        }
    }
    static CreatGiftForCollecting(runtime, Collect) {
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
