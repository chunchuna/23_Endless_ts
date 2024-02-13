import {ConstructSystem} from "./ConstructSystem.js";

export class EventSystem extends ConstructSystem {
    static get EventHandlerInstanceClass(): any {
        return this._EventHandlerInstanceClass;
    }

    static set EventHandlerInstanceClass(value: any) {
        this._EventHandlerInstanceClass = value;
    }

    /** var **/
    private static _EventHandlerInstanceClass = null;

    async Init(runtime: IRuntime): Promise<void> {
        super.Init(runtime);
        /** must frist set up **/
        EventSystem.SetInstanceClass(runtime);

        /** init **/
        EventSystem.Event(runtime);


        /** example
         var e = EventSystem.CreatEvent(runtime, "OnGameSatrt")
         EventSystem.DispEvent(runtime, e)
         **/
    }

    Update(runtime: IRuntime) {
        super.Update(runtime);
    }

    private static Event(runtime: IRuntime) {
        /** example
         EventSystem.TouchEvent(runtime, "OnGameSatrt", (e: any) => {
            console.log("game start")
        })
         **/
    }

    private static SetInstanceClass(runtime: IRuntime) {
        this.EventHandlerInstanceClass = runtime.objects.EventHnadler;
    }


    public static CreatEvent(runtime: IRuntime, EventName: string) {

        //var C3 = runtime.callFunction("Function->GetC3");
        var EventIns = new C3.Event(EventName);
        return EventIns
    }

    public static DispEvent(runtime: IRuntime, Event: any) {
        var EventInstance = this.EventHandlerInstanceClass.getFirstInstance();
        EventInstance.dispatchEvent(Event);

    }

    public static async TouchEvent(runtime: IRuntime, EventName: string, Function: any) {
        var EventHandlerInstance = this.EventHandlerInstanceClass.getFirstInstance();
        if (EventHandlerInstance == null || EventHandlerInstance == undefined) {
            console.error("Can Not Get EventHandlerInstance,Plaease Set Up an EventHandler Instance in game")
        }
        await EventHandlerInstance.addEventListener(EventName, (e: any) => [
            Function(e)
        ])
    }
}