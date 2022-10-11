import { animationList } from "./animationlist.js";
import { DisplayInJson } from "./JSONOutput.js";

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
}

class CanvasEditor{

    constructor(){
        let canvas = document.getElementById("editor-canvas");
        this.canvasClass = new Canvas(canvas);
        this.onionSkinBack = 0;
        this.onionSkinFront = 0;

        this.highlight = -1;
        this.scale = 1;
        
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
            if(animationList.currentFrame != null){
                e.preventDefault();
                let hitboxes = animationList.currentFrame.hitboxListClasses;
                if(this.highlight < hitboxes.length){
                    
                    toMove = this.BoundChecker(e.clientX, e.clientY, hitboxes[this.highlight]);
                    toResize = this.ResizeChecker(e.clientX, e.clientY, hitboxes[this.highlight]);
                }

                console.log(toMove);
                console.log(toResize);

                toPan = !toMove && !toResize;

                if(toMove == true || toResize == true || toPan == true){
                    let current = this.canvasClass.GetMousPos(e.clientX, e.clientY);
                    start = current;
                }

                mousedown = true;
            }
        });

        canvas.addEventListener("mousemove", (e) =>{
            e.preventDefault();
            if(animationList.currentFrame != null){
                let hitboxes = animationList.currentFrame.hitboxListClasses;
                
                if(mousedown == false){
                    let x = 0;
                    for(; x < hitboxes.length && this.BoundChecker(e.clientX, e.clientY, hitboxes[x]) != true 
                    && this.ResizeChecker(e.clientX, e.clientY, hitboxes[x]) != true;x++){}

                    this.highlight = x;
                    return;
                }
                
                let current = this.canvasClass.GetMousPos(e.clientX, e.clientY);
                let hitboxData;
                let tableRow;
                if(toMove || toResize){
                    tableRow = hitboxes[this.highlight].tableRow;
                    hitboxData = hitboxes[this.highlight].hitbox;
                }
                
                if(toMove == true){
                    hitboxData.offset.x += (current.x - start.x)/ this.scale;
                    hitboxData.offset.y += (current.y - start.y)/ this.scale;
                    let children = tableRow.children;
                    children[2].firstElementChild.value = hitboxData.offset.x;
                    children[3].firstElementChild.value = hitboxData.offset.y;
                    DisplayInJson();
                }

                if(toResize == true){
                    let resultX = (current.x - start.x)/ this.scale;
                    let resultY = (current.y - start.y)/ this.scale;
                    if(this.resizeArea.left == true){
                        hitboxData.offset.x += resultX/2
                        hitboxData.width -= resultX
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
                    //console.log(children[2].firstElementChild.value);
                    children[2].firstElementChild.value = hitboxData.offset.x;
                    children[3].firstElementChild.value = hitboxData.offset.y;
                    children[4].firstElementChild.value = hitboxData.width;
                    children[5].firstElementChild.value = hitboxData.height;
                    DisplayInJson();
                }

                if(toPan == true){
                    this.pan.x += current.x - start.x;
                    this.pan.y += current.y - start.y;
                    DisplayInJson();
                }

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

            this.scale -= 0.0005 * e.deltaY
        })
        
    }

    ShowFrame = () => {
        requestAnimationFrame(this.ShowFrame);
        this.canvasClass.Erase();

        let frame  = animationList.currentFrame;

        if(frame == null){
            return;
        }

        
        let centerCan = Middle(this.canvasClass.canvas.width, this.canvasClass.canvas.height);
        let context = this.canvasClass.context;
        context.save();
        context.translate(centerCan.x + this.pan.x, centerCan.y + this.pan.y);
        context.scale(this.scale, this.scale);

        let frameData = frame.frameData;
        let centerImage = Middle(frame.image.width, frame.image.height);
        let imageoffsetx = frameData.offset.x - centerImage.x;
        let imageoffsety = frameData.offset.y - centerImage.y;

        context.rotate(frameData.rotate);
        context.drawImage(frame.image, imageoffsetx, imageoffsety);
        context.restore();

        context.save();
        context.translate(centerCan.x + this.pan.x, centerCan.y + this.pan.y);
        context.scale(this.scale, this.scale);
        let hitboxes = frame.hitboxListClasses;

        for(let x = hitboxes.length-1; x >= 0;x--){
            let hitbox = hitboxes[x].hitbox;
            let centerh = Middle(hitbox.width, hitbox.height);

            let hitboxPosX = frameData.offset.x + hitbox.offset.x - centerh.x;
            let hitboxPosY = frameData.offset.y + hitbox.offset.y - centerh.y;

            switch(this.highlight == x){
                case true:
                    context.fillStyle = (hitbox.type == 'hitbox')? "rgba(164, 59, 235, 0.78)": "rgba(59, 67, 234, 0.78)";
                ;break;
                case false:
                    context.fillStyle = (hitbox.type == 'hitbox')? "rgba(255, 0, 0, 0.41)": "rgba(0, 255, 34, 0.41)";
                ;break;
            }
            context.fillRect(hitboxPosX, hitboxPosY, hitbox.width, hitbox.height);
        }

        context.restore();
    }

    BoundChecker = (clientX, clientY, hitbox) => {
        let frameData = hitbox.frameData.frameData;
        let mousePos = this.canvasClass.GetMousPos(clientX, clientY);
        let canvas = this.canvasClass.canvas;
        let centerCan = Middle(canvas.width, canvas.height);
        
        //mousePos.x *= this.scale;
        //mousePos.y *= this.scale; 

        let hitboxData = hitbox.hitbox;

        let centerh = Middle(hitboxData.width, hitboxData.height);

        let pointx = centerCan.x + hitboxData.offset.x + frameData.offset.x - (centerh.x * this.scale) + this.pan.x;
        let pointy = centerCan.y + hitboxData.offset.y + frameData.offset.y - (centerh.y * this.scale) + this.pan.y;

        let scalemin = this.resizeProp.min * this.scale;

        let left = pointx + scalemin;
        let top = pointy + scalemin;

        let right = left + ((hitboxData.width - this.resizeProp.min) * this.scale);
        let bottom = top + ((hitboxData.height - this.resizeProp.min) * this.scale);

        return this.IsBetween(mousePos.x, left, right) && this.IsBetween(mousePos.y, top, bottom);
    }

    ResizeChecker = (clientX, clientY, hitbox) => {
        let frameData = hitbox.frameData.frameData;
        let mousePos = this.canvasClass.GetMousPos(clientX, clientY);
        let canvas = this.canvasClass.canvas;
        let centerCan = Middle(canvas.width, canvas.height);

        //mousePos.x *= this.scale;
        //mousePos.y *= this.scale;

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
            this.scale -= 0.0005 * e.deltaY;
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
            let context = this.canvasClass.context;
            let framedata = frameClass.frameData;
            let centerImg = Middle(frameClass.image.width, frameClass.image.height);
            let centerCan = Middle(this.canvasClass.canvas.width, this.canvasClass.canvas.height);
            let imageoffsetx = framedata.offset.x - centerImg.x;
            let imageoffsety = framedata.offset.y - centerImg.y;
            context.save();
            context.translate(centerCan.x + this.pan.x, centerCan.y + this.pan.y);
            context.scale(this.scale, this.scale);
            
            context.rotate(framedata.rotate);
            context.drawImage(frameClass.image, imageoffsetx, imageoffsety);
            context.restore();

            context.save();
            context.translate(centerCan.x + this.pan.x, centerCan.y + this.pan.y);
            context.scale(this.scale, this.scale);
            let hitboxClasses = frameClass.hitboxListClasses;
            for(let x = 0;this.showHitboxes !=  false && x < hitboxClasses.length;x++){
                let hitboxData = hitboxClasses[x].hitbox;
                let centerh = Middle(hitboxData.width, hitboxData.height);

                let recPosX = hitboxData.offset.x + framedata.offset.x - centerh.x;
                let recPosY = hitboxData.offset.y + framedata.offset.y - centerh.y;

                context.fillStyle = (hitboxData.type == 'hitbox')? "rgba(255, 0, 0, 0.41)": "rgba(0, 255, 34, 0.41)";
                context.fillRect(recPosX, recPosY, hitboxData.width, hitboxData.height);

                //frameClass[x].SetHitboxColor();
                //frameClass[x].Draw(this.canvasClass);
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
