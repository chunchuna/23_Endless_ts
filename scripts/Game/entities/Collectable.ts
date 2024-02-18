import {ConstructSystem} from "../utils/ConstructSystem.js";
import {DebugMessage, MesType} from "./DebugMessage.js";

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

        await runtime.objects.CollectableGroup.addEventListener("instancedestroy", (e) => {
            this.OnCollectDestory(runtime, e)
        })

    }

    private static OnMouseClickColGroup(runtime: IRuntime, e: any) {
        this.HitCollectOnece(runtime, e.detail[0]);

    }

    private static OnMouseOverColGroup(runtime: IRuntime) {
        document.body.style.cursor = 'pointer';

    }

    private static OnCollectDestory(runtime: IRuntime, e: any) {
        this.CreatGiftForCollecting(runtime, e);

    }


    /** Function **/

    private static CollectHeath(runtime: IRuntime, Collect: InstanceType.CollectableGroup, newHeath?: number): number | void {
        if (newHeath !== undefined) {
            // Setter
            Collect.instVars.Heath = newHeath;
        } else {
            // Getter
            return Collect.instVars.Heath;
        }
    }

    private static GetCollectDistance(runtime: IRuntime, Collect: InstanceType.CollectableGroup) {
        return Collect.instVars.Distance;
    }

    private static HitCollectOnece(runtime: IRuntime, Collect: InstanceType.CollectableGroup) {

        var Distance = this.GetCollectDistance(runtime, Collect)!;
        var Heath = this.CollectHeath(runtime, Collect)!;

        if (Distance > runtime.globalVars.CollectableEffectiveRange) {
            return;
        }

        if (Heath > 0) {
            this.CollectableStuffShakeOnece(runtime, Collect)
            var newHeath = Heath - runtime.globalVars.CollectablePlayerDmg;
            this.CollectHeath(runtime, Collect, newHeath);
        }

        if (Heath <= 0) {
            Collect.destroy()
            DebugMessage.sm("Collect destroyed", MesType.Warm)
        }
        DebugMessage.sm("Hit Collect Onece", MesType.Warm)


    }

    private static CreatGiftForCollecting(runtime: IRuntime, Collect: InstanceType.CollectableGroup) {

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