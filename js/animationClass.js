import * as animationList from "./animationlist.js";

export class animation{
    constructor(_animationName = ""){

        this.frameDataListClasses = [];

        this.animationData = {
            name: _animationName,
            chain: 0,
            frameDataList: []
        }

        this.hoverListener;
        this.listener;

        this.accordionElement;
        this.headElement;
        this.dropdownElement;
        this.inputElement;
        this.accordionBodyElement;
    }

    resetAnim = (_animationName) => {
        this.headElement.classList.remove('list-item-active');
        this.animationData.name = _animationName;
        this.animationData.chain = 0;
        this.inputElement.value = _animationName;
        this.dropdownElement.checked = false;
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

    triggerListener = () => {
        this.listener();
    }

    copyFrames = (animationClass) => {
        let frameCopies = [];
        for(let x = 0 ; x < this.frameDataListClasses.length;x++){
            let travFrame = this.frameDataListClasses[x];
            let tempFrame;
            if(animationList.garbageFrames.length > 0){
                tempFrame = animationList.garbageFrames.pop()[0];
                tempFrame.resetFrame(animationClass, travFrame.image.src, travFrame.frameData.name);
            }else{
                tempFrame = new frame(animationClass, travFrame.image.src, travFrame.frameData.name);
                animationList.buildFrameContainer(travFrame);
            }

            const primaryCallback = (key) => {
                tempFrame.frameData[key] = travFrame.frameData[key];
            }

            const secondaryCallback = (primaryKey, secondaryKey) => {
                tempFrame.frameData[primaryKey][secondaryKey] = travFrame.frameData[primaryKey][secondaryKey];
            }

            animationList.objectLooper(travFrame.frameData, 1, Object.keys(travFrame.frameData).length-1, primaryCallback, secondaryCallback);

            tempFrame.pasteHitboxes(travFrame.copyHitboxes(tempFrame));
            frameCopies.push(tempFrame);
        }

        return frameCopies;
    }

    pasteFrames = (frameList) => {
        for(let x = 0; x < frameList.length;x++){
            this.addFrameData(frameList[x]);
            this.accordionBodyElement.appendChild(frameList[x].parentElement);
        }
    }
}