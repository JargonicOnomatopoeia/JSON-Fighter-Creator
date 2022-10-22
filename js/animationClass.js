import * as animationList from "./animationList.js";
import { deleteRow } from "./table.js";

export class animation{
    constructor(_animationName = ""){

        this.frameDataListClasses = [];

        this.animationData = {
            name: _animationName,
            chain: 0,
            frameDataList: []
        }
    }

    addFrameData = (_frameData) => {
        this.frameDataListClasses.push(_frameData);
        this.animationData.frameDataList.push(_frameData.frameData);
    }

    //#region Delete Region
    deleteFrameData = (_frameData) => {
        let index = this.frameDataListClasses.findIndex(i => i == _frameData);
        delete this.animationData.frameDataList.splice(index, 1);
        delete this.frameDataListClasses.splice(index, 1);
    }

    deleteThis = () => {
        //#region DeleteRows
        
        //#endregion
        
        //#region Delete Data
        while(this.frameDataListClasses.length > 0){
            this.deleteFrameData(this.frameDataListClasses[0]);
        }

        animationList.removeFromList(this);
        
        if(animationList.currentAnimation == this){
            animationList.setCurrentAnim();
            console.log(animationList.currentAnimation);
            animationList.setCurrentFrame();
        }

        
        //#endregion
        
    }   
    //#endregion
}