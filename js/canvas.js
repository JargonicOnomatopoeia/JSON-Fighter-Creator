export const canvasAnimator = null;
export const canvasEditor = null;

export const CanvasInitialize = () => {
    canvasEditor = new CanvasEditor();
    canvasAnimator = new CanvasAnimator();
}

class Canvas{
    constructor(document, _width, _height){
        this.canvas = document;
        this.context = this.canvas.context('2d');
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
        this.canvasClass = new Canvas(canvas, 1317, 635);
        this.animationSet = null;
        this.animationFrame = 0;
        this.animationFrameTime = 0;
        this.animationIndex = 0;
        this.animationSpeed = 12;
    }

    Initialize = (_animationSet) => {
        this.animationSet = _animationSet;
        this.animationFrame = 0;
        this.animationFrameTime = 0;
        this.animationFrameIndex = 0;
    }

    AnimationPlay = () => {
        requestAnimationFrame(AnimationPlayer);

        if(this.animationSet != null && this.animationSet.animatonset.frameDataListClasses[this.animationFrameIndex].frametime <= this.animationFrameTime){
            let frameData  = this.animationSet.frameDataListClasses[this.animationFrameIndex];
            
            frameData.Draw(this.canvas, this.context, this.canvasClass.scale);

            for(let x = 0; x < frameData.hitboxListClasses.length;x++){
                let hitbox = frameData.hitboxListClasses[x];
                let midx = -(frameData.image.width/2);
                let midy = -(frameData.image.height/2);
                hitbox.Draw(this.canvas, this.context, midx, midy, this.canvasClass.scale);
            }

            if(this.animationFrame >= this.animationSpeed){
                this.animationFrame = this.animationFrame % this.animationSpeed;
                this.animationFrameTime = 0;
                this.animationFrameIndex = this.animationFrameIndex % this.animationSet.frameDataListClasses.length;
            }
        }else{
            this.animationFrameTime++;
        }
    }
}