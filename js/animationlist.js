import { frame } from "./frameClass.js";
import { animation } from "./animationClass.js";
import { displayInJson } from "./jsonOutput.js";

export let animationListData = [];
export let animationListClasses = [];
export let animationIndex = 0;
export let currentFrame = null;
export let currentAnimation = null;

export let animationListElem;
export let hitboxListElem;
export let frameDataElem;
export let frameDataInputElems = [];

export const initialize = () => {
    animationListElem = document.getElementById('animation-list')
    hitboxListElem = document.getElementById('hitbox-list');
    frameDataElem = document.getElementById('frame-data-list');

    for(let x = 0; x < frameDataElem.childElementCount;x++){
        frameDataInputElems.push(frameDataElem.children[x].firstElementChild);
    }

    buildFrameDataInput();
}

export const setCurrentFrame = (frame = null) => {
    currentFrame = frame;
}

export const setCurrentAnim = (animation = null) => {
    currentAnimation = animation;
}

export const addToList = (animation) => {
    animationListClasses.push(animation);
    animationListData.push(animation.animation);
}

export const removeFromList = (animation) => {
    let index = animationListClasses.findIndex(i => i == animation);
    animationListData.splice(index, 1);
    animationListClasses.splice(index, 1);
    animationIndex--;
}

export const buildAnimationSprite = (imageArray) => {
    let animation = new animation(animationIndex);
    animation.addTableRow(animationListElem);
    addToList(animation);
    animationIndex++;

    for(let x = 0; x < imageArray.length;x++){
        let picture = new FileReader();
        picture.addEventListener('load', (e)=>{
            let newImage = e.target.result;
            let frameData = new frame(animation, newImage, imageArray[x].name);
            animation.addFrameData(frameData);
            frameData.addTableRow(animationListElem, hitboxListElem, frameDataInputElems);
        });
        picture.readAsDataURL(imageArray[x]);
        
    }
}

const buildFrameDataInput = () => {
    let frameDataInputListen = (value) => {
        let thisFrame = currentFrame;
        
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
    let tempFrame = new frame();
    let tempFrameData = tempFrame.frameData;
    let primeObjectKeys = Object.keys(tempFrame.frameData);
    
    for(let y = 0;y < frameDataInputElems.length;){
        let primeKey = primeObjectKeys[x];
        switch(tempFrameData[primeKey] instanceof Object){
            case true:
                let secondaryKeys = Object.keys(tempFrameData[primeKey]);
                
                for(let z = 0; z < secondaryKeys.length;z++){
                    let input = frameDataInputElems[y];
                    let secondaryKey = secondaryKeys[z];
                    input.addEventListener("input", () => {
                        let number = frameDataInputListen(input.value);
                        currentFrame.frameData[primeKey][secondaryKey] = number;
                        input.value = number;
                        displayInJson();
                    });
                    y++;
                }
                x++;    
            ;break;
            case false:
                let input = frameDataInputElems[y];
                input.addEventListener('input', () => {
                    let number = frameDataInputListen(input.value);
                    currentFrame.frameData[primeKey] = number;
                    input.value = number;
                    displayInJson();
                });
                y++;
                x++;
            ;break;
        }
    }
}