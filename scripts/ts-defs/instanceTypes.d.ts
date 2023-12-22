// NOTE: this file is auto-generated by Construct
declare namespace InstanceType {
	class Ground1 extends ISpriteInstance {
	}
	class __playerBehaviors<InstType> {
		"8DirMove": I8DirectionBehaviorInstance<InstType>;
		MoveShakeSine: ISineBehaviorInstance<InstType>;
		BreathSine: ISineBehaviorInstance<InstType>;
	}
	class player extends ISpriteInstance {
		instVars: {
			ThisY: number,
			LocalLayerName: string
		};
		behaviors: __playerBehaviors<this>;
	}
	class __Ground2Behaviors<InstType> {
		Drag: IDragDropBehaviorInstance<InstType>;
	}
	class Ground2 extends ISpriteInstance {
		instVars: {
			LocalLayer: string
		};
		behaviors: __Ground2Behaviors<this>;
	}
	class __wallBehaviors<InstType> {
		Drag: IDragDropBehaviorInstance<InstType>;
		Solid: ISolidBehaviorInstance<InstType>;
	}
	class wall extends ISpriteInstance {
		instVars: {
			ThisY: number,
			LocalLayerName: string,
			LocalLayer: string
		};
		behaviors: __wallBehaviors<this>;
	}
	class __wall2Behaviors<InstType> {
		Drag: IDragDropBehaviorInstance<InstType>;
		实体: ISolidBehaviorInstance<InstType>;
	}
	class wall2 extends ISpriteInstance {
		instVars: {
			ThisY: number,
			LocalLayerName: string,
			LocalLayer: string
		};
		behaviors: __wall2Behaviors<this>;
	}
	class __MainCameraBehaviors<InstType> {
		CameraFlow: IBehaviorInstance<InstType>;
		MoveTo: IMoveToBehaviorInstance<InstType>;
	}
	class MainCamera extends ISpriteInstance {
		behaviors: __MainCameraBehaviors<this>;
	}
	class Mouse extends IInstance {
	}
	class Browser extends IInstance {
	}
	class Keyboard extends IInstance {
	}
	class BuildingModeMask extends ISpriteInstance {
	}
	class TextIconExport extends ISpriteInstance {
	}
	class Light extends ISpriteInstance {
	}
	class EventHnadler extends ISpriteInstance {
	}
	class __TreeBehaviors<InstType> {
		ShakeSine: ISineBehaviorInstance<InstType>;
		Solid: ISolidBehaviorInstance<InstType>;
	}
	class Tree extends ISpriteInstance {
		instVars: {
			ThisY: number,
			LocalLayerName: string,
			TypeName: string,
			TypeID: number,
			Heath: number,
			GoodsName: string,
			GoodsNumber: number,
			IsRandomQuantity: boolean,
			RandomRangeX: number,
			RandomRangeY: number,
			ParticleName: string,
			Distance: number
		};
		behaviors: __TreeBehaviors<this>;
	}
	class ControlIntroductionText extends ITextInstance {
		effects: {
			BetterOutline: IEffectInstance
		};
	}
	class BuildingModeButton extends IButtonInstance {
	}
	class BuildingModeCreatWall2 extends IButtonInstance {
	}
	class BuildingModeCreatWall1 extends IButtonInstance {
	}
	class __BuildingModeSpButtonBehaviors<InstType> {
		ButtonBreath: ISineBehaviorInstance<InstType>;
	}
	class BuildingModeSpButton extends ISpriteInstance {
		instVars: {
			LocalSizeX: number,
			LocalSizeY: number
		};
		behaviors: __BuildingModeSpButtonBehaviors<this>;
	}
	class YsortGroup extends ISpriteInstance {
		instVars: {
			ThisY: number,
			LocalLayerName: string
		};
	}
	class __BuildingGroupBehaviors<InstType> {
		Drag: IDragDropBehaviorInstance<InstType>;
	}
	class BuildingGroup extends ISpriteInstance {
		instVars: {
			LocalLayer: string
		};
		behaviors: __BuildingGroupBehaviors<this>;
	}
	class __ButtonGroupBehaviors<InstType> {
		ButtonBreath: ISineBehaviorInstance<InstType>;
	}
	class ButtonGroup extends ISpriteInstance {
		instVars: {
			LocalSizeX: number,
			LocalSizeY: number
		};
		behaviors: __ButtonGroupBehaviors<this>;
	}
	class __CollectableGroupBehaviors<InstType> {
		ShakeSine: ISineBehaviorInstance<InstType>;
	}
	class CollectableGroup extends ISpriteInstance {
		instVars: {
			TypeName: string,
			TypeID: number,
			Heath: number,
			GoodsName: string,
			GoodsNumber: number,
			IsRandomQuantity: boolean,
			RandomRangeX: number,
			RandomRangeY: number,
			ParticleName: string,
			Distance: number
		};
		behaviors: __CollectableGroupBehaviors<this>;
	}

}