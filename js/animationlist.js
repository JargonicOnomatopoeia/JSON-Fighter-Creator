import { frame } from "./frameClass.js";
import { animation } from "./animationClass.js"
import { displayInJson } from "./jsonOutput.js";

export let animationListData = [];
export let animationListClasses = [];
export let animationIndex = 0;
export let currentFrame = null;
export let currentAnimation = null;

export let animationListElem;
export let hitboxListElem;
export let frameDataInputElems;
export let animationDataInputElem;

export const initialize = () => {
    animationListElem = document.getElementById('animation-list');
    hitboxListElem = document.getElementById('hitbox-list');
    frameDataInputElems = document.getElementsByClassName('finput');
    animationDataInputElem = document.getElementsByClassName('ainput')[0];

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
    animationListData.push(animation.animationData);
}

export const removeFromList = (animation) => {
    let index = animationListClasses.findIndex(i => i == animation);
    animationListData.splice(index, 1);
    animationListClasses.splice(index, 1);
    animationIndex--;
}

export const buildAnimationSprite = (imageArray) => {
    let animationTemp = new animation("Animation#"+animationIndex);
    addToList(animationTemp);
    animationIndex++;

    for(let x = 0; x < imageArray.length;x++){
        let picture = new FileReader();
        let image = '';
        picture.addEventListener('load', (e)=>{
            image = e.target.result;
        });
        picture.readAsDataURL(imageArray[x]);
        let frameData = new frame(animationTemp, image, imageArray[x].name);
        animationTemp.addFrameData(frameData);
    }

    buildAccordion(animationTemp);
}

const inputNumCheck = (input, currentObject, callback) => {
    if(currentObject == null){
        input.value = 0;
        return;
    }

    let isNumber = parseInt(input.value);
    
    if(!isNaN(isNumber) && input.value != ""){
        callback(isNumber);
        input.value = isNumber;
        return;
    }

    if(value == ""){
        callback(0);
        input.value = 0;
        return;
    }
}

const objectLooper = (object, start, end, primaryCallback, secondaryCallback) => {
    let primeKeys = Object.keys(object);
    for(let x = start; x < end; x++){
        let primaryKey = primeKeys[x];
        switch(object[primaryKey] instanceof Object){
            case true:
                let secondaryKeys = Object.keys(object[primaryKey]);
                for(let y = 0;y < secondaryKeys.length;y++){
                    let secondaryKey = secondaryKeys[y];
                    secondaryCallback(primaryKey, secondaryKey);
                }
            break;
            case false:
                primaryCallback(primaryKey);
            break;
        }
    }
}

const buildFrameDataInput = () => {
    let data = new frame().frameData;
    let index = 0;
    const primaryCallback = (key) => {
        let frameInput = frameDataInputElems[index];
        frameInput.addEventListener('input', () => {
            inputNumCheck(frameInput, currentFrame, (result) => {
                currentFrame.frameData[key] = result;
            });
        });
        index++;
    }

    const secondaryCallback = (primaryKey, secondaryKey) => {
        let frameInput = frameDataInputElems[index];
        frameInput.addEventListener('input', () => {
            inputNumCheck(frameInput, currentFrame, (result) => {
                currentFrame.frameData[primaryKey][secondaryKey] = result;
            })
        });
        index++;
    }

    objectLooper(data, 1, Object.keys(data).length-1, primaryCallback, secondaryCallback);

    animationDataInputElem.addEventListener('input', () => {
        inputNumCheck(animationDataInputElem, currentAnimation, (number) => {
            currentAnimation.animationData.chain = number;
        });
    });
}

let copiedHitboxes;
//#region DOM Animation List
// Too tired to do a lot of div creation, made a function instead
const buildElem = (className, type='div') =>{
    let elem = document.createElement(type);
    elem.setAttribute('class', className);

    return elem;
}

// Container for the Animation List
const buildAccordion = (animation) => {
    let acc = buildElem('accordion');
    
    //#region Accordion Head
    let accHead = buildElem('accordion-head');
    let itemList = buildElem('list-item');
    accHead.addEventListener('click', () => {
        currentAnimation = animation;
        currentFrame = null;

        animationDataInputElem.value = animation.animationData.chain;
        for(let x = 0; x < frameDataInputElems.length;x++){
            frameDataInputElems[x].value = 0;
        }
        clearHitboxes();
    });

    //For the toggle 
    let arrow = buildElem('icon-arrow-down accordion-arrow', 'i');
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    arrow.appendChild(checkbox);

    //Name of the animation goes here
    let animInput = buildElem('flex-grow', 'input');
    animInput.setAttribute('type', 'text');
    animInput.value = animation.animationData.name;
    animInput.addEventListener('input', () => {
        animation.animationData.name = animInput.value;
    });

    //Copy Animation???
    let copyI = buildElem('icon-copy clickable', 'i');
    let copyTip = buildElem('tooltip');
    copyTip.innerHTML = "Copy";
    copyI.appendChild(copyTip);

    //Delete Animation
    let trashI = buildElem('icon-trash clickable', 'i');
    let trashTip = buildElem('tooltip left');
    trashTip.innerHTML = "Delete";
    trashI.appendChild(trashTip);
    trashI.addEventListener('click', () => {
        animation.deleteThis();
        acc.remove();
    });

    //put them all together
    itemList.appendChild(arrow);
    itemList.appendChild(animInput);
    itemList.appendChild(copyI);
    itemList.appendChild(trashI);

    accHead.appendChild(itemList);
    //#endregion

    //#region Accordion Body
    let frameClasses = animation.frameDataListClasses;
    let accBody = buildElem('accordion-body');

    for(let x = 0; x < frameClasses.length;x++){
        let frameContainer = buildFrameContainer(frameClasses[x]);
        accBody.appendChild(frameContainer);
    }
    //#endregion

    acc.appendChild(accHead);
    acc.appendChild(accBody);

    animationListElem.appendChild(acc);
}

const buildFrameContainer = (frameClass) => {
    let frameContainer = buildElem('list-sub-item');
    
    let frameInput = buildElem('flex-grow', 'input');
    frameInput.setAttribute('type', 'text');
    frameInput.value = frameClass.frameData.name;
    frameInput.addEventListener('input', () => {
        frameClass.frameData.name = frameInput.value;
    });

    //Copy Hitboxes
    let copyHitboxes = buildElem('icon-copy clickable', 'i');
    let copyTip = buildElem('tooltip center-left');
    copyTip.innerHTML = 'Copy Hitboxes';
    copyHitboxes.appendChild(copyTip);
    copyHitboxes.addEventListener('click', () => {
        copiedHitboxes = frameClass.copyHitboxes();
    });

    //Delete Frame
    let trashHitboxes = buildElem('icon-trash clickable', 'i');
    let trashTip = buildElem('tooltip center-left');
    trashTip.innerHTML = 'Delete';
    trashHitboxes.appendChild(trashTip);
    trashHitboxes.addEventListener('click', () => {
        frameClass.deleteThis();
        frameContainer.remove();
    });

    frameContainer.appendChild(frameInput);
    frameContainer.appendChild(copyHitboxes);
    frameContainer.appendChild(trashHitboxes);

    frameContainer.addEventListener('click', () => {
        clearHitboxes();
        currentFrame = frameClass;
        currentAnimation = frameClass.animRef;

        let index = 0;
        let data = frameClass.frameData;
        //Functions that would add the values to the frame data panel
        const primaryCallback = (key) => {
            frameDataInputElems[index].value = data[key];
            index++;
        }

        const secondaryCallback = (primaryKey, secondaryKey) => {
            frameDataInputElems[index].value = data[primaryKey][secondaryKey];
            index++;
        }

        objectLooper(data, 1, Object.keys(data).length-1, primaryCallback, secondaryCallback);
        addCurrentHitboxes();
    });

    return frameContainer;
}
//#endregion

//#region DOM Hitbox List
const buildNumHitbox = (value, callback) => {
    let tableCell = buildElem('table-cell');
    let inputNum = document.createElement('input');
    inputNum.setAttribute('type', 'number');
    inputNum.setAttribute('value', value);
    callback(inputNum);

    tableCell.appendChild(tableCell);

    return tableCell;
}

const buildHitboxRowContainer = (index, hitboxClass, isHurtbox) => {
    
    //#region Container
    let tableRow = document.createElement('div');
    tableRow.id = "hitbox-list-table-row";
    if(isHurtbox){
        tableRow.className = 'hurtbox';
    }
    //#endregion

    //#region Index Column
    let indexCol = buildElem("num-col");
    indexCol.innerHTML = index;
    tableRow.appendChild(indexCol);
    //#endregion
    
    let hitboxData = hitboxClass.hitbox;
    const primaryCallback = (key) => {
        let cell = buildNumHitbox(hitboxData[key], (input) => {
            input.addEventListener('input', () => {
                inputNumCheck(input, currentFrame, (number) => {
                    hitboxData[key] = number;
                });
            });
            hitboxClass.inputs.push(input);
        });
        tableRow.appendChild(cell);
    }

    const secondaryCallback = (primaryKey, secondaryKey) => {
        let cell = buildNumHitbox(hitboxData[primaryKey][secondaryKey], (input) => {
            input.addEventListener('input', () => {
                inputNumCheck(input, currentFrame, (number) => {
                    hitboxData[primaryKey][secondaryKey] = number
                });
            });
            hitboxClass.inputs.push(input);
        });
        tableRow.appendChild(cell);
    }

    //#region Number Inputs
    objectLooper(hitboxData, 1, Object.keys(hitboxData).length, primaryCallback, secondaryCallback);
    //#endregion

    //#region  Option Column
    let optionCol = buildElem('action-col flex-dir-row');
    let switcheri = buildElem('icon-switch clickable', 'i');
    let switcherTip = buildElem('tooltip center-far-left');
    switcherTip.innerHTML = "Change to Hitbox/Hurtbox";
    switcheri.appendChild(switcherTip);
    switcheri.addEventListener('click', () => {
        if(tableRow.class == 'hurtbox'){
            hitboxClass.hitbox.type = 'hitbox'
            tableRow.class = '';
        }else{
            hitboxClass.hitbox.type = 'hurtbox';
            tableRow.class = 'hurtbox'
        }
    });

    let closei = buildElem('icon-cross clickable', 'i');
    let closeTip = buildElem('tooltip center-left');
    closeTip.innerHTML = "Delete";
    closei.appendChild(closeTip);
    closei.addEventListener('click', () => {
        hitboxClass.deleteThis();
        tableRow.remove();
    });

    optionCol.appendChild(switcheri);
    optionCol.appendChild(closei);
    tableRow.appendChild(optionCol);
    //#endregion

    hitboxListElem.appendChild(tableRow);
}

export const addHitbox = (isHurtbox) => {
    if(currentFrame == null){
        return;
    }

    let index = currentFrame.hitboxListClasses.length-1;
    buildHitboxRowContainer(index, currentFrame.addNewHitbox(), isHurtbox);
}

export const clearHitboxes = () => {
    if(currentFrame == null){
        return;
    }

    let hitboxClasses = currentFrame.hitboxListClasses;
    hitboxClasses.forEach(i => () => {
        i.inputs = null;
    })

    while(hitboxListElem.children.length > 0){
        hitboxListElem.firstElementChild.remove();
    }
}

const addCurrentHitboxes = () => {
    if(currentFrame == null){
        return;
    }

    let hitboxClasses = currentFrame.hitboxListClasses;
    for(let x = 0; x < hitboxClasses.length;x++){
        let hitboxClass = hitboxClasses[x];
        buildHitboxRowContainer(x, hitboxClass, hitboxClass.hitbox.type == 'hurtbox');
    }
}
//#endregion



