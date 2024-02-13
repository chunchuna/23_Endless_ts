import { ConstructSystem } from "./ConstructSystem.js";
export class EventSystem extends ConstructSystem {
    static get EventHandlerInstanceClass() {
        return this._EventHandlerInstanceClass;
    }
    static set EventHandlerInstanceClass(value) {
        this._EventHandlerInstanceClass = value;
    }
    /** var **/
    static _EventHandlerInstanceClass = null;
    async Init(runtime) {
        super.Init(runtime);
        EventSystem.SetInstanceClass(runtime);
        EventSystem.Event(runtime);
        /** example
         var e = EventSystem.CreatEvent(runtime, "OnGameSatrt")
         EventSystem.DispEvent(runtime, e)
         **/
    }
    Update(runtime) {
        super.Update(runtime);
    }
    static Event(runtime) {
        EventSystem.TouchEvent(runtime, "OnGameSatrt", (e) => {
            console.log("game start");
        });
    }
    static SetInstanceClass(runtime) {
        this.EventHandlerInstanceClass = runtime.objects.EventHnadler;
    }
    static CreatEvent(runtime, EventName) {
        //var C3 = runtime.callFunction("Function->GetC3");
        var EventIns = new C3.Event(EventName);
        return EventIns;
    }
    static DispEvent(runtime, Event) {
        var EventInstance = this.EventHandlerInstanceClass.getFirstInstance();
        EventInstance.dispatchEvent(Event);
    }
    static async TouchEvent(runtime, EventName, Function) {
        await this.EventHandlerInstanceClass.getFirstInstance().addEventListener(EventName, (e) => [
            Function(e)
        ]);
    }
}
