import * as animationList from "./animationList.js";

export class animation{
    constructor(_animationName = ""){

        this.frameDataListClasses = [];

        this.animationData = {
            name: _animationName,
            chain: 0,
            frameDataList: []
        }

        this.hoverListener;
        this.accordionElement;
        this.inputElement;
        this.accordionBodyElement;
    }

    resetAnim = (_animationName) => {
        this.animationData.name = _animationName;
        this.animationData.chain = 0;
        this.inputElement.value = _animationName;
        this.hoverListener();
    }

    addFrameData = (_frameData) => {
        this.frameDataListClasses.push(_frameData);
        this.animationData.frameDataList.push(_frameData.frameData);
    }

    //#region Delete Region
    deleteFrameData = (_frameData) => {
        let index = this.frameDataListClasses.findIndex(i => i == _frameData);
        this.frameDataListClasses[index].parentElement.remove();
        this.animationData.frameDataList.splice(index, 1);
        animationList.garbageFrames.push(this.frameDataListClasses.splice(index, 1));
    }

    deleteThis = () => {
        while(this.frameDataListClasses.length > 0){
            this.frameDataListClasses[0].deleteThis();
        }
        if(animationList.currentAnimation == this){
            animationList.setCurrentAnim();
            animationList.setCurrentFrame();
        }
        animationList.removeFromList(this);
        
    }   
    //#endregion
}