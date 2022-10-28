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

let buttonClipboard;
let buttonDownload;
let buttonAddFiles;

export const initialize = () => {
    animationListElem = document.getElementById('animation-list-container');
    hitboxListElem = document.getElementById('hitbox-list-container');
    frameDataInputElems.push(...document.getElementsByClassName('finput'));
    frameDataInputElems.push(...document.getElementsByClassName('finput2'));
    animationDataInputElem = document.getElementsByClassName('ainput')[0];

    buttonClipboard = document.getElementById("cp-json");
    buttonDownload = document.getElementById("dl-json");
    buttonAddFiles = document.getElementById("add-files");

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
        promises.push(new Promise ((resolve) => {
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
            frames[x].setCoords();
            animationTemp.addFrameData(frames[x]);
            animationTemp.accordionBodyElement.appendChild(frames[x].parentElement);
        }
        animationListElem.appendChild(animationTemp.accordionElement);
    });
}

export const triggerFrameDataListeners = () => {
    frameDataInputListeners.forEach(i => i());
}
//#endregion

export const inputNumCheck = (input, currentObject, callback) => {

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

//#endregion

const buildFrameDataInput = () => {
    let data = new frame().frameData;
    let index = 0;

    const primaryCallback = (key) => {
        let frameInput = frameDataInputElems[index];
        frameInput.addEventListener('input', () => {
            inputNumCheck(frameInput, currentFrame, (result) => {
                currentFrame.frameData[key] = result;
                currentFrame.setCoords();
                currentFrame.setHitboxCoords();
            });
        });
        index++;
    }

    const secondaryCallback = (primaryKey, secondaryKey) => {
        let frameInput = frameDataInputElems[index];
        frameInput.addEventListener('input', () => {
            inputNumCheck(frameInput, currentFrame, (result) => {
                currentFrame.frameData[primaryKey][secondaryKey] = result;
                currentFrame.setCoords();
                currentFrame.setHitboxCoords();
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

let isCopying = false;

// Container for the Animation List
const buildAccordion = (animation) => {
    let hoverOnSecondayButton = false;
    let acc = buildElem('accordion');
    animation.accordionElement = acc;
    animation.listener = () => {
        animationDataInputElem.value = animation.animationData.chain;
    }

    let resetHover = () => {
        hoverOnSecondayButton = false;
    }
    animation.hoverListener = resetHover;
    //#region Accordion Head
    let accHead = buildElem('accordion-head');
    let itemList = buildElem('list-item');
    animation.headElement = itemList;

    //For the toggle 
    let arrow = buildElem('icon-arrow-down accordion-arrow', 'i');
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('class', 'accordion-checkbox');
    arrow.appendChild(checkbox);
    animation.dropdownElement = checkbox;

    //Name of the animation goes here
    let animInput = buildElem('flex-grow', 'input');
    animInput.setAttribute('type', 'text');
    animInput.value = animation.animationData.name;
    animInput.addEventListener('input', () => {
        animation.animationData.name = animInput.value;
    });
    animation.inputElement = animInput;

    //Copy Animation
    let toggleCopyBody = buildElem('toggle-icon list-item-copy');
    let toggleCopy = document.createElement('input');
    toggleCopy.setAttribute('type', 'checkbox');
    toggleCopy.setAttribute('class', 'toggle-icon-checkbox');
    toggleCopy.addEventListener("change", () => {
        isCopying = toggleCopy.checked;
        for(let x = 0; x < animationListClasses.length;x++){
            animationListClasses[x].inputElement.disabled = isCopying;
            let currentFrames = animationListClasses[x].frameDataListClasses;

            for(let y = 0; y < currentFrames.length;y++){
                currentFrames[y].parentElement.classList.toggle('disabled');
                currentFrames[y].inputElement.disabled = isCopying;
            }
        }

        buttonDownload.classList.toggle('disabled');
        buttonClipboard.classList.toggle('disabled');
        buttonAddFiles.classList.toggle('disabled');

        if(currentFrame != null){
            currentFrame.parentElement.classList.toggle('list-sub-item-active');
        }
        /*Array.from(document.getElementsByClassName('list-sub-item')).forEach(item => {
            item.classList.toggle('disabled');
        });*/

        // disable functions
        
    });

    toggleCopy.addEventListener('mouseenter', () => {
        hoverOnSecondayButton = true;
    });

    toggleCopy.addEventListener('mouseout', resetHover);
    toggleCopyBody.appendChild(toggleCopy);

    let copyI = buildElem('icon-copy', 'i');
    let copyTip = buildElem('tooltip');
    copyTip.innerHTML = "Copy";
    copyI.appendChild(copyTip);

    let cancelCopyI = buildElem('icon-cancel-copy', 'i');
    let cancelCopyTip = buildElem('tooltip');
    cancelCopyTip.innerHTML = "Cancel Copy";
    cancelCopyI.appendChild(cancelCopyTip);

    toggleCopyBody.appendChild(copyI);
    toggleCopyBody.appendChild(cancelCopyI);
    

    let pasteI = buildElem('icon-paste clickable list-item-paste', 'i');
    let pasteTip = buildElem('tooltip');
    pasteTip.innerHTML = "Paste";
    pasteI.addEventListener("click", (val) => {
        if(isCopying == true) return;
        // paste function
    })
    pasteI.appendChild(pasteTip);

    //Delete Animation
    let trashI = buildElem('icon-trash clickable list-item-delete', 'i');
    let trashTip = buildElem('tooltip left');
    trashTip.innerHTML = "Delete";
    trashI.appendChild(trashTip);
    trashI.addEventListener('click', () => {
        if(!hoverOnSecondayButton || isCopying == true) return;
        animation.deleteThis();
        clearAnimationDataValue();
        clearFrameDataValues();
        clearHitboxes();
        acc.remove();
        if(animationListClasses.length == 0){
            buttonClipboard.classList.add('disabled');
            buttonDownload.classList.add('disabled');
        }
    });

    trashI.addEventListener('mouseenter', () =>{
        hoverOnSecondayButton = true;
    });

    trashI.addEventListener('mouseout', resetHover);

    //put them all together
    itemList.appendChild(arrow);
    itemList.appendChild(animInput);
    itemList.appendChild(pasteI);
    itemList.appendChild(toggleCopyBody);
    itemList.appendChild(trashI);
    
    accHead.appendChild(itemList);
    //#endregion

    //#region Accordion Body
    let frameClasses = animation.frameDataListClasses;
    let accBody = buildElem('accordion-body');
    animation.accordionBodyElement = accBody;
    //#endregion

    accHead.addEventListener('click', () => {
        if(hoverOnSecondayButton == true || isCopying == true) return;
        if(currentAnimation == null){
            animation.headElement.classList.toggle('list-item-active');
        }
        if(currentAnimation != null && currentAnimation != animation){
            currentAnimation.headElement.classList.toggle('list-item-active');
            itemList.classList.toggle('list-item-active');
        }
        if(currentFrame != null){
            currentFrame.parentElement.classList.toggle('list-sub-item-active');
        }
        setCurrentAnim(animation);
        animation.triggerListener();
        animator.reset();
        clearHitboxes();
        setCurrentFrame();
        clearFrameDataValues();
        animationDataInputElem.value = animation.animationData.chain;
    });

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
    let toggleCopyHitboxesBody = buildElem('toggle-icon list-item-copy');
    let toggleCopyHitboxes = document.createElement('input');
    toggleCopyHitboxes.setAttribute('type', 'checkbox');
    toggleCopyHitboxes.setAttribute('class', 'toggle-icon-checkbox');
    toggleCopyHitboxes.addEventListener("change", () => {
        isCopying = toggleCopyHitboxes.checked;
        for(let x = 0; x < animationListClasses.length;x++){
            let animationTemp = animationListClasses[x];
            let frames = animationTemp.frameDataListClasses;
            animationTemp.headElement.classList.toggle('disabled');
            animationTemp.inputElement.disabled = isCopying;
            for(let y = 0; y < frames.length; y++){
                frames[y].inputElement.disabled = isCopying;
            }
        }
        // disable functions
    })
    toggleCopyHitboxesBody.appendChild(toggleCopyHitboxes);

    let copyHitboxes = buildElem('icon-copy', 'i');
    let copyHitboxesTip = buildElem('tooltip');
    copyHitboxesTip.innerHTML = 'Copy Hitboxes';
    copyHitboxes.addEventListener('click', () => {
        copiedHitboxes = frameClass.copyHitboxes();
    });
    copyHitboxes.appendChild(copyHitboxesTip);

    let cancelCopyHitboxes = buildElem('icon-cancel-copy', 'i');
    let cancelCopyHitboxesTip = buildElem('tooltip');
    cancelCopyHitboxesTip.innerHTML = "Cancel Copy";

    cancelCopyHitboxes.appendChild(cancelCopyHitboxesTip);

    toggleCopyHitboxesBody.appendChild(copyHitboxes);
    toggleCopyHitboxesBody.appendChild(cancelCopyHitboxes);

    //Paste Frame
    let pasteHitboxes = buildElem('icon-paste clickable list-item-paste', 'i');
    let pasteHitboxesTip = buildElem('tooltip');
    pasteHitboxesTip.innerHTML = 'Paste Hitboxes';
    pasteHitboxes.addEventListener("click", (val) => {
        // paste function
    })
    pasteHitboxes.appendChild(pasteHitboxesTip);

    //Delete Frame
    let trashFrames = buildElem('icon-trash clickable list-item-delete', 'i');
    let trashTip = buildElem('tooltip');
    trashTip.innerHTML = 'Delete';
    trashFrames.appendChild(trashTip);
    trashFrames.addEventListener('click', () => {
        if(isCopying == true) return;
        let animation = frameClass.animRef;
        if(animation.frameDataListClasses.length == 1){
            animation.deleteThis();
        }else{
            frameClass.deleteThis();
        }
        if(animationListClasses.length == 0){
            buttonClipboard.classList.add('disabled');
            buttonDownload.classList.add('disabled');
        }
        clearHitboxes();
        clearFrameDataValues();
        frameContainer.remove();
        animator.reset();
        disableJSONButtons();
    });

    const resetHover = () => {
        hoverOnSecondayButton = false;
    }
    frameClass.hoverListener = resetHover;

    trashFrames.addEventListener('mouseenter', () => {
        hoverOnSecondayButton = true;
    });

    trashFrames.addEventListener('mouseout', resetHover);

    frameContainer.appendChild(frameInput);
    frameContainer.appendChild(pasteHitboxes);
    frameContainer.appendChild(toggleCopyHitboxesBody);
    frameContainer.appendChild(trashFrames);
    
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
        });
        index++;
    }

    objectLooper(frameClass.frameData, 1, Object.keys(frameClass.frameData).length-2, primaryCallback, secondaryCallback);
    
    frameContainer.addEventListener('click', () => {
        if(hoverOnSecondayButton == true || isCopying == true) return;
        if(currentFrame == null){
            frameContainer.classList.toggle('list-sub-item-active');
        }
        if(currentFrame != null && currentFrame != frameClass){
            currentFrame.parentElement.classList.toggle('list-sub-item-active');
            frameContainer.classList.toggle('list-sub-item-active');
        }
        if(currentAnimation != frameClass.animRef){
            frameClass.animRef.headElement.classList.toggle('list-item-active');
            currentAnimation.headElement.classList.toggle('list-item-active');
        }
        clearHitboxes();
        setCurrentAnim(frameClass.animRef);
        setCurrentFrame(frameClass);
        frameClass.triggerListeners();
        frameClass.animRef.triggerListener();
        addCurrentHitboxes();
        animator.reset();
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
                    hitboxClass.setCoords();
                });
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
                    hitboxData[primaryKey][secondaryKey] = number;
                    hitboxClass.setCoords();

                });
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
    let optionCol = buildElem('action-col flex-dir-row-reverse');
    let switcheri = buildElem('icon-switch clickable', 'i');
    let switcherTip = buildElem('tooltip');
    switcherTip.innerHTML = "Change to Hitbox/Hurtbox";
    switcheri.appendChild(switcherTip);
    switcheri.addEventListener('click', () => {
        hitboxData.type  = (tableRow.classList.contains('hurtbox') == true)? 'hitbox': 'hurtbox';
        tableRow.classList.toggle('hurtbox');
    });

    let closei = buildElem('icon-cross clickable', 'i');
    let closeTip = buildElem('tooltip');
    closeTip.innerHTML = "Delete";
    closei.appendChild(closeTip);
    closei.addEventListener('click', () => {
        hitboxClass.deleteThis();
    });

    optionCol.appendChild(closei);
    optionCol.appendChild(switcheri);
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
        hitboxClasses[x].indexElement.innerHTML = x+1;
        //buildHitboxRowContainer(x, hitboxClass, hitboxClass.hitboxData.type == 'hurtbox');
    }
}
//#endregion




