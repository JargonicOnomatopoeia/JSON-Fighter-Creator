import { Frame } from "./frame.js";
import { Animation } from "./animation.js";
import { DisplayInJson } from "./JSONOutput.js";

export let animationList = null;

export const AnimationListInit = () => {
    animationList = new AnimationList();
}

class AnimationList{
    constructor(){
        this.animationListData = [];
        this.animationList = [];
        this.animationIndex = 0;
        this.currentFrame = null;
        this.currentAnimation = null;
        this.animationListElem = document.getElementById('animation-list')
        this.hitboxListElem = document.getElementById('hitbox-list');
        let frameDataElem = document.getElementById('frame-data-list');

        this.frameDataInputElems = [];

        for(let x = 0; x < frameDataElem.childElementCount;x++){
            this.frameDataInputElems.push(frameDataElem.children[x].firstElementChild);
        }

        this.BuildFrameDataInput();
    }

    AddToList = (animation) => {
        this.animationList.push(animation);
        this.animationListData.push(animation.animation);
    }

    RemoveFromList = (animation) => {
        let index = this.animationList.findIndex(i => i == animation);
        delete this.animationListData.splice(index, 1);
        this.animationList.splice(index, 1).forEach(i => i.DeleteThis());
        this.animationIndex--;
    }

    BuildAnimationSprite = (imageArray) => {
        let animation = new Animation(this.animationIndex);
        animation.AddTableRow(this.animationListElem);
        this.AddToList(animation);
        this.animationIndex++;

        for(let x = 0; x < imageArray.length;x++){
            let picture = new FileReader();
            picture.addEventListener('load', (e)=>{
                let newImage = e.target.result;
                let frameData = new Frame(animation, newImage, imageArray[x].name);
                animation.AddFrameData(frameData);
                frameData.AddTableRow(this.animationListElem, this.hitboxListElem, this.frameDataInputElems);
            });
            picture.readAsDataURL(imageArray[x]);
            
        }
    }

    BuildFrameDataInput = () => {
        let frameDataInputListen = (value) => {
            let thisFrame = this.currentFrame;
            
            if(thisFrame == null){
                return 0;
            }

            let isNumber = parseInt(value);
            
            if(!isNaN(isNumber) && value != ""){
                console.log(isNumber);
                return isNumber;
            }

            if(value == ""){
                return 0;
            }
        }

        let x = 1;
        let tempFrame = new Frame();
        let tempFrameData = tempFrame.frameData;
        let primeObjectKeys = Object.keys(tempFrame.frameData);
        
        for(let y = 0;y < this.frameDataInputElems.length;){
            console.log(this.frameDataInputElems[y])
            let primeKey = primeObjectKeys[x];
            switch(tempFrameData[primeKey] instanceof Object){
                case true:
                    let secondaryKeys = Object.keys(tempFrameData[primeKey]);
                    
                    for(let z = 0; z < secondaryKeys.length;z++){
                        let input = this.frameDataInputElems[y];
                        let secondaryKey = secondaryKeys[z];
                        input.addEventListener("input", () => {
                            let number = frameDataInputListen(input.value);
                            this.currentFrame.frameData[primeKey][secondaryKey] = number;
                            input.value = number;
                            DisplayInJson();
                        });
                        y++;
                    }
                    x++;    
                ;break;
                case false:
                    let input = this.frameDataInputElems[y];
                    input.addEventListener('input', () => {
                        let number = frameDataInputListen(input.value);
                        this.currentFrame.frameData[primeKey] = number;
                        input.value = number;
                        DisplayInJson();
                    });
                    y++;
                    x++;
                ;break;
            }
        }
    }
}