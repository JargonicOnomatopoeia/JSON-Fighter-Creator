import { currentAnimation } from "./animationList.js";
import * as canvasUtil from "./canvas.js"

let canvas;
let showHitboxes = true;
let canvasClass;
let frame = 0;
let frametime = 0;
let index = 0;
let speed = 12;

//#region  Mouse Reactions
let startPan;
export const initialize = () => {
    canvas = document.getElementById("animation-canvas");
    canvasClass = new canvasUtil.canvas(canvas);
    canvas.addEventListener("mousedown", (e) => {
        if(currentAnimation == null){
            return; 
        }
        canvasClass.panOption(true);
        canvasClass.mousePosStart(e.clientX, e.clientY);
    });

    canvas.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if(canvasClass.optionPan == true){
            let current = canvasClass.getMousPos(e.clientX, e.clientY);
            canvasClass.panMouse(current);
        }
    });

    canvas.addEventListener("mouseup", () => {
        canvasClass.panOption(false);
    })

    canvas.addEventListener("mouseout", () => {
        canvasClass.panOption(false);
    })

    canvas.addEventListener("wheel", (e) => {
        if(currentAnimation == null){
            return;
        }
        canvasClass.zoomDynamic(e.deltaY);
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
    let animation = currentAnimation;
    if(currentAnimation == null) return; 
    let frameClass = animation.frameDataListClasses[index];
    let hitboxClasses = frameClass.hitboxListClasses;
    
    frameClass.setCoords();

    for(let x = 0; x < hitboxClasses.length;x++){
        hitboxClasses[x].setCoords();
    }

    if(frameClass.frameData.frametime <= frametime){
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

