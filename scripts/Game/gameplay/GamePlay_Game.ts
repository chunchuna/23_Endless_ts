/**
 * 在每一帧更新游戏状态和逻辑
 * @param {IRuntime} runtime - 游戏运行时对象
 */
export function Tick(runtime: IRuntime) {
    PlayerMoveByWASD(runtime);
    FixControlIntroductionText(runtime);
    BuildingModeMoveBuildingToLayer(runtime);
    Wall1StateSwitch(runtime);
    //BuildingWall2AWLASSetTop(runtime);
}
/**
 * 当布局开始时执行的函数
 * @param {IRuntime} runtime - 游戏运行时对象
 */
export function OnLayoutStrat(runtime: IRuntime) {
    console.log("debug tool run");
    YsortInit(runtime);
    BuildingAddWall(runtime);
    CollectableInit(runtime);
}

/**
 * 
 *   ██████╗ ██████╗ ██╗   ██╗███████╗██╗   ██╗███████╗
 *  ██╔════╝██╔═══██╗██║   ██║██╔════╝██║   ██║██╔════╝
 *  ██║     ██║   ██║██║   ██║███████╗██║   ██║███████╗
 *  ██║     ██║   ██║██║   ██║╚════██║██║   ██║╚════██║
 *  ╚██████╗╚██████╔╝╚██████╔╝███████║╚██████╔╝███████║
 *   ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝
 * 
 */

function PlayerMoveByWASD(runtime: IRuntime) {
    const PlayerInstance = runtime.objects.player.getFirstInstance();
    const PlayerInstanceSimulMover = PlayerInstance?.behaviors["8方向"];
    if (runtime.keyboard?.isKeyDown("KeyA")) {
        PlayerInstanceSimulMover?.simulateControl("left");
    }
    if (runtime.keyboard?.isKeyDown("KeyD")) {
        PlayerInstanceSimulMover?.simulateControl("right");
    }
    if (runtime.keyboard?.isKeyDown("KeyW")) {
        PlayerInstanceSimulMover?.simulateControl("up");
    }
    if (runtime.keyboard?.isKeyDown("KeyS")) {
        PlayerInstanceSimulMover?.simulateControl("down");
    }
}
/**
 * 控制介绍文本修改
 * @param {IRuntime} runtime - 游戏运行时对象
 */
function FixControlIntroductionText(runtime: IRuntime) {
    // 获取控制介绍文本实例
    const ControlIntroductionTextInstance: ITextInstance | null = runtime.objects.ControlIntroductionText.getFirstInstance();
    // 定义不同模式下的文本内容
    const StringGroup = {
        BuildingMode: "[icon=mouse] [color=red]MOUSE[/color] drag drag and move editable buildings \n [icon=mouse][color=red] MOUSE[/color] double click delete buildings",
        NormalMode: "[icon=wasd] [color=red]WASD[/color] move character \n [icon=mouse] [color=red]MOUSE[/color] wheel zoom lens"
    };
    // 获取当前是否处于建筑模式
    const ISBuildingMode = runtime.globalVars.ISBuildingMode;
    // 根据当前模式设置控制介绍文本内容
    if (ISBuildingMode) {
        // 如果处于建筑模式，设置文本为建筑模式的内容
        if (ControlIntroductionTextInstance) {
            ControlIntroductionTextInstance.text = StringGroup.BuildingMode;
        }
    } else {
        // 如果不处于建筑模式，设置文本为普通模式的内容
        if (ControlIntroductionTextInstance) {
            ControlIntroductionTextInstance.text = StringGroup.NormalMode;
        }
    }
}
/**
 * 在玩家位置添加墙壁
 * @param {IRuntime} runtime - 游戏运行时对象
 */
async function BuildingAddWall(runtime: IRuntime) {
    const Wall1Class = runtime.objects.wall;
    const Wall2Class = runtime.objects.wall2;
    const PlayerInstance = runtime.objects.player.getFirstPickedInstance();
    const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
    // 监听按键事件，按下数字键2时在玩家位置创建墙壁2
    await (EventHnadlerInstance?.addEventListener as any)("keyPress_Num2", () => {
        if (PlayerInstance) {
            Wall2Class.createInstance("Wall", PlayerInstance.x + 10, PlayerInstance.y + 10, false);
        }
    });
    // 监听按键事件，按下数字键1时在玩家位置创建墙壁1
    await (EventHnadlerInstance?.addEventListener as any)("keyPress_Num1", () => {
        if (PlayerInstance) {
            Wall1Class.createInstance("Wall", PlayerInstance.x + 10, PlayerInstance.y + 10, false);
        }
    });
}

/**
 * 建筑模式时高亮显示可以编辑的建筑物
 */
function BuildingModeMoveBuildingToLayer(runtime: IRuntime) {
    // 获取是否处于建筑模式
    const ISBuildingMode = runtime.globalVars.ISBuildingMode;
    // 获取所有建筑实例
    const BuildingGroup = runtime.objects.BuildingGroup.instances();
    // 获取玩家实例
    const PlayerInstance = runtime.objects.player.getFirstInstance();
    // 获取名为"BuildingLayer"的图层
    let BuildingLayer = runtime.getLayout("Game").getLayer("BuildingLayer");
    // 如果处于建筑模式
    if (ISBuildingMode) {
        // 将建筑图层设置为可见
        if (BuildingLayer) {
            BuildingLayer.isVisible = true;
            // 将所有建筑移动到建筑图层并置于顶层
            for (let BuildingGroups of BuildingGroup) {
                BuildingGroups.moveToLayer(BuildingLayer);
                BuildingGroups.moveToTop();
            }
        }
    } else {
        // 如果不处于建筑模式
        if (BuildingLayer) BuildingLayer.isVisible = false;
        // 将建筑移回各自的本地图层
        for (let BuildingGroups of BuildingGroup) {
            for (let ysortGroups of runtime.objects.YsortGroup.instances()) {
                const theseLocalLayer = runtime.getLayout("Game").getLayer(ysortGroups.instVars["LocalLayerName"]);
                if (theseLocalLayer) ysortGroups.moveToLayer(theseLocalLayer);
            }
        }
    }
}
/**
 * 
 * 2类墙壁始终保持在最前层
 */
function BuildingWall2AWLASSetTop(runtime: IRuntime) {
    const ISBuildingMode = runtime.globalVars.ISBuildingMode;
    if (ISBuildingMode) {
        if (ISBuildingMode == true) {
            for (let Wall2s of runtime.objects.wall2.instances()) {
                Wall2s.moveToTop();
                for (let wall1 of runtime.objects.wall.instances()) {
                    if (Wall2s.testOverlap(wall1)) {
                        Wall2s.moveToTop();
                    }
                }
            }
        }
    }
}
/**
 * 墙壁1类型针对不同情况下，碰撞框类型的调整
 */
function Wall1StateSwitch(runtime: IRuntime) {
    const PlayerInstance: InstanceType.player | null = runtime.objects.player.getFirstInstance();
    const ISBuildingMode: boolean = runtime.globalVars.ISBuildingMode;
    for (let wall1 of runtime.objects.wall.instances()) {
        if (wall1 && PlayerInstance != null) {
            if (wall1.y < PlayerInstance.y) {
                wall1.setAnimation("UptoPlayer");
            }
            if (wall1.y > PlayerInstance.y) {
                wall1.setAnimation("DownPlayer");
            }
            if (ISBuildingMode) {
                wall1.setAnimation("BuildingMode");
            }
        }
    }
}
/**
 * 初始化Y排序组件
 * @param {IRuntime} runtime - 游戏运行时对象
 */
function YsortInit(runtime: IRuntime) {
    // 获取所有Y排序组件实例
    const YsortGroupClass = runtime.objects.YsortGroup.instances();
    // 遍历所有Y排序组件实例
    for (let YsortGroups of YsortGroupClass) {
        // 将本地图层名称存储到实例变量中
        YsortGroups.instVars["LocalLayerName"] = YsortGroups.layer.name;
    }
    // 监听Y排序组件实例创建事件
    runtime.objects.YsortGroup.addEventListener("instancecreate", (e) => {
        // 将本地图层名称存储到新创建的实例变量中
        e.instance.instVars["LocalLayerName"] = e.instance.layer.name;
    });
}
function CollectableGrouptick(runtime: IRuntime) {
}
/**
 * 初始化可收集物品
 * @param {IRuntime} runtime - 游戏运行时对象
 */
async function CollectableInit(runtime: IRuntime) {
    // 获取事件处理器实例
    const EventHnadlerInstance = runtime.objects.EventHnadler.getFirstPickedInstance();
    // 鼠标悬浮在上面时改变鼠标样式
    await (EventHnadlerInstance?.addEventListener as any)("OnMouseOverCollectableGroup", () => {
        document.body.style.cursor = 'pointer';
    });
    // 点击收集物品时触发事件
    await (EventHnadlerInstance?.addEventListener as any)("OnMouseClickOneceCollectableGroup", (e: any) => {
        // 获取被点击的可收集物品实例
        const getCollectableStuff: InstanceType.CollectableGroup = e.detail[0];
        // 检查距离是否在有效范围内
        if (getCollectableStuff.instVars["Distance"] > runtime.globalVars.CollectableEffectiveRange) return;
        // 减少可收集物品的健康值
        if (getCollectableStuff.instVars["Heath"] > 0) {
            getCollectableStuff.instVars["Heath"] -= 1;
        } else if (getCollectableStuff.instVars["Heath"] <= 0) {
            // 如果健康值小于等于0，销毁可收集物品
            getCollectableStuff.destroy();
        }
    });
}
