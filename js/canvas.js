import { animationList } from "./animationlist.js";

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
        
        this.screen = {
            width: _width,
            height: _height
        }

        this.offset = {
            x: _offsetx,
            y: _offsety   
        }

        this.scale = 0;
    }

    Resize = () => {
        this.canvas.width = this.canvas.width * (this.canvas.width/this.screen.width);
        this.canvas.height = this.canvas.height * (this.canvas.height/this.screen.height);
    }

    Erase = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class CanvasEditor{

    constructor(){
        let canvas = document.getElementById("editor-canvas");
        this.canvasClass = new Canvas(canvas, 1317, 635);
        this.onionSkinBack = 0;
        this.onionSkinFront = 0;
        this.startX = -1;
        this.startY = -1;

        let enableDrag = true;
        let enableResize = false;
        
        let toMove = false;
        let indexHitbox = -1;

        let clickAreaShrink = 0;
        let clickResizeExpansion = 0;

        canvas.addEventListener("mousedown",(e) => {
            if(animationList.currentFrame != null){
                e.preventDefault();
                let hitboxes = animationList.currentFrame.hitboxListClasses;
                let x;
                for(x = 0 ; x < hitboxes.length  && hitboxes[x].Click(this.canvasClass, e.clientX, e.clientY) != true;x++){}
                toMove = x < hitboxes.length;
                indexHitbox = x;
                console.log(indexHitbox);
            }
        });

        /*canvas.addEventListener("mouseover", (e) => {
            if(animationList.currentFrame != null){
                let frame = animationList.currentFrame;
                for(let x = 0; x < frame.hitboxListClasses.length;x++){
                    
                }
            }
        })*/

        canvas.addEventListener("mousemove", (e) =>{
            if(animationList.currentFrame != null && toMove != false && indexHitbox > -1 && indexHitbox < animationList.currentFrame.hitboxListClasses.length){
                e.preventDefault();
                let hitbox = animationList.currentFrame.hitboxListClasses[indexHitbox];
                hitbox.Move(this.canvasClass, e.clientX, e.clientY);
            }
        });

        canvas.addEventListener("mouseup", () =>{
            toMove = false;
            indexHitbox = -1;
            this.startX = -1;
            this.startY = -1;
        });

        canvas.addEventListener("mouseout", () => {
            toMove = false;
            indexHitbox = -1;
            this.startX = -1;
            this.startY = -1;
        });
        
    }

    ShowFrame = () => {
        requestAnimationFrame(this.ShowFrame);
        this.canvasClass.Erase();

        let frame  = animationList.currentFrame;

        if(frame == null){
            return;
        }
        
        let hitboxes = frame.hitboxListClasses;

        frame.Draw(this.canvasClass);
        for(let x = 0; x < hitboxes.length;x++){
            hitboxes[x].Draw(this.canvasClass);
        }
    }
}

class CanvasAnimator{
    constructor(){
        let canvas = document.getElementById("animation-canvas");
        this.showHitboxes = true;
        this.canvasClass = new Canvas(canvas, 1317, 635);
        this.animationFrame = 0;
        this.animationFrameTime = 0;
        this.animationIndex = 0;
        this.animationSpeed = 12;
    }

    Initialize = () => {
        this.animationFrame = 0;
        this.animationFrameTime = 0;
        this.animationFrameIndex = 0;
    }

    AnimationPlay = () => {
        requestAnimationFrame(this.AnimationPlay);
        this.canvasClass.Erase();
        let animation = animationList.currentAnimation;

        if(animation == null){
            return;
        }

        let currentAnimFrame = animation.frameDataListClasses[this.animationFrameIndex];

        if(currentAnimFrame.frameData.frametime <= this.animationFrameTime){
            
            currentAnimFrame.Draw(this.canvasClass);

            for(let x = 0;this.showHitboxes !=  false && x < currentAnimFrame.hitboxListClasses.length;x++){
                currentAnimFrame.hitboxListClasses[x].Draw(this.canvasClass);
            }

            if(this.animationFrame >= this.animationSpeed){
                this.animationFrame = this.animationFrame % this.animationSpeed;
                this.animationFrameTime = 0;
                this.animationFrameIndex = ++this.animationFrameIndex % animation.frameDataListClasses.length;
            }else{
                this.animationFrame++;
            }
        }else{
            this.animationFrameTime++;
        }
        
    }
}
