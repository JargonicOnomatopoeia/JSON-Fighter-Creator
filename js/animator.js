import { currentAnimation } from "./animationList.js";
import * as canvasUtil from "./canvas.js"

let canvas;


let frame = 0;
let frametime = 0;
let index = 0;

export let canvasClass;
let showHitboxes = true;

//Animation Speed
export let speed = 12;
let speedMin = 1;
let speedMax = 60;

//#region  Mouse Reactions
let startPan;
export const initialize = () => {
    canvas = document.getElementById("animation-canvas");
    canvasClass = new canvasUtil.canvas(canvas);
    canvas.addEventListener("mousedown", (e) => {
        if(currentAnimation == null) return; 
        canvasClass.toPan = true;
        canvasClass.mousePosStart(e.clientX, e.clientY);
    });

    canvas.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if(canvasClass.optionPan == true && canvasClass.toPan == true){
            let current = canvasClass.getMousPos(e.clientX, e.clientY);
            canvasClass.panMouse(current);
        }
    });

    canvas.addEventListener("mouseup", () => {
        canvasClass.toPan = false;
    })

    canvas.addEventListener("mouseout", () => {
        canvasClass.toPan = false;
    })

    canvas.addEventListener("wheel", (e) => {
        if(currentAnimation == null){
            return;
        }
        canvasClass.zoomDynamic(e.deltaY);
    });
}
//#endregion

export const increaseSpeed = () => {
    speed = canvasUtil.clamp(speed+1, speedMin, speedMax);
}

export const decreaseSpeed = () => {
    speed = canvasUtil.clamp(speed-1, speedMin, speedMax); 
}

export const dynamicSpeed = (value) => {
    speed = Math.floor(value);
    speed = canvasUtil.clamp(speed, speedMin, canvasUtil.speedPan);
}

export const toggleHitboxDisplay = () => {
    showHitboxes = !showHitboxes;
}

export const reset = () => {
    timeAgo = Date.now();
    frame = 0;
    frametime = 0;
    index = 0;
}

let timeNow;
let timeAgo = Date.now();
let framesInASecond = 1000;
export const animationPlay = () => {
    requestAnimationFrame(animationPlay);
    canvasClass.erase();
    let animation = currentAnimation;
    if(currentAnimation == null) return; 
    let frameClass = animation.frameDataListClasses[index];
    let hitboxClasses = frameClass.hitboxListClasses;
    frameClass.setCoords();
    if(frameClass.frameData.frametime <= ++frametime){
        let context = canvasClass.context;
        context.save();
        canvasClass.panTrigger();
        canvasClass.zoomTrigger();
        canvasClass.displayerFrame(frameClass);

        for(let x = 0;showHitboxes !=  false && x < hitboxClasses.length;x++){
            let hitboxData = hitboxClasses[x].hitboxData;
            canvasClass.displayerHitbox(hitboxClasses[x], (hitboxData.type == 'hitbox')? canvasUtil.colorHitbox: canvasUtil.colorHurtbox);
        }
        context.restore();

        timeNow = Date.now();
        if(timeNow - timeAgo > framesInASecond/speed){
            timeAgo = timeNow;
            frametime = 0;
            index = ++index % animation.frameDataListClasses.length;   
        }
    }

}

