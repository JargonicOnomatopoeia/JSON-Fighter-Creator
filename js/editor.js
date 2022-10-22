import * as animationList from "./animationList.js";
import { displayInJson } from "./jsonOutput.js";
import * as canvasUtil from "./canvas.js"

let canvas;
let canvasClass;

let oSkinOpacityBack = 0.3;
let hueOSkinBack = 90;

let oSkinOpacityFront = 0.3;
let hueOSkinFront = 200;

let onionSkinBack = 2;
let onionSkinFront = 2;

let decimal = 1000
let highlight = -1;
let scale = 1;

let highlightHitbox = "rgba(164, 59, 235, 0.78)";
let highlightHurtbox = "rgba(59, 67, 234, 0.78)";

let editHitbox = false;
let highlightImage = false;
let toMove = false;

let toPan = false;
let pan = {
    x: 0,
    y: 0
}

let start = {
    x: 0,
    y: 0
}

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
    canvas = document.getElementById("editor-canvas");
    canvasClass = new canvasUtil.canvas(canvas);
    canvas.addEventListener("mousedown",(e) => {
        e.preventDefault();  
        if(animationList.currentFrame == null){
            return;
        }
        
        if( editHitbox == true){  
            
            let hitboxes = animationList.currentFrame.hitboxListClasses;
            if( highlight < hitboxes.length){
                
                toMove =  HitboxBoundChecker(e.clientX, e.clientY, hitboxes[ highlight]);
                toResize =  HitboxResizeChecker(e.clientX, e.clientY, hitboxes[ highlight]);
            }
            //console.log(toMove);
            //console.log(toResize);
            toPan = !toMove && !toResize;
        }else{
            toMove =  FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
            toPan = !toMove;
        }

        if(toMove == true || toResize == true || toPan == true){
            let current =  canvasClass.getMousPos(e.clientX, e.clientY);
            start = current;
        }

        mousedown = true;
    });

    canvas.addEventListener("mousemove", (e) =>{
        e.preventDefault();
        if(animationList.currentFrame == null){
            return;
        }
        let current =  canvasClass.getMousPos(e.clientX, e.clientY);
        if( editHitbox == true){
            let hitboxes = animationList.currentFrame.hitboxListClasses;
            if(mousedown == false){
                let x = 0;
                for(; x < hitboxes.length &&  HitboxBoundChecker(e.clientX, e.clientY, hitboxes[x]) != true 
                &&  HitboxResizeChecker(e.clientX, e.clientY, hitboxes[x]) != true;x++){}

                highlight = x;
                return;
            }
            
            let hitboxData;
            let tableRow;
            if(toMove || toResize){
                tableRow = hitboxes[ highlight].tableRow;
                hitboxData = hitboxes[ highlight].hitbox;
                start = current;
            }
            
            if(toMove == true){
                hitboxData.offset.x += Math.round(((current.x - start.x)/  scale) *  decimal)/ decimal;
                hitboxData.offset.y += Math.round(((current.y - start.y)/  scale) *  decimal)/ decimal;
                let children = tableRow.children;
                children[2].firstElementChild.value = hitboxData.offset.x;
                children[3].firstElementChild.value = hitboxData.offset.y;
                displayInJson();
                start = current;
            }

            if(toResize == true){
                let resultX = Math.round(((current.x - start.x)/  scale) *  decimal) /  decimal;
                let resultY = Math.round(((current.y - start.y)/  scale) *  decimal) /  decimal;
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
                let children = tableRow.children;
                
                children[2].firstElementChild.value = hitboxData.offset.x;
                children[3].firstElementChild.value = hitboxData.offset.y;
                children[4].firstElementChild.value = hitboxData.width;
                children[5].firstElementChild.value = hitboxData.height;
                displayInJson();
                start = current;
            }
        }else{
            if(mousedown == false){
                highlightImage =  highlightImage =  FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
            }

            if(toMove == true){
                let frameData = animationList.currentFrame.frameRef;
                frameData.offset.x += Math.round(((current.x - start.x)/  scale) *  decimal)/ decimal;
                frameData.offset.y += Math.round(((current.y - start.y)/  scale) *  decimal)/ decimal;

                let frameDataElems = animationList.frameDataInputElems;
                frameDataElems[1].value = frameData.offset.x;
                frameDataElems[2].value = frameData.offset.y;
                displayInJson();
                start = current;
            }
        }
        
        if(toPan == true){
            pan.x += current.x - start.x;
            pan.y += current.y - start.y;
            start = current;
        }
    });

    canvas.addEventListener("mouseup", () =>{
        toMove = false;
        toResize = false;
        toPan = false;
        mousedown = false;
        highlight = -1;
    });

    canvas.addEventListener("mouseout", () => {
        toMove = false;
        toResize = false;
        toPan = false;
        mousedown = false;
        highlight = -1;
    });

    canvas.addEventListener("wheel", (e) => {
        if(animationList.currentFrame == null){
            return;
        }
        scale -= canvasUtil.speedZoom * e.deltaY;
        scale = canvasUtil.clamp( scale, 0.1, 2);
    });
}

export const showFrame = () => {
    requestAnimationFrame(showFrame);
     canvasClass.erase();

    let frame  = animationList.currentFrame;

    if(frame == null){
        return;
    }

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

    let centerCan = canvasUtil.middle( canvasClass.canvas.width,  canvasClass.canvas.height);
    let context =  canvasClass.context;
    context.save();
    context.translate(centerCan.x +  pan.x, centerCan.y +  pan.y);
    context.scale( scale,  scale);


    onionSkin(onionSkinMin, frameIndex,  oSkinOpacityBack, "hue-rotate("+hueOSkinBack+"deg)");
    canvasClass.displayerFrame(frame,  highlightImage, 'brightness(150%)');
    onionSkin(frameIndex+1, onionSkinMax,  oSkinOpacityFront, "hue-rotate("+hueOSkinFront+"deg)");

    let hitboxes = frame.hitboxListClasses;
        for(let x = 0; x < hitboxes.length ;x++){
            let hitboxData = hitboxes[x].hitbox;
            switch( highlight == x){
                case true: canvasClass.displayerHitbox(hitboxes[x], frame, (hitboxData.type == 'hitbox')?  highlightHitbox:  highlightHurtbox, toResize);break;
                case false:  canvasClass.displayerHitbox(hitboxes[x], frame, (hitboxData.type == 'hitbox')? canvasUtil.colorHitbox: canvasUtil.colorHurtbox);break;
            }
        }
        context.restore();
    }

const FrameBoundChecker = (clientX , clientY, frame) => {
    let frameData = frame.frameData;
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let canvas =  canvasClass.canvas;
    let centerCan = canvasUtil.middle(canvas.width, canvas.height);
    let centeri = canvasUtil.middle(frame.image.width, frame.image.height);

    let pointx = centerCan.x + frameData.offset.x - (centeri.x *  scale) +  pan.x;
    let pointy = centerCan.y + frameData.offset.y - (centeri.y *  scale) +  pan.y;

    let left = pointx;
    let top = pointy;

    let right = pointx + (frame.image.width *  scale);
    let bottom = pointy + (frame.image.height *  scale);

    return  canvasUtil.isBetween(mousePos.x, left, right) &&  canvasUtil.isBetween(mousePos.y, top, bottom);
}

const HitboxBoundChecker = (clientX, clientY, hitbox) => {
    let frameData = hitbox.frameData.frameData;
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let canvas =  canvasClass.canvas;
    let centerCan = canvasUtil.middle(canvas.width, canvas.height);

    let hitboxData = hitbox.hitbox;

    let centerh = canvasUtil.middle(hitboxData.width, hitboxData.height);

    let pointx = centerCan.x + hitboxData.offset.x + frameData.offset.x - (centerh.x *  scale) +  pan.x;
    let pointy = centerCan.y + hitboxData.offset.y + frameData.offset.y - (centerh.y *  scale) +  pan.y;

    let scalemin =  resizeProp.min *  scale;

    let left = pointx + scalemin;
    let top = pointy + scalemin;

    let right = pointx + ((hitboxData.width -  resizeProp.min) *  scale);
    let bottom = pointy + ((hitboxData.height -  resizeProp.min) *  scale);

    return  canvasUtil.isBetween(mousePos.x, left, right) &&  canvasUtil.isBetween(mousePos.y, top, bottom);
}

const HitboxResizeChecker = (clientX, clientY, hitbox) => {
    let frameData = hitbox.frameData.frameData;
    let mousePos =  canvasClass.getMousPos(clientX, clientY);
    let canvas =  canvasClass.canvas;
    let centerCan = canvasUtil.middle(canvas.width, canvas.height);

    let hitboxData = hitbox.hitbox;

    let centerh = canvasUtil.middle(hitboxData.width, hitboxData.height);

    let pointx = (hitboxData.offset.x + frameData.offset.x + centerCan.x - (centerh.x *  scale) +  pan.x);
    let pointy = (hitboxData.offset.y + frameData.offset.y + centerCan.y - (centerh.y *  scale) +  pan.y);

    let scaleMin =  resizeProp.min *  scale;
    let scaleMax =  resizeProp.max *  scale;

    let leftMin = (pointx + scaleMin);
    let leftMax = (pointx - scaleMax);

    let topMin = (pointy + scaleMin);
    let topMax = (pointy - scaleMax);

    let rightMin = (pointx + ((hitboxData.width -  resizeProp.min) *  scale));
    let rightMax = (pointx + ((hitboxData.width +  resizeProp.max) *  scale));

    let bottomMin = (pointy + ((hitboxData.height -  resizeProp.min) *  scale));
    let bottomMax = (pointy + ((hitboxData.height +  resizeProp.max) *  scale));

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

    