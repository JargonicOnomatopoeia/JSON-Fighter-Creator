import { animationList } from "./animationlist.js";
import { DisplayInJson } from "./JSONOutput.js";

export let colorHitbox = "rgba(255, 0, 0, 0.41)";
export let colorHurtbox = "rgba(0, 255, 34, 0.41)";

export let speedPan = 1;
export let speedZoom = 0.0005;

export let canvasAnimator = null;
export let canvasEditor = null;

export const CanvasInitialize = () => {
    canvasEditor = new CanvasEditor();
    canvasAnimator = new CanvasAnimator();
}

class Canvas{
    constructor(document, _width = 0, _height = 0, _offsetx = 0, _offsety = 0){
        this.canvas = document;
        this.context = this.canvas.getContext('2d');
    }

    Erase = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    GetMousPos = (clientX, clientY) => {
        let rect = this.canvas.getBoundingClientRect();

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        }
    }

    DisplayerFrame = (frame, stroke = false) => {
        this.context.save();
        let cframeData = frame.frameData;
        let cImage = Middle(frame.image.width, frame.image.height);
        let imgoffsetx = cframeData.offset.x - cImage.x;
        let imgoffsety = cframeData.offset.y - cImage.y;

        if(stroke == false){
            this.context.rotate(cframeData.rotate * Math.PI / 180);
            this.context.drawImage(frame.image, imgoffsetx, imgoffsety);
        }else{
            //this.context.strokeStyle = color;
            this.context.strokeRect(imgoffsetx, imgoffsety, frame.image.width, frame.image.height);
        }   
        
        this.context.restore();
    }

    DisplayerHitbox = (currentHitbox, currentFrame, color, stroke = false) => {
        let hitboxData = currentHitbox.hitbox;
        let frameData = currentFrame.frameData;
        let centerh = Middle(hitboxData.width, hitboxData.height);

        let offsetx = hitboxData.offset.x + frameData.offset.x - centerh.x;
        let offsety = hitboxData.offset.y + frameData.offset.y - centerh.y;

        if(stroke == false){
            this.context.fillStyle = color;
            this.context.fillRect(offsetx, offsety, hitboxData.width, hitboxData.height);
        }else{
            this.context.strokeStyle = color;
            this.context.strokeRect(offsetx, offsety, hitboxData.width, hitboxData.height);
        }
        
    }
}

class CanvasEditor{

    constructor(){
        let canvas = document.getElementById("editor-canvas");
        this.canvasClass = new Canvas(canvas);
        this.onionSkinBack = 2;
        this.onionSkinFront = 2;
        this.decimal = 1000
        this.highlight = -1;
        this.scale = 1;

        this.highlightHitbox = "rgba(164, 59, 235, 0.78)";
        this.highlightHurtbox = "rgba(59, 67, 234, 0.78)";
        
        this.editHitbox = false;
        this.highlightImage = false;
        let toMove = false;

        let toPan = false;
        this.pan = {
            x: 0,
            y: 0
        }

        let start = {
            x: 0,
            y: 0
        }

        let toResize = false;
        this.resizeProp = {
            min: 10,
            max: 10
        }
        this.resizeArea = {
            left: false,
            right: false,
            top: false,
            bottom: false
        }

        let mousedown = false;

        canvas.addEventListener("mousedown",(e) => {
            e.preventDefault();  
            if(animationList.currentFrame == null){
                return;
            }
            
            if(this.editHitbox == true){  
                
                let hitboxes = animationList.currentFrame.hitboxListClasses;
                if(this.highlight < hitboxes.length){
                    
                    toMove = this.HitboxBoundChecker(e.clientX, e.clientY, hitboxes[this.highlight]);
                    toResize = this.HitboxResizeChecker(e.clientX, e.clientY, hitboxes[this.highlight]);
                }
                //console.log(toMove);
                //console.log(toResize);
                toPan = !toMove && !toResize;
            }else{
                toMove = this.FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
                console.log(toMove);
                toPan = !toMove;
            }

            if(toMove == true || toResize == true || toPan == true){
                let current = this.canvasClass.GetMousPos(e.clientX, e.clientY);
                start = current;
            }

            mousedown = true;
        });

        canvas.addEventListener("mousemove", (e) =>{
            e.preventDefault();
            if(animationList.currentFrame == null){
                return;
            }
            let current = this.canvasClass.GetMousPos(e.clientX, e.clientY);
            if(this.editHitbox == true){
                let hitboxes = animationList.currentFrame.hitboxListClasses;
                if(mousedown == false){
                    let x = 0;
                    for(; x < hitboxes.length && this.HitboxBoundChecker(e.clientX, e.clientY, hitboxes[x]) != true 
                    && this.HitboxResizeChecker(e.clientX, e.clientY, hitboxes[x]) != true;x++){}

                    this.highlight = x;
                    return;
                }
                
                let hitboxData;
                let tableRow;
                if(toMove || toResize){
                    tableRow = hitboxes[this.highlight].tableRow;
                    hitboxData = hitboxes[this.highlight].hitbox;
                    start = current;
                }
                
                if(toMove == true){
                    hitboxData.offset.x += Math.round(((current.x - start.x)/ this.scale) * this.decimal)/this.decimal;
                    hitboxData.offset.y += Math.round(((current.y - start.y)/ this.scale) * this.decimal)/this.decimal;
                    let children = tableRow.children;
                    children[2].firstElementChild.value = hitboxData.offset.x;
                    children[3].firstElementChild.value = hitboxData.offset.y;
                    DisplayInJson();
                    start = current;
                }

                if(toResize == true){
                    let resultX = Math.round(((current.x - start.x)/ this.scale) * this.decimal) / this.decimal;
                    let resultY = Math.round(((current.y - start.y)/ this.scale) * this.decimal) / this.decimal;
                    if(this.resizeArea.left == true){
                        hitboxData.offset.x += resultX/2;
                        hitboxData.width -= resultX;
                    }

                    if(this.resizeArea.top == true){
                        hitboxData.offset.y += resultY/2;
                        hitboxData.height -= resultY;
                    }

                    if(this.resizeArea.right == true){
                        hitboxData.offset.x += resultX/2;
                        hitboxData.width += resultX;
                    }

                    if(this.resizeArea.bottom == true){
                        hitboxData.offset.y += resultY/2;
                        hitboxData.height += resultY;
                    }
                    let children = tableRow.children;
                    
                    children[2].firstElementChild.value = hitboxData.offset.x;
                    children[3].firstElementChild.value = hitboxData.offset.y;
                    children[4].firstElementChild.value = hitboxData.width;
                    children[5].firstElementChild.value = hitboxData.height;
                    DisplayInJson();
                    start = current;
                }
            }else{
                if(mousedown == false){
                    this.highlightImage = this.highlightImage = this.FrameBoundChecker(e.clientX, e.clientY, animationList.currentFrame);
                }

                if(toMove == true){
                    let frameData = animationList.currentFrame.frameData;
                    frameData.offset.x += Math.round(((current.x - start.x)/ this.scale) * this.decimal)/this.decimal;
                    frameData.offset.y += Math.round(((current.y - start.y)/ this.scale) * this.decimal)/this.decimal;

                    let frameDataElems = animationList.frameDataInputElems;
                    frameDataElems[1].value = frameData.offset.x;
                    frameDataElems[2].value = frameData.offset.y;
                    DisplayInJson();
                    start = current;
                }
            }
            
            if(toPan == true){
                this.pan.x += current.x - start.x;
                this.pan.y += current.y - start.y;
                start = current;
            }
        });

        canvas.addEventListener("mouseup", () =>{
            toMove = false;
            toResize = false;
            toPan = false;
            mousedown = false;
            this.highlight = -1;
        });

        canvas.addEventListener("mouseout", () => {
            toMove = false;
            toResize = false;
            toPan = false;
            mousedown = false;
            this.highlight = -1;
        });

        canvas.addEventListener("wheel", (e) => {
            if(animationList.currentFrame == null){
                return;
            }
            this.scale -= speedZoom * e.deltaY;
            this.scale = Clamp(this.scale, 0.1, 2);
            console.log(this.scale);
        })
        
    }

    ShowFrame = () => {
        requestAnimationFrame(this.ShowFrame);
        this.canvasClass.Erase();

        let frame  = animationList.currentFrame;

        if(frame == null){
            return;
        }

        let frameClasses = animationList.currentAnimation.frameDataListClasses;
        let frameIndex = frameClasses.findIndex(i => i == frame);

        let onionSkinMin = Clamp(frameIndex - this.onionSkinBack, 0, frameClasses.length);
        let onionSkinMax = Clamp(frameIndex + this.onionSkinFront + 1, 0, frameClasses.length);

        const onionSkin = (min, max, opacity) => {
            context.globalAlpha = opacity;
            for(let x = min;x < max ; x++){
                this.canvasClass.DisplayerFrame(frameClasses[x])
            }
            context.globalAlpha = 1;
        }

        let centerCan = Middle(this.canvasClass.canvas.width, this.canvasClass.canvas.height);
        let context = this.canvasClass.context;
        context.save();
        context.translate(centerCan.x + this.pan.x, centerCan.y + this.pan.y);
        context.scale(this.scale, this.scale);
        
        
        onionSkin(onionSkinMin, frameIndex, 0.2);
        this.canvasClass.DisplayerFrame(frame);
        if(this.highlightImage){
            this.canvasClass.DisplayerFrame(frame, true);
        }
        onionSkin(frameIndex+1, onionSkinMax, 0.2);

        let hitboxes = frame.hitboxListClasses;
        for(let x = 0; x < hitboxes.length ;x++){
            let hitboxData = hitboxes[x].hitbox;
            switch(this.highlight == x){
                case true: 
                    if(toMove == true){
                        this.canvasClass.DisplayerHitbox(hitboxes[x], frame, (hitboxData.type == 'hitbox')? this.highlightHitbox: this.highlightHurtbox);
                    }
                    if(toResize == true){
                        this.canvasClass.DisplayerHitbox(hitboxes[x], frame, (hitboxData.type == 'hitbox')? this.highlightHitbox: this.highlightHurtbox, true);
                    }
                    
                break;
                case false: this.canvasClass.DisplayerHitbox(hitboxes[x], frame, (hitboxData.type == 'hitbox')? colorHitbox: colorHurtbox);break;
            }
        }
        context.restore();
    }

    FrameBoundChecker = (clientX , clientY, frame) => {
        let frameData = frame.frameData;
        let mousePos = this.canvasClass.GetMousPos(clientX, clientY);
        let canvas = this.canvasClass.canvas;
        let centerCan = Middle(canvas.width, canvas.height);
        let centeri = Middle(frame.image.width, frame.image.height);

        let pointx = centerCan.x + frameData.offset.x - (centeri.x * this.scale) + this.pan.x;
        let pointy = centerCan.y + frameData.offset.y - (centeri.y * this.scale) + this.pan.y;

        let left = pointx;
        let top = pointy;

        let right = pointx + (frame.image.width * this.scale);
        let bottom = pointy + (frame.image.height * this.scale);

        return this.IsBetween(mousePos.x, left, right) && this.IsBetween(mousePos.y, top, bottom);
    }

    HitboxBoundChecker = (clientX, clientY, hitbox) => {
        let frameData = hitbox.frameData.frameData;
        let mousePos = this.canvasClass.GetMousPos(clientX, clientY);
        let canvas = this.canvasClass.canvas;
        let centerCan = Middle(canvas.width, canvas.height);

        let hitboxData = hitbox.hitbox;

        let centerh = Middle(hitboxData.width, hitboxData.height);

        let pointx = centerCan.x + hitboxData.offset.x + frameData.offset.x - (centerh.x * this.scale) + this.pan.x;
        let pointy = centerCan.y + hitboxData.offset.y + frameData.offset.y - (centerh.y * this.scale) + this.pan.y;

        let scalemin = this.resizeProp.min * this.scale;

        let left = pointx + scalemin;
        let top = pointy + scalemin;

        let right = pointx + ((hitboxData.width - this.resizeProp.min) * this.scale);
        let bottom = pointy + ((hitboxData.height - this.resizeProp.min) * this.scale);

        return this.IsBetween(mousePos.x, left, right) && this.IsBetween(mousePos.y, top, bottom);
    }

    HitboxResizeChecker = (clientX, clientY, hitbox) => {
        let frameData = hitbox.frameData.frameData;
        let mousePos = this.canvasClass.GetMousPos(clientX, clientY);
        let canvas = this.canvasClass.canvas;
        let centerCan = Middle(canvas.width, canvas.height);

        let hitboxData = hitbox.hitbox;

        let centerh = Middle(hitboxData.width, hitboxData.height);

        let pointx = (hitboxData.offset.x + frameData.offset.x + centerCan.x - (centerh.x * this.scale) + this.pan.x);
        let pointy = (hitboxData.offset.y + frameData.offset.y + centerCan.y - (centerh.y * this.scale) + this.pan.y);

        let scaleMin = this.resizeProp.min * this.scale;
        let scaleMax = this.resizeProp.max * this.scale;
        
        let leftMin = (pointx + scaleMin);
        let leftMax = (pointx - scaleMax);

        let topMin = (pointy + scaleMin);
        let topMax = (pointy - scaleMax);

        let rightMin = (pointx + ((hitboxData.width - this.resizeProp.min) * this.scale));
        let rightMax = (pointx + ((hitboxData.width + this.resizeProp.max) * this.scale));

        let bottomMin = (pointy + ((hitboxData.height - this.resizeProp.min) * this.scale));
        let bottomMax = (pointy + ((hitboxData.height + this.resizeProp.max) * this.scale));

        let left = this.IsBetween(mousePos.x, leftMax, leftMin) && this.IsBetween(mousePos.y, topMax, bottomMax);
        let right = this.IsBetween(mousePos.x, rightMin, rightMax) && this.IsBetween(mousePos.y, topMax, bottomMax);
        let top = this.IsBetween(mousePos.y, topMax, topMin) && this.IsBetween(mousePos.x, leftMax, rightMax);
        let bottom = this.IsBetween(mousePos.y, bottomMin, bottomMax) && this.IsBetween(mousePos.x, leftMax, rightMax);

        this.resizeArea.left = left;
        this.resizeArea.right = right;
        this.resizeArea.top = top;
        this.resizeArea.bottom = bottom;

        return left || right || top || bottom;
    }

    IsBetween = (number, min, max) => {
        return number >= min && number <= max;
    }
}

class CanvasAnimator{
    constructor(){
        let canvas = document.getElementById("animation-canvas");
        this.showHitboxes = true;
        this.canvasClass = new Canvas(canvas, 1317, 635);
        this.frame = 0;
        this.frametime = 0;
        this.index = 0;
        this.speed = 12;
        this.scale = 1;

        this.toPan = false;
        this.pan = {
            x: 0,
            y: 0
        }

        //#region  Mouse Reactions
        let startPan;
        canvas.addEventListener("mousedown", (e) => {
            if(animationList.currentAnimation == null){
               return; 
            }
            this.toPan = true;
            startPan = this.canvasClass.GetMousPos(e.clientX, e.clientY)
        });

        canvas.addEventListener("mousemove", (e) => {
            e.preventDefault();
            if(this.toPan){
                let current = this.canvasClass.GetMousPos(e.clientX, e.clientY);
                this.pan.x += current.x - startPan.x;
                this.pan.y += current.y - startPan.y;

                startPan = current;
            }
        });

        canvas.addEventListener("mouseup", () => {
            this.toPan = false;
        })

        canvas.addEventListener("mouseout", () => {
            this.toPan = false;
        })

        canvas.addEventListener("wheel", (e) => {
            if(animationList.currentAnimation == null){
                return;
            }
            this.scale -= speedZoom * e.deltaY;
            this.scale = Clamp(this.scale, 0.1, 2);
        });
        //#endregion
    }

    Initialize = () => {
        this.frame = 0;
        this.frametime = 0;
        this.index = 0;
    }

    AnimationPlay = () => {
        requestAnimationFrame(this.AnimationPlay);
        this.canvasClass.Erase();
        let animation = animationList.currentAnimation;

        if(animation == null){
            return;
        }
        
        let frameClass = animation.frameDataListClasses[this.index];

        if(frameClass.frameData.frametime <= this.frametime){
            let centerCan = Middle(this.canvasClass.canvas.width, this.canvasClass.canvas.height);
            let context = this.canvasClass.context;
            context.save();
            context.translate(centerCan.x + this.pan.x, centerCan.y + this.pan.y);
            context.scale(this.scale, this.scale);
            this.canvasClass.DisplayerFrame(frameClass);
            let hitboxClasses = frameClass.hitboxListClasses;
            for(let x = 0;this.showHitboxes !=  false && x < hitboxClasses.length;x++){
                let hitboxData = hitboxClasses[x].hitbox;
                this.canvasClass.DisplayerHitbox(hitboxClasses[x], frameClass, (hitboxData.type == 'hitbox')? colorHitbox: colorHurtbox);
            }
            context.restore();

            if(this.frame >= this.speed){
                this.frame = this.frame % this.speed;
                this.frametime = 0;
                this.index = ++this.index % animation.frameDataListClasses.length;
            }else{
                this.frame++;
            }
        }else{
            this.frametime++;
        }
        
    }
}

const Middle = (width, height) => {
    return {
        x: width/2,
        y: height/2
    }
}

const Clamp = (num, min, max) => {
    return Math.max(min, Math.min( num, max));
}

