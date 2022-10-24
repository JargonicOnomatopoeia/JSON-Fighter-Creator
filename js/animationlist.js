import { frame } from "./frameClass.js";
import { animation } from "./animationClass.js"
import * as animator from "./animator.js"

export let animationListData = [];
export let animationListClasses = [];
export let animationIndex = 0;
export let currentFrame = null;
export let currentAnimation = null;

export let animationListElem;
export let hitboxListElem;
export let hitboxRowContainers = [];
export let frameDataInputElems = [];
let frameDataInputListeners = [];
export let animationDataInputElem;

export let garbageHitboxes = [];
export let garbageFrames = [];
export let garbageAnimations = [];

export const initialize = () => {
    animationListElem = document.getElementById('animation-list');
    hitboxListElem = document.getElementById('hitbox-list');
    frameDataInputElems.push(...document.getElementsByClassName('finput'));
    frameDataInputElems.push(...document.getElementsByClassName('finput2'));
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
    animationListClasses[index].accordionElement.remove();
    garbageAnimations.push(animationListClasses.splice(index, 1));
    animationIndex--;
}

export const buildAnimationSprite = (imageArray) => {
    let animationTemp;
    if(garbageAnimations.length > 0){
        animationTemp = garbageAnimations.pop()[0];
        animationTemp.resetAnim("Animation#"+animationIndex);
    }else{
        animationTemp = new animation("Animation#"+animationIndex);
        buildAccordion(animationTemp);
    }

    addToList(animationTemp);
    animationIndex++;
    
    let promises = [];
    for(let x = 0; x < imageArray.length;x++){
        let picture = new FileReader();
        promises.push(new Promise ((resolve, reject) => {
            picture.addEventListener('load', (e)=>{
                let newFrame;
                if(garbageFrames.length > 0){
                    newFrame = garbageFrames.pop()[0];
                    newFrame.resetFrame(animationTemp, e.target.result, imageArray[x].name);
                }else{
                    newFrame = new frame(animationTemp, e.target.result, imageArray[x].name);
                    newFrame.element = buildFrameContainer(newFrame);
                    //newFrame.setCoords();
                    //console.log(newFrame.image.width+" "+newFrame.image.height);
                }
                resolve(newFrame);
            });
            picture.readAsDataURL(imageArray[x]);
        }));
    }
    
    Promise.all(promises).then((frames) => {
        for(let x = 0; x < frames.length;x++){
            animationTemp.addFrameData(frames[x]);
            animationTemp.accordionBodyElement.appendChild(frames[x].parentElement);
        }
        animationListElem.appendChild(animationTemp.accordionElement);
    });
}

//#region Frame Data Listener Functions
export const removeFrameDataListeners = () => {
    while(frameDataInputListeners.length > 0){
        frameDataInputListeners.pop();
    }
}

export const triggerFrameDataListeners = () => {
    frameDataInputListeners.forEach(i => {
        i();
    })
}
//#endregion

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

    callback(0);
    input.value = 0;
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

//#region Animation Inputs and Frame Inputs Modifications
const clearFrameDataValues = () => {
    for(let x = 0; x < frameDataInputElems.length;x++){
        frameDataInputElems[x].value = 0;
    }
}

const clearAnimationDataValue = () => {
    animationDataInputElem.value = 0;
}

const addToFrameDataInputs = () => {
    let index = 0;
    let data = currentFrame.frameData;
    //Functions that would add the values to the frame data panel
    const primaryCallback = (key) => {
        frameDataInputElems[index].value = data[key];
        index++;
    }

    const secondaryCallback = (primaryKey, secondaryKey) => {
        frameDataInputElems[index].value = data[primaryKey][secondaryKey];
        index++;
    }

    objectLooper(data, 1, Object.keys(data).length-2, primaryCallback, secondaryCallback);
}

const addToAnimationDataInputs = () => {
    animationDataInputElem.value = currentAnimation.animationData.chain;
}
//#endregion

const buildFrameDataInput = () => {
    let data = new frame().frameData;
    let index = 0;

    const setAllCoords = () => {
        currentFrame.setCoords();
        let hitboxClasses = currentFrame.hitboxListClasses;
        for(let x = 0; x < hitboxClasses.length;x++){
            hitboxClasses[x].setCoords();
        }
    }

    const primaryCallback = (key) => {
        let frameInput = frameDataInputElems[index];
        frameInput.addEventListener('input', () => {
            inputNumCheck(frameInput, currentFrame, (result) => {
                currentFrame.frameData[key] = result;
                setAllCoords();
            });
        });
        index++;
    }

    const secondaryCallback = (primaryKey, secondaryKey) => {
        let frameInput = frameDataInputElems[index];
        frameInput.addEventListener('input', () => {
            inputNumCheck(frameInput, currentFrame, (result) => {
                currentFrame.frameData[primaryKey][secondaryKey] = result;
                setAllCoords();
            }); 
        });
        index++;
    }

    objectLooper(data, 1, Object.keys(data).length-2, primaryCallback, secondaryCallback);

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
    let hoverOnSecondayButton = false;
    let acc = buildElem('accordion');
    animation.accordionElement = acc;

    let resetHover = () => {
        hoverOnSecondayButton = false;
    }
    animation.hoverListener = resetHover;
    //#region Accordion Head
    let accHead = buildElem('accordion-head');
    let itemList = buildElem('list-item');
    accHead.addEventListener('click', () => {
        if(hoverOnSecondayButton) return;
        setCurrentAnim(animation);
        animator.reset();
        clearHitboxes();
        setCurrentFrame();
        animationDataInputElem.value = animation.animationData.chain;
        clearFrameDataValues();
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
    animation.inputElement = animInput;

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
        if(!hoverOnSecondayButton) return;
        animation.deleteThis();
        clearAnimationDataValue();
        clearFrameDataValues();
        clearHitboxes();
        acc.remove();
    });

    trashI.addEventListener('mouseenter', () =>{
        hoverOnSecondayButton = true;
    });

    trashI.addEventListener('mouseout', resetHover);

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
    animation.accordionBodyElement = accBody;
    //#endregion

    acc.appendChild(accHead);
    acc.appendChild(accBody);
}

const buildFrameContainer = (frameClass) => {
    let hoverOnSecondayButton = false;
    let frameContainer = buildElem('list-sub-item');
    frameClass.parentElement = frameContainer;

    let frameInput = buildElem('flex-grow', 'input');
    frameInput.setAttribute('type', 'text');
    frameInput.value = frameClass.frameData.name;
    frameInput.addEventListener('input', () => {
        frameClass.frameData.name = frameInput.value;
    });
    frameClass.inputElement = frameInput;

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
        clearHitboxes();
        clearFrameDataValues();
        frameContainer.remove();
        animator.reset();
    });

    const resetHover = () => {
        hoverOnSecondayButton = false;
    }

    frameClass.hoverListener = resetHover;

    trashHitboxes.addEventListener('mouseenter', () => {
        hoverOnSecondayButton = true;
    });

    trashHitboxes.addEventListener('mouseout', resetHover);

    frameContainer.appendChild(frameInput);
    frameContainer.appendChild(copyHitboxes);
    frameContainer.appendChild(trashHitboxes);

    let index = 0;
    const primaryCallback = (key) => {
        let frameDataInput = frameDataInputElems[index];
        frameClass.listeners.push(() => {
            frameDataInput.value = frameClass.frameData[key];
        });
        index++;
    }

    const secondaryCallback = (primaryKey, secondaryKey) => {
        let frameDataInput = frameDataInputElems[index];
        frameClass.listeners.push(() => {
            frameDataInput.value = frameClass.frameData[primaryKey][secondaryKey];
        })
        index++;
    }

    frameContainer.addEventListener('click', () => {
        if(hoverOnSecondayButton == true) return; 
        clearHitboxes();
        setCurrentAnim(frameClass.animRef);
        setCurrentFrame(frameClass);
        addToFrameDataInputs();
        addToAnimationDataInputs();
        addCurrentHitboxes();
        animator.reset();
    });

    frameClass.listeners.push(frameClass.setCoords);
    objectLooper(frameClass, 1, Object.keys(frameClass.frameData).length-2, primaryCallback, secondaryCallback);

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

    tableCell.appendChild(inputNum);

    return tableCell;
}

export const buildHitboxRowContainer = (index, hitboxClass, isHurtbox) => {

    //#region Container
    let tableRow = document.createElement('div');
    tableRow.id = "hitbox-list-table-row";
    if(isHurtbox){
        tableRow.className = 'hurtbox';
    }
    hitboxClass.parentElement = tableRow;
    //#endregion

    //#region Index Column
    let indexCol = buildElem("num-col");
    indexCol.innerHTML = index;
    tableRow.appendChild(indexCol);
    hitboxClass.indexElement = indexCol;
    //#endregion
    //#region Input Column
    let hitboxData = hitboxClass.hitboxData;
    const primaryCallback = (key) => {
        //let inputc;
        let cell = buildNumHitbox(hitboxData[key], (input) => {
            input.addEventListener('input', () => {
                inputNumCheck(input, currentFrame, (number) => {
                    hitboxData[key] = number;
                });
                hitboxClass.setCoords();
            });
            hitboxClass.registerListener(() => {
                input.value = hitboxData[key];
            });
        });
        
        tableRow.appendChild(cell);
    }

    const secondaryCallback = (primaryKey, secondaryKey) => {
        //let inputc;
        let cell = buildNumHitbox(hitboxData[primaryKey][secondaryKey], (input) => {
            //inputc = input;
            input.addEventListener('input', () => {
                inputNumCheck(input, currentFrame, (number) => {
                    hitboxData[primaryKey][secondaryKey] = number
                });
                hitboxClass.setCoords();
            });
            hitboxClass.registerListener(() => {
                input.value = hitboxData[primaryKey][secondaryKey];
            });
        });
        
        tableRow.appendChild(cell);
    }

    hitboxClass.registerListener(hitboxClass.setCoords);

    objectLooper(hitboxData, 1, Object.keys(hitboxData).length-1, primaryCallback, secondaryCallback);
    //#endregion

    //#region  Option Column
    let optionCol = buildElem('action-col flex-dir-row');
    let switcheri = buildElem('icon-switch clickable', 'i');
    let switcherTip = buildElem('tooltip center-far-left');
    switcherTip.innerHTML = "Change to Hitbox/Hurtbox";
    switcheri.appendChild(switcherTip);
    switcheri.addEventListener('click', () => {
        hitboxData.type  = (tableRow.classList.contains('hurtbox') == true)? 'hitbox': 'hurtbox';
        tableRow.classList.toggle('hurtbox');
    });

    let closei = buildElem('icon-cross clickable', 'i');
    let closeTip = buildElem('tooltip center-left');
    closeTip.innerHTML = "Delete";
    closei.appendChild(closeTip);
    closei.addEventListener('click', () => {
        hitboxClass.deleteThis();
    });

    optionCol.appendChild(switcheri);
    optionCol.appendChild(closei);
    tableRow.appendChild(optionCol);
    //#endregion

    return tableRow;
}

export const addHitbox = (isHurtbox) => {
    if(currentFrame == null) return;

    let type = (isHurtbox)? 'hurtbox':'hitbox';
    let index = currentFrame.hitboxListClasses.length;
    let newHitbox;
    if(garbageHitboxes.length > 0){
        newHitbox = garbageHitboxes.pop()[0];
        newHitbox.resetHitbox(currentFrame, type);
        currentFrame.addHitbox(newHitbox);
    }else{
        newHitbox = currentFrame.addNewHitbox(type);
        newHitbox.parentElement = buildHitboxRowContainer(index, newHitbox, isHurtbox);
    }
    hitboxListElem.appendChild(newHitbox.parentElement);
}

export const clearHitboxes = () => {
    if(currentFrame == null) return;

    let hitboxClasses = currentFrame.hitboxListClasses;

    for(let x = 0; x < hitboxClasses.length;x++){
        hitboxClasses[x].parentElement.remove();
    }
}

const addCurrentHitboxes = () => {
    if(currentFrame == null) return;

    let hitboxClasses = currentFrame.hitboxListClasses;
    for(let x = 0; x < hitboxClasses.length;x++){
        hitboxListElem.appendChild(hitboxClasses[x].parentElement);
        hitboxClasses[x].indexElement.innerHTML = x;
        //buildHitboxRowContainer(x, hitboxClass, hitboxClass.hitboxData.type == 'hurtbox');
    }
}
//#endregion



