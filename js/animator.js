import * as animationList from "./animationList.js";
import * as canvasUtil from "./canvas.js"

let canvas;
let showHitboxes = true;
let canvasClass;
let frame = 0;
let frametime = 0;
let index = 0;
let speed = 12;
let scale = 1;

let toPan = false;
let pan = {
    x: 0,
    y: 0
}

//#region  Mouse Reactions
let startPan;
export const animatorInitialize = () => {
    canvas = document.getElementById("animation-canvas");
    canvasClass = new canvasUtil.canvas(canvas);
    canvas.addEventListener("mousedown", (e) => {
        if(animationList.currentAnimation == null){
            return; 
        }
        toPan = true;
        startPan = canvasClass.getMousPos(e.clientX, e.clientY)
    });

    canvas.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if(toPan){
            let current = canvasClass.getMousPos(e.clientX, e.clientY);
            pan.x += current.x - startPan.x;
            pan.y += current.y - startPan.y;

            startPan = current;
        }
    });

    canvas.addEventListener("mouseup", () => {
        toPan = false;
    })

    canvas.addEventListener("mouseout", () => {
        toPan = false;
    })

    canvas.addEventListener("wheel", (e) => {
        if(animationList.currentAnimation == null){
            return;
        }
        scale -= canvasUtil.speedZoom * e.deltaY;
        scale = canvasUtil.clamp(scale, 0.1, 2);
    });
}
//#endregion

export const reset = () => {
    frame = 0;
    frametime = 0;
    index = 0;
}

export const animationPlay = () => {
    requestAnimationFrame(animationPlay);
    canvasClass.erase();
    let animation = animationList.currentAnimation;

    if(animation == null){
        return;
    }
    
    let frameClass = animation.frameDataListClasses[index];

    if(frameClass.frameData.frametime <= frametime){
        let centerCan = canvasUtil.middle(canvasClass.canvas.width, canvasClass.canvas.height);
        let context = canvasClass.context;
        context.save();
        context.translate(centerCan.x + pan.x, centerCan.y + pan.y);
        context.scale(scale, scale);
        canvasClass.displayerFrame(frameClass);
        let hitboxClasses = frameClass.hitboxListClasses;
        for(let x = 0;showHitboxes !=  false && x < hitboxClasses.length;x++){
            let hitboxData = hitboxClasses[x].hitbox;
            canvasClass.displayerHitbox(hitboxClasses[x], frameClass, (hitboxData.type == 'hitbox')? canvasUtil.colorHitbox: canvasUtil.colorHurtbox);
        }
        context.restore();

        if(frame >= speed){
            frame = frame % speed;
            frametime = 0;
            index = ++index % animation.frameDataListClasses.length;
        }else{
            frame++;
        }
    }else{
        frametime++;
    }
}

