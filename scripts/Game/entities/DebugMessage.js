import { ConstructSystem } from "../utils/ConstructSystem.js";
import { EventSystem } from "../utils/EventSystem.js";
/** Message Type define **/
export var MesType;
(function (MesType) {
    MesType[MesType["Normal"] = 0] = "Normal";
    MesType[MesType["Error"] = 1] = "Error";
    MesType[MesType["Warm"] = 2] = "Warm";
})(MesType || (MesType = {}));
export class DebugMessage extends ConstructSystem {
    static get MaxQueueMessageCount() {
        return this._MaxQueueMessageCount;
    }
    static set MaxQueueMessageCount(value) {
        this._MaxQueueMessageCount = value;
    }
    static get FirstMessageStartPosition() {
        return this._FirstMessageStartPosition;
    }
    static set FirstMessageStartPosition(value) {
        this._FirstMessageStartPosition = value;
    }
    static get MessagePositionInterval() {
        return this._MessagePositionInterval;
    }
    static set MessagePositionInterval(value) {
        this._MessagePositionInterval = value;
    }
    static get MessageInstanceClass() {
        return this._MessageInstanceClass;
    }
    static set MessageInstanceClass(value) {
        this._MessageInstanceClass = value;
    }
    static get MessageQueenList() {
        return this._MessageQueenList;
    }
    static set MessageQueenList(value) {
        this._MessageQueenList = value;
    }
    /** var **/
    static _MaxQueueMessageCount = 50;
    static _FirstMessageStartPosition = [22, 1021];
    static _MessagePositionInterval = 40;
    static _MessageQueenList = [];
    /** Message INstance Class **/
    static _MessageInstanceClass = null;
    /** system **/
    static runtime = null;
    async Init(runtime) {
        super.Init(runtime);
        DebugMessage.runtime = runtime;
        DebugMessage.Event(runtime);
        DebugMessage.SetInstanceClass(runtime);
        //DebugMessage.ClearAllMessagesInQueue()
    }
    Update(runtime) {
        //super.Update(runtime);
    }
    static async Event(runtime) {
        await EventSystem.TouchEvent(runtime, "OnDebugMessageSend", (e) => {
            this.OnDebugMessageSend(runtime, e);
        });
    }
    /** Event **/
    static OnDebugMessageSend(runtime, e) {
    }
    /** Funtion **/
    static SetInstanceClass(runtime) {
        this.MessageInstanceClass = runtime.objects.DebugMessageText;
    }
    static SeedMessage(runtime, Content, Type) {
        var MessageInstance = this.CreateMessageInstance(runtime, Type, Content);
        this.AddMessageInstanceToQueen(runtime, MessageInstance);
        var Event = EventSystem.CreatEvent(runtime, "OnDebugMessageSend");
        EventSystem.DispEvent(runtime, Event);
    }
    static sm(Content, Type = MesType.Error) {
        if (DebugMessage.runtime)
            this.SeedMessage(DebugMessage.runtime, Content, Type);
    }
    static CreateMessageInstance(runtime, Type, Content) {
        if (this.MessageInstanceClass == null) {
            this.SetInstanceClass(runtime);
        }
        var MessageInstance = this.MessageInstanceClass.createInstance("DebugMessage", 0, 0);
        MessageInstance.text = this.StandMessage(runtime, Content, Type);
        return MessageInstance;
    }
    static ColorMessage(runtime, Content, type) {
        if (type === MesType.Normal) {
            Content = "[color=yellow]" + Content;
        }
        if (type === MesType.Error) {
            Content = "[color=red]" + Content;
        }
        if (type === MesType.Warm) {
            Content = "[color=orange]" + Content;
        }
        return Content;
    }
    static DateMessage(runtiume, Content) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 月份从 0 开始，需要加 1
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        var DateSet = hours + ":" + minutes + ":" + seconds;
        var ContentWithDate = "「" + DateSet + "」 " + Content;
        console.log(ContentWithDate);
        return ContentWithDate;
    }
    static StandMessage(runtime, Content, Type) {
        var ColorMessageContent = this.ColorMessage(runtime, Content, Type);
        var DateMessageContent = this.DateMessage(runtime, ColorMessageContent);
        var FinalMessageContent = DateMessageContent;
        //DebugMessage.SeedMessage(runtime, "stand message", MesType.Warm)
        return FinalMessageContent;
    }
    static AddMessageInstanceToQueen(runtime, MessageInstance) {
        var QueenLength = this.GetMessageQueueInstanceCount();
        if (QueenLength > this.MaxQueueMessageCount) {
            /** 删除最早加入的messageinstance **/
            var EarliestInstance = this.MessageQueenList[0];
            if (EarliestInstance == null)
                return;
            this.MessageQueenList.shift();
            EarliestInstance.destroy();
            this.MoveAllMessageInstanceUpOnece(runtime);
            this.SetMessageInstanceToFristPosition(runtime, MessageInstance);
        }
        if (QueenLength < this.MaxQueueMessageCount) {
            this.MoveAllMessageInstanceUpOnece(runtime);
            this.SetMessageInstanceToFristPosition(runtime, MessageInstance);
        }
        this.MessageQueenList.push(MessageInstance);
    }
    static SetMessageInstanceToFristPosition(runtime, MessageInstance) {
        MessageInstance.x = this.FirstMessageStartPosition[0];
        MessageInstance.y = this.FirstMessageStartPosition[1];
    }
    static MoveAllMessageInstanceUpOnece(runtime) {
        this.MessageQueenList.forEach(MessageInstance => {
            this.MessageMoveUpOnce(runtime, MessageInstance);
        });
    }
    static GetMessageQueueInstanceCount() {
        return this.MessageQueenList.length;
    }
    static ClearAllMessagesInQueue() {
        this.MessageQueenList.forEach(MessageInstance => {
            MessageInstance.destroy();
        });
        this.MessageQueenList = [];
    }
    static MessageMoveUpOnce(runtime, MessageInstance) {
        MessageInstance.y -= this.MessagePositionInterval;
    }
}
