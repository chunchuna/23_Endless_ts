import { ConstructSystem } from "../utils/ConstructSystem.js";
/** Message Type define **/
var MesType;
(function (MesType) {
    MesType[MesType["Normal"] = 0] = "Normal";
    MesType[MesType["Error"] = 1] = "Error";
    MesType[MesType["Warm"] = 2] = "Warm";
})(MesType || (MesType = {}));
export class DebugMessage extends ConstructSystem {
    get FirstMessageStartPosition() {
        return this._FirstMessageStartPosition;
    }
    set FirstMessageStartPosition(value) {
        this._FirstMessageStartPosition = value;
    }
    get MessagePositionInterval() {
        return this._MessagePositionInterval;
    }
    set MessagePositionInterval(value) {
        this._MessagePositionInterval = value;
    }
    get MaxQueueMessageCount() {
        return this._MaxQueueMessageCount;
    }
    set MaxQueueMessageCount(value) {
        this._MaxQueueMessageCount = value;
    }
    /** var **/
    _MaxQueueMessageCount = 50;
    _FirstMessageStartPosition = [0, 0];
    _MessagePositionInterval = 20;
    /** Message INstance Class **/
    MessageInstanceClass = null;
    async Init(runtime) {
        super.Init(runtime);
        DebugMessage.Event(runtime);
    }
    Update(runtime) {
        //super.Update(runtime);
    }
    static async Event(runtime) {
    }
    /** Event **/
    /** Funtion **/
    static SeedMessage(runtime, Content, Type) {
        var MessageInstance = this.CreateMessageInstance(runtime, Type);
        this.AddMessageInstanceToQueen(runtime, MessageInstance);
    }
    static CreateMessageInstance(runtime, Type) {
    }
    static AddMessageInstanceToQueen(runtime, MessageInstance) {
    }
    static GetMessageQueueInstanceCount() {
    }
    static ClearAllMessagesInQueue() {
    }
    static GetAllMessageInstancesInQueen() {
    }
    static MessageMoveUpOnce(runtime, MoveInstance, MessageInstance) {
    }
}
