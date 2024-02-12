import { ConstructSystem } from "../utils/ConstructSystem.js";
export class WallInstance extends ConstructSystem {
    static get WallInstanceClass() {
        return this._WallInstanceClass;
    }
    static set WallInstanceClass(value) {
        this._WallInstanceClass = value;
    }
    static get WallMasInstanceClass() {
        return this._WallMasInstanceClass;
    }
    static set WallMasInstanceClass(value) {
        this._WallMasInstanceClass = value;
    }
    static _WallInstanceClass = null;
    static _WallMasInstanceClass = null;
    async Init(runtime) {
        super.Init(runtime);
        WallInstance.Event(runtime);
        WallInstance.SetInstanceClass(runtime);
    }
    Update(runtime) {
        super.Update(runtime);
        WallInstance.WallAnimationUpdate(runtime);
    }
    static async Event(runtime) {
        var EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
        await (EventHnadlerInstance?.addEventListener)("[OnMaskTestOverWall]", (e) => {
            //this.OnMaskTestOverLapWall(runtime, e);
        });
        await (EventHnadlerInstance?.addEventListener)("[OnUnMaskTestOverWall]", (e) => {
            //this.OnUnMaskTestOverlapWall(runtime, e);
        });
    }
    static SetInstanceClass(runtime) {
        WallInstance.WallInstanceClass = runtime.objects.wall;
        WallInstance.WallMasInstanceClass = runtime.objects.WallMask;
    }
    static WallAnimationUpdate(runtime) {
        for (var wallInstance of WallInstance.WallInstanceClass.instances()) {
            for (var wallMaskInstance of WallInstance.WallMasInstanceClass.instances()) {
                if (wallMaskInstance.testOverlap(wallInstance)) {
                    wallInstance.setAnimation("Line");
                    setTimeout(() => {
                        wallInstance.setAnimation("Normal");
                    }, 50);
                }
            }
        }
    }
    static OnWallInstanceBeCreated(runtime) {
    }
    static OnUnMaskTestOverlapWall(runtime, e) {
    }
    static OnMaskTestOverLapWall(runtime, e) {
        var WallInstanceArray = e.wall;
        var MaskWallInstanceArray = e.mask;
        WallInstanceArray.forEach((wallInstance) => {
            MaskWallInstanceArray.forEach((MaskInstance) => {
                var MaskParentWallInstance = MaskInstance.getParent();
                if (wallInstance == MaskParentWallInstance) {
                }
                else {
                    wallInstance.setAnimation("Line");
                    setTimeout(() => {
                        wallInstance.setAnimation("Normal");
                    }, 50);
                }
            });
        });
    }
}
