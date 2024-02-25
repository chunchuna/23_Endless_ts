import {ConstructSystem} from "../utils/ConstructSystem.js";
import {EventSystem} from "../utils/EventSystem.js";


/** Message Type define **/
export enum MesType {
    Normal,
    Error,
    Warm,
}


export class DebugMessage extends ConstructSystem {
    static get MessageTimerDuration(): number {
        return this._MessageTimerDuration;
    }

    static set MessageTimerDuration(value: number) {
        this._MessageTimerDuration = value;
    }


    static get MaxQueueMessageCount(): number {
        return this._MaxQueueMessageCount;
    }

    static set MaxQueueMessageCount(value: number) {
        this._MaxQueueMessageCount = value;
    }

    static get FirstMessageStartPosition(): number[] {
        return this._FirstMessageStartPosition;
    }

    static set FirstMessageStartPosition(value: number[]) {
        this._FirstMessageStartPosition = value;
    }

    static get MessagePositionInterval(): number {
        return this._MessagePositionInterval;
    }

    static set MessagePositionInterval(value: number) {
        this._MessagePositionInterval = value;
    }

    static get MessageInstanceClass(): any {
        return this._MessageInstanceClass;
    }

    static set MessageInstanceClass(value: any) {
        this._MessageInstanceClass = value;
    }


    static get MessageQueenList(): InstanceType.DebugMessageText[] {
        return this._MessageQueenList;
    }

    static set MessageQueenList(value: InstanceType.DebugMessageText[]) {
        this._MessageQueenList = value;
    }

    /** var **/
    private static _MaxQueueMessageCount: number = 50;
    private static _FirstMessageStartPosition: number[] = [22, 1021];
    private static _MessagePositionInterval: number = 40;
    private static _MessageQueenList: InstanceType.DebugMessageText[] = [];

    private static _MessageTimerDuration: number = 50;


    /** Message INstance Class **/
    private static _MessageInstanceClass: IObjectClass<any>;


    /** system **/

    private static runtime: IRuntime | null = null;


    public async Init(runtime: IRuntime) {
        super.Init(runtime);
        DebugMessage.runtime = runtime;
        DebugMessage.Event(runtime);
        DebugMessage.SetInstanceClass(runtime)
        //DebugMessage.ClearAllMessagesInQueue()

    }

    public Update(runtime: IRuntime) {
        //super.Update(runtime);
    }

    public static async Event(runtime: IRuntime) {
        await EventSystem.TouchEvent(runtime, "DebugMessage->OnDebugMessageSend", (e: any) => {
            this.OnDebugMessageSend(runtime, e)
        })

        await this.MessageInstanceClass.addEventListener("instancecreate", (e: any) => {
            this.OnMessageInstanceBeCreated(runtime, e)
        })

        for (var DebuMessages_ of this.MessageInstanceClass.instances()) {
            DebuMessages_.behaviors.Timer.addEventListener("timer", (e: any) => {
                this.OnMessageTimerArrive(runtime, e, DebuMessages_);
            })
        }


    }

    /** Event **/

    private static OnMessageInstanceBeCreated(runtime: IRuntime, e: any) {
        /** todo: if run timer for destory message **/
        //this.SetMessageTimerRun(runtime,e);
        //console.log(e.instance)
        this.SetMessageTimerRun(runtime, e.instance)
    }

    private static OnDebugMessageSend(runtime: IRuntime, e: any) {
    }

    private static OnMessageTimerArrive(runtime: IRuntime, e: any, MessageInstance: InstanceType.DebugMessageText) {
        if (e.tag === "destory") {
            MessageInstance.destroy()
            /**todo: delet from instance list **/
            var MessageQueenList = this.MessageQueenList;
            var InstanceIdinQueen = MessageQueenList.indexOf(MessageInstance);
            if (InstanceIdinQueen != -1) {
                this.MessageQueenList.splice(InstanceIdinQueen, 1);
            }

        }
    }

    /** Funtion **/


    private static SetInstanceClass(runtime: IRuntime) {
        this.MessageInstanceClass = runtime.objects.DebugMessageText;
    }

    public static SeedMessage(runtime: IRuntime, Content: string, Type: MesType) {

        var MessageInstance = this.CreateMessageInstance(runtime, Type, Content)
        this.AddMessageInstanceToQueen(runtime, MessageInstance);

        var Event = EventSystem.CreatEvent(runtime, "DebugMessage->OnDebugMessageSend");
        EventSystem.DispEvent(runtime, Event);


    }

    public static sm(Content: string, Type: MesType = MesType.Error) {
        if (DebugMessage.runtime)
            this.SeedMessage(DebugMessage.runtime, Content, Type);
    }

    private static CreateMessageInstance(runtime: IRuntime, Type: MesType, Content: string) {
        if (this.MessageInstanceClass == null) {
            this.SetInstanceClass(runtime);
        }
        var MessageInstance = this.MessageInstanceClass.createInstance("DebugMessage", 0, 0);
        MessageInstance.text = this.StandMessage(runtime, Content, Type)

        return MessageInstance;
    }

    private static ColorMessage(runtime: IRuntime, Content: string, type: MesType) {
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

    private static DateMessage(runtiume: IRuntime, Content: string) {
        const currentDate: Date = new Date();

        const year: number = currentDate.getFullYear();
        const month: number = currentDate.getMonth() + 1; // 月份从 0 开始，需要加 1
        const day: number = currentDate.getDate();
        const hours: number = currentDate.getHours();
        const minutes: number = currentDate.getMinutes();
        const seconds: number = currentDate.getSeconds();

        var DateSet = hours + ":" + minutes + ":" + seconds
        var ContentWithDate = "「" + DateSet + "」 " + Content;
        return ContentWithDate;

    }

    private static StandMessage(runtime: IRuntime, Content: string, Type: MesType) {
        var ColorMessageContent = this.ColorMessage(runtime, Content, Type);
        var DateMessageContent = this.DateMessage(runtime, ColorMessageContent)
        var FinalMessageContent = DateMessageContent;
        //DebugMessage.SeedMessage(runtime, "stand message", MesType.Warm)

        return FinalMessageContent;
    }


    private static AddMessageInstanceToQueen(runtime: IRuntime, MessageInstance: InstanceType.DebugMessageText) {
        var QueenLength = this.GetMessageQueueInstanceCount()

        if (QueenLength > this.MaxQueueMessageCount) {
            /** 删除最早加入的messageinstance **/
            var EarliestInstance = this.MessageQueenList[0];
            if (EarliestInstance == null) return;
            this.MessageQueenList.shift();
            EarliestInstance.destroy();

            this.MoveAllMessageInstanceUpOnece(runtime);
            this.SetMessageInstanceToFristPosition(runtime, MessageInstance)
        }

        if (QueenLength < this.MaxQueueMessageCount) {
            this.MoveAllMessageInstanceUpOnece(runtime);
            this.SetMessageInstanceToFristPosition(runtime, MessageInstance)
        }

        this.MessageQueenList.push(MessageInstance);


    }

    private static SetMessageInstanceToFristPosition(runtime: IRuntime, MessageInstance: InstanceType.DebugMessageText) {
        MessageInstance.x = this.FirstMessageStartPosition[0];
        MessageInstance.y = this.FirstMessageStartPosition[1];
    }

    private static MoveAllMessageInstanceUpOnece(runtime: IRuntime) {
        this.MessageQueenList.forEach(MessageInstance => {
            this.MessageMoveUpOnce(runtime, MessageInstance);
        })
    }

    private static GetMessageQueueInstanceCount() {
        return this.MessageQueenList.length;
    }

    private static ClearAllMessagesInQueue() {
        this.MessageQueenList.forEach(MessageInstance => {
            MessageInstance.destroy();
        })
        this.MessageQueenList = [];
    }

    private static MessageMoveUpOnce(runtime: IRuntime, MessageInstance: InstanceType.DebugMessageText) {
        MessageInstance.y -= this.MessagePositionInterval;
    }

    private static SetMessageTimerRun(runtime: IRuntime, MessageInstance: InstanceType.DebugMessageText) {
        var Timer = this.GetTimerBehavior(runtime, MessageInstance);
        if (Timer.isTimerRunning("Destroy") == false) {
            Timer.startTimer(this.MessageTimerDuration, "Destory", "once");
            Timer.addEventListener("timer", (e) => {
                this.OnMessageTimerArrive(runtime, e, MessageInstance)
            })
        }

    }

    private static GetTimerBehavior(runtime: IRuntime, MessageInstance: InstanceType.DebugMessageText) {
        var TimerBehavior = MessageInstance.behaviors.Timer;
        return TimerBehavior
    }

}