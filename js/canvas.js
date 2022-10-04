import { animationList } from "./animationlist.js";

export let canvasAnimator = null;
export let canvasEditor = null;

export const CanvasInitialize = () => {
    canvasEditor = new CanvasEditor();
    canvasAnimator = new CanvasAnimator();
}

class Canvas{
    constructor(document, _width, _height){
        this.canvas = document;
        this.context = this.canvas.getContext('2d');
        this.screen = {
            width: _width,
            height: _height
        }

        this.scale = 1;
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
        let animation = animationList.currentAnimation;

        if(animation == null){
            return;
        }

        let currentAnimFrame = animation.frameDataListClasses[this.animationFrameIndex];

        if(currentAnimFrame.frameData.frametime <= this.animationFrameTime){
            this.canvasClass.Erase();
            currentAnimFrame.Draw(this.canvasClass.canvas, this.canvasClass.context, this.canvasClass.scale);

            for(let x = 0;this.showHitboxes !=  false && x < currentAnimFrame.hitboxListClasses.length;x++){
                let hitbox = currentAnimFrame.hitboxListClasses[x];
                hitbox.Draw(this.canvasClass.canvas, this.canvasClass.context, this.canvasClass.scale);
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