import * as animationList from "./animationList.js";
import * as canvasUtil from "./canvas.js"

let canvasClass;

let oSkinOpacityBack = 0.3;
let hueOSkinBack = 90;

let oSkinOpacityFront = 0.3;
let hueOSkinFront = 200;

let onionSkinBack = 2;
let onionSkinFront = 2;

let decimal = 1000
let highlight = -1;

let highlightHitbox = "rgba(164, 59, 235, 0.78)";
let highlightHurtbox = "rgba(59, 67, 234, 0.78)";

let editHitbox = true;
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

let mousedown = false;

export const initialize = () =>{
    let canvas = document.getElementById("editor-canvas");
    canvasClass = new canvasUtil.canvas(canvas);
    canvas.addEventListener("mousedown",(e) => {
        e.preventDefault();  
        if(animationList.currentFrame == null) return;
        
        if(editHitbox == true){  
            let hitboxes = animationList.currentFrame.hitboxListClasses;
            if( highlight < hitboxes.length){
                toMove =  HitboxBoundChecker(e.clientX, e.clientY, hitboxes[highlight]);
                toResize =  HitboxResizeChecker(e.clientX, e.clientY, hitboxes[highlight]);
            }
            canvasClass.panOption(!toMove && !toResize);
        }else{
            toMove = FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
            canvasClass.panOption(!toMove);
        }

        if(toMove == true || toResize == true || canvasClass.optionPan == true){
            canvasClass.mousePosStart(e.clientX, e.clientY);
        }

        mousedown = true;
    });

    canvas.addEventListener("mousemove", (e) =>{
        const roundNum = (c, s) => {
            return Math.round(((c - s)/  canvasClass.zoom) *  decimal)/ decimal;
        }

        e.preventDefault();
        if(animationList.currentFrame == null) return;
        let current =  canvasClass.getMousPos(e.clientX, e.clientY);
        console.log(current);

        if(editHitbox == true){
            let hitboxes = animationList.currentFrame.hitboxListClasses;
            if(mousedown == false){
                let x = 0;
                for(; x < hitboxes.length &&  HitboxBoundChecker(e.clientX, e.clientY, hitboxes[x]) != true 
                &&  HitboxResizeChecker(e.clientX, e.clientY, hitboxes[x]) != true;x++){}
                highlight = x;
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
            
        }else{
            if(mousedown == false){
                highlightImage =  FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
            }

            if(toMove == true){
                let frameData = animationList.currentFrame.frameRef;
                frameData.offset.x += roundNum(current.x, canvasClass.start.x);
                frameData.offset.y += roundNum(current.y, canvasClass.start.y);
                animationList.triggerFrameDataListeners();
                canvasClass.start = {...current};
            }
        }
        
        if(canvasClass.optionPan == true){
            canvasClass.panMouse(current);
        }
    });

    const reset = () => {
        toMove = false;
        toResize = false;
        canvasClass.panOption(false);
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
        for(let x = 0; x < hitboxes.length ;x++){
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
    let centerCan = canvasUtil.middle(canvasClass.canvas.width, canvasClass.canvas.height);

    let left = centerCan.x + frame.getLeft(canvasClass.zoom, canvasClass.pan.x);
    let top = centerCan.y + frame.getTop(canvasClass.zoom, canvasClass.pan.y);

    let right = centerCan.x + frame.getRight(canvasClass.zoom, canvasClass.pan.x);
    let bottom = centerCan.y + frame.getBottom(canvasClass.zoom, canvasClass.pan.y);

    return  canvasUtil.isBetween(mousePos.x, left, right) &&  canvasUtil.isBetween(mousePos.y, top, bottom);
}

const HitboxBoundChecker = (clientX, clientY, hitbox) => {
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let centerCan = canvasUtil.middle(canvasClass.canvas.width, canvasClass.canvas.height);

    //let scalemin =  resizeProp.min *  canvasClass.zoom;

    let left = centerCan.x + hitbox.getLeft(canvasClass.zoom, canvasClass.pan.x) + resizeProp.min;
    let top = centerCan.y + hitbox.getTop(canvasClass.zoom, canvasClass.pan.y) + resizeProp.min;

    let right = centerCan.x + hitbox.getRight(canvasClass.zoom, canvasClass.pan.x) - resizeProp.min;
    let bottom = centerCan.y + hitbox.getBottom(canvasClass.zoom, canvasClass.pan.y) - resizeProp.min;

    return  canvasUtil.isBetween(mousePos.x, left, right) &&  canvasUtil.isBetween(mousePos.y, top, bottom);
}

const HitboxResizeChecker = (clientX, clientY, hitbox) => {
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let centerCan = canvasUtil.middle(canvasClass.canvas.width, canvasClass.canvas.height);

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

    