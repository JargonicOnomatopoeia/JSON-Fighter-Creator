import * as animationList from "./animationlist.js";
import * as canvasUtil from "./canvas.js"

export let canvasClass;

let oSkinOpacityBack = 0.3;
let hueOSkinBack = 90;

let oSkinOpacityFront = 0.3;
let hueOSkinFront = 200;

export let onionSkinBack = 0;
export let onionSkinFront = 0;

let decimal = 1000
let highlight = -1;

let highlightHitbox = "rgba(164, 59, 235, 0.78)";
let highlightHurtbox = "rgba(59, 67, 234, 0.78)";

let controlHitboxes = true;
let controlSprite = false;
let highlightImage = false;
let toMove = false;

let toResize = false;
let resizeProp = {
    min: 10,
    max: 10
}
let resizeArea = {
    left: false,
    right: false,
    top: false,
    bottom: false
}

let mouseDictionary = {
    lefttop: "nw-resize",
    leftbottom: "sw-resize",
    righttop: "ne-resize",
    rightbottom: "se-resize",
    left: "w-resize",
    right: "e-resize",
    top: "n-resize",
    bottom: "s-resize"
}


let mousedown = false;

export const modifySkinBehind = (number) => {
    onionSkinBack = Math.floor(number);
}

export const modifySkinAhead = (number) => {
    onionSkinFront = Math.floor(number);
}

export const modifyHitboxController = (binary) => {
    controlHitboxes = binary
}

export const modifySpriteController = (binary) => {
    controlSprite = binary;
}

export const initialize = () =>{

    let canvas = document.getElementById("editor-canvas");
    canvasClass = new canvasUtil.canvas(canvas);
    canvas.addEventListener("mousedown",(e) => {
        e.preventDefault();  
        if(animationList.currentFrame == null) return;
        mousedown = true;
        if(controlHitboxes == true){ 
            canvasClass.toPan = !toMove && !toResize;
        }

        if(controlSprite == true){
            toMove = FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
            canvasClass.toPan = !toMove;
        }

        if(controlSprite == false && controlHitboxes == false){
            canvasClass.toPan = true;   
        }

        //if(toMove == true || toResize == true || canvasClass.toPan == true){
        canvasClass.mousePosStart(e.clientX, e.clientY);
        //return;
        //}
    });

    canvas.addEventListener("mousemove", (e) =>{
        const roundNum = (c, s) => {
            return Math.round(((c - s)/  canvasClass.zoom) *  decimal)/ decimal;
        }

        e.preventDefault();
        if(animationList.currentFrame == null) return;
        let current =  canvasClass.getMousPos(e.clientX, e.clientY);
        //console.log(current);

        if(canvasClass.optionPan == true && canvasClass.toPan == true){
            document.body.style.cursor = "move";
            canvasClass.panMouse(current);
            return;
        }

        if(controlHitboxes == true){
            let hitboxes = animationList.currentFrame.hitboxListClasses;
            if(mousedown == false){
                let x = 0;
                for(; x < hitboxes.length &&  HitboxBoundChecker(e.clientX, e.clientY, hitboxes[x]) != true && 
                HitboxResizeChecker(e.clientX, e.clientY, hitboxes[x]) != true;x++){}
                highlight = x;
                if(x < hitboxes.length){
                    toMove = HitboxBoundChecker(e.clientX, e.clientY, hitboxes[x]);
                    toResize = HitboxResizeChecker(e.clientX, e.clientY, hitboxes[x]);

                    if(toResize == true){
                        let resizeTrue = '';
                        Object.keys(resizeArea).forEach((i) => {
                            if(resizeArea[i] == true){
                                resizeTrue += i;
                            }
                        });
                        document.body.style.cursor = mouseDictionary[resizeTrue];
                    }

                    if(toMove == true){
                        document.body.style.cursor = "move";
                    }
                    return;
                }
                toMove = false;
                toResize = false;
                document.body.style.cursor = "default";
                return;
            }
            
            let hitbox;
            let hitboxData;
            if(toMove || toResize){
                hitbox = hitboxes[highlight];
                hitboxData = hitbox.hitboxData;
            }

            if(toMove == true){
                hitboxData.offset.x += roundNum(current.x, canvasClass.start.x);
                hitboxData.offset.y += roundNum(current.y, canvasClass.start.y);
                hitbox.triggerListeners();
                canvasClass.start.x = current.x;
                canvasClass.start.y = current.y;
            }

            if(toResize == true){
                let resultX = roundNum(current.x, canvasClass.start.x);
                let resultY = roundNum(current.y, canvasClass.start.y);
                if( resizeArea.left == true){
                    hitboxData.offset.x += resultX/2;
                    hitboxData.width -= resultX;
                }

                if( resizeArea.top == true){
                    hitboxData.offset.y += resultY/2;
                    hitboxData.height -= resultY;
                }

                if( resizeArea.right == true){
                    hitboxData.offset.x += resultX/2;
                    hitboxData.width += resultX;
                }

                if( resizeArea.bottom == true){
                    hitboxData.offset.y += resultY/2;
                    hitboxData.height += resultY;
                }
                hitbox.triggerListeners();
                canvasClass.start.x = current.x;
                canvasClass.start.y = current.y;
            }

            return;
        }
        if(controlSprite == true){
            if(mousedown == false){
                highlightImage =  FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
            }

            if(highlightImage == true){
                document.body.style.cursor = "move";
            }else{
                document.body.style.cursor = "default";
            }

            if(toMove == true){
                let frameData = animationList.currentFrame.frameData;
                let currentFrame = animationList.currentFrame;
                frameData.offset.x += roundNum(current.x, canvasClass.start.x);
                frameData.offset.y += roundNum(current.y, canvasClass.start.y);
                currentFrame.setHitboxCoords();
                currentFrame.setCoords();
                animationList.triggerFrameDataListeners();
                canvasClass.start.x = current.x;
                canvasClass.start.y = current.y;
            }

            return;
        }
    });

    const reset = () => {
        //document.body.style.cursor = "default";
        toMove = false;
        toResize = false;
        canvasClass.toPan = false;
        mousedown = false;
        highlight = -1;
    }

    canvas.addEventListener("mouseup", () =>{
        reset();
    });

    canvas.addEventListener("mouseout", () => {
        reset();
    });

    canvas.addEventListener("wheel", (e) => {
        if(animationList.currentFrame == null){
            return;
        }
        canvasClass.zoomDynamic(e.deltaY);
    });
}

export const showFrame = () => {
    requestAnimationFrame(showFrame);
    canvasClass.erase();

    let frame  = animationList.currentFrame;

    if(frame == null) return;
    let frameClasses = animationList.currentAnimation.frameDataListClasses;
    let frameIndex = frameClasses.findIndex(i => i == frame);

    let onionSkinMin = canvasUtil.clamp(frameIndex -  onionSkinBack, 0, frameClasses.length);
    let onionSkinMax = canvasUtil.clamp(frameIndex +  onionSkinFront + 1, 0, frameClasses.length);

    const onionSkin = (min, max, opacity, filterMode = "hue-rotate(90deg)") => {
        context.globalAlpha = opacity;
        for(let x = min;x < max ; x++){
             canvasClass.displayerFrame(frameClasses[x], true, filterMode);
        }
        context.globalAlpha = 1;
    }

    let context =  canvasClass.context;
    context.save();
    canvasClass.panTrigger();
    canvasClass.zoomTrigger();

    onionSkin(onionSkinMin, frameIndex,  oSkinOpacityBack, "hue-rotate("+hueOSkinBack+"deg)");
    canvasClass.displayerFrame(frame,  highlightImage, 'brightness(150%)');
    onionSkin(frameIndex+1, onionSkinMax,  oSkinOpacityFront, "hue-rotate("+hueOSkinFront+"deg)");

    let hitboxes = frame.hitboxListClasses;
    for(let x = 0; canvasClass.hitboxDisplay == true && x < hitboxes.length ;x++){
        let hitboxData = hitboxes[x].hitboxData;
        switch( highlight == x){
            case true: canvasClass.displayerHitbox(hitboxes[x], (hitboxData.type == 'hitbox')?  highlightHitbox:  highlightHurtbox, toResize);break;
            case false:  canvasClass.displayerHitbox(hitboxes[x], (hitboxData.type == 'hitbox')? canvasUtil.colorHitbox: canvasUtil.colorHurtbox);break;
        }
    }

    context.restore();
}

const FrameBoundChecker = (clientX , clientY, frame) => {
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let canvas = canvasClass.canvas.getBoundingClientRect();
    let centerCan = canvasUtil.middle(canvas.width, canvas.height);
    
    let left = centerCan.x + frame.getLeft(canvasClass.zoom, canvasClass.pan.x);
    let top = centerCan.y + frame.getTop(canvasClass.zoom, canvasClass.pan.y);
    
    let right = centerCan.x + frame.getRight(canvasClass.zoom, canvasClass.pan.x);
    let bottom = centerCan.y + frame.getBottom(canvasClass.zoom, canvasClass.pan.y);

    return  canvasUtil.isBetween(mousePos.x, left, right) &&  canvasUtil.isBetween(mousePos.y, top, bottom);
}

const HitboxBoundChecker = (clientX, clientY, hitbox) => {
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let canvas = canvasClass.canvas.getBoundingClientRect();
    let centerCan = canvasUtil.middle(canvas.width, canvas.height);
    //console.log(canvasClass.canvas.width+" "+canvasClass.canvas.height);
    //sconsole.log(mousePos);
    //let scalemin =  resizeProp.min *  canvasClass.zoom;

    let left = centerCan.x + hitbox.getLeft(canvasClass.zoom, canvasClass.pan.x) + resizeProp.min;
    let top = centerCan.y + hitbox.getTop(canvasClass.zoom, canvasClass.pan.y) + resizeProp.min;

    let right = centerCan.x + hitbox.getRight(canvasClass.zoom, canvasClass.pan.x) - resizeProp.min;
    let bottom = centerCan.y + hitbox.getBottom(canvasClass.zoom, canvasClass.pan.y) - resizeProp.min;

    return  canvasUtil.isBetween(mousePos.x, left, right) &&  canvasUtil.isBetween(mousePos.y, top, bottom);
}

const HitboxResizeChecker = (clientX, clientY, hitbox) => {
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let canvas = canvasClass.canvas.getBoundingClientRect();
    let centerCan = canvasUtil.middle(canvas.width, canvas.height);

    let leftCoord = centerCan.x + hitbox.getLeft(canvasClass.zoom, canvasClass.pan.x);
    let topCoord = centerCan.y + hitbox.getTop(canvasClass.zoom, canvasClass.pan.y);

    //let scaleMin =  resizeProp.min *  canvasClass.zoom;
    //let scaleMax =  resizeProp.max *  canvasClass.zoom;

    let leftMin = leftCoord + resizeProp.min ;
    let leftMax = leftCoord - resizeProp.max;

    let topMin = topCoord + resizeProp.min;
    let topMax = topCoord - resizeProp.max;

    let rightCoord = centerCan.x + hitbox.getRight(canvasClass.zoom, canvasClass.pan.x);
    let bottomCoord = centerCan.y + hitbox.getBottom(canvasClass.zoom, canvasClass.pan.y);

    let rightMin = rightCoord - resizeProp.min;
    let rightMax = rightCoord + resizeProp.max;

    let bottomMin = bottomCoord - resizeProp.min;
    let bottomMax = bottomCoord + resizeProp.max;

    let left =  canvasUtil.isBetween(mousePos.x, leftMax, leftMin) &&  canvasUtil.isBetween(mousePos.y, topMax, bottomMax);
    let right =  canvasUtil.isBetween(mousePos.x, rightMin, rightMax) &&  canvasUtil.isBetween(mousePos.y, topMax, bottomMax);
    let top =  canvasUtil.isBetween(mousePos.y, topMax, topMin) &&  canvasUtil.isBetween(mousePos.x, leftMax, rightMax);
    let bottom =  canvasUtil.isBetween(mousePos.y, bottomMin, bottomMax) &&  canvasUtil.isBetween(mousePos.x, leftMax, rightMax);

     resizeArea.left = left;
     resizeArea.right = right;
     resizeArea.top = top;
     resizeArea.bottom = bottom;

    return left || right || top || bottom;
}

    