import {ConstructSystem} from "../utils/ConstructSystem.js";

/** Message Type define **/
enum MesType {
    Normal,
    Error,
    Warm,
}


export class DebugMessage extends ConstructSystem {

    get FirstMessageStartPosition(): number[] {
        return this._FirstMessageStartPosition;
    }

    set FirstMessageStartPosition(value: number[]) {
        this._FirstMessageStartPosition = value;
    }

    get MessagePositionInterval(): number {
        return this._MessagePositionInterval;
    }

    set MessagePositionInterval(value: number) {
        this._MessagePositionInterval = value;
    }

    get MaxQueueMessageCount(): number {
        return this._MaxQueueMessageCount;
    }

    set MaxQueueMessageCount(value: number) {
        this._MaxQueueMessageCount = value;
    }


    /** var **/
    private _MaxQueueMessageCount: number = 50;
    private _FirstMessageStartPosition: number[] = [0, 0];
    private _MessagePositionInterval: number = 20;


    /** Message INstance Class **/
    private MessageInstanceClass: any = null;


    public async Init(runtime: IRuntime) {
        super.Init(runtime);
        DebugMessage.Event(runtime);
    }

    public Update(runtime: IRuntime) {
        //super.Update(runtime);
    }

    public static async Event(runtime: IRuntime) {

    }

    /** Event **/


    /** Funtion **/

    public static SeedMessage(runtime: IRuntime, Content: string, Type: MesType) {

        var MessageInstance = this.CreateMessageInstance(runtime, Type)
        this.AddMessageInstanceToQueen(runtime, MessageInstance);

    }

    private static CreateMessageInstance(runtime: IRuntime, Type: MesType) {

    }

    private static AddMessageInstanceToQueen(runtime: IRuntime, MessageInstance: any) {

    }

    private static GetMessageQueueInstanceCount() {

    }

    private static ClearAllMessagesInQueue() {

    }

    private static GetAllMessageInstancesInQueen() {

    }

    private static MessageMoveUpOnce(runtime: IRuntime, MoveInstance: number, MessageInstance: any) {

    }

}