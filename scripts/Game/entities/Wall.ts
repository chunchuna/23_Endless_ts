import {ConstructSystem} from "../utils/ConstructSystem.js";

export class WallInstance extends ConstructSystem {
    static get WallInstanceClass(): any {
        return this._WallInstanceClass;
    }

    static set WallInstanceClass(value: any) {
        this._WallInstanceClass = value;
    }

    static get WallMasInstanceClass(): any {
        return this._WallMasInstanceClass;
    }

    static set WallMasInstanceClass(value: any) {
        this._WallMasInstanceClass = value;
    }


    private static _WallInstanceClass = null;
    private static _WallMasInstanceClass = null;

    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        WallInstance.Event(runtime);
        WallInstance.SetUpInstanceClass(runtime);

    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
        WallInstance.WallAnimationUpdate(runtime);
    }

    private static async Event(runtime: IRuntime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();

        await (EventHnadlerInstance?.addEventListener as any)("[OnMaskTestOverWall]", (e: any) => {
            //this.OnMaskTestOverLapWall(runtime, e);
        })

        await (EventHnadlerInstance?.addEventListener as any)("[OnUnMaskTestOverWall]", (e: any) => {
            //this.OnUnMaskTestOverlapWall(runtime, e);
        })


    }


    private static SetUpInstanceClass(runtime: IRuntime) {
        WallInstance.WallInstanceClass = runtime.objects.wall;
        WallInstance.WallMasInstanceClass = runtime.objects.WallMask;
    }

    private static WallAnimationUpdate(runtime: IRuntime) {

        for (var wallInstance of WallInstance.WallInstanceClass.instances()) {
            for (var wallMaskInstance of WallInstance.WallMasInstanceClass.instances()) {
                if (wallMaskInstance.testOverlap(wallInstance)) {
                    wallInstance.setAnimation("Line")
                    setTimeout(() => {
                        wallInstance.setAnimation("Normal")
                    }, 50)
                }
            }
        }

    }


    private static OnWallInstanceBeCreated(runtime: IRuntime) {

    }


    private static OnUnMaskTestOverlapWall(runtime: IRuntime, e: any) {
    }


    private static OnMaskTestOverLapWall(runtime: IRuntime, e: any) {
        

    }


}