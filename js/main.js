import * as animationList from './animationlist.js'
import { createJSON, copyJSONToClipboard} from './output.js';
import * as animator from './animator.js';
import * as editor from './editor.js';


window.onload = () => {
    //#region Declarations
    let imageUploader = document.getElementById("add-files");
    let buttonNewHitbox = document.getElementById("add-new-hitbox");
    let buttonNewHurtbox = document.getElementById("add-new-hurtbox");
    let buttonClipboard = document.getElementById("cp-json");
    let buttonDownload = document.getElementById("dl-json");
    
    animationList.initialize();
    editor.initialize();
    animator.initialize();
    //FrameData.Initialize();
    //HitboxRows.Initialize();
    
    //#region Hidden File Uploader;
    let fileAdd = document.createElement('input');
    fileAdd.type = 'file';
    fileAdd.multiple = 'true';
    fileAdd.accept = 'image/png, image/jpg, image/jpeg';
    fileAdd.addEventListener('change', (e) => {
        if(window.File && window.FileReader && window.FileList && window.Blob){
            animationList.buildAnimationSprite(e.target.files);
            buttonClipboard.classList.remove('disabled');
            buttonDownload.classList.remove('disabled');
        }
    });
    //#endregion

    imageUploader.addEventListener("click", () =>{
        fileAdd.click();
    });
    
    buttonNewHitbox.addEventListener("click", () => {
        animationList.addHitbox(false);
    });

    buttonNewHurtbox.addEventListener('click', () => {
        animationList.addHitbox(true);
    });

    let linkDownload = document.createElement('a');
    linkDownload.download = "JSON-Fighter-Creater.json";
    buttonDownload.addEventListener("click", () => {
        if(animationList.animationListClasses.length <= 0) return;
        linkDownload.href = createJSON();
        linkDownload.click();
    });

    buttonClipboard.addEventListener("click", () => {
        if(animationList.animationListClasses.length <= 0) return;
        copyJSONToClipboard
    });
    //#endregion
   
    //#region Elements for Animator View
    let buttonSpeedFast = document.getElementById('animation-fast-speed');
    let buttonSpeedSlow = document.getElementById('animation-slow-speed');
    let inputSpeedCounter = document.getElementById('speed-counter');
    let hitboxToggle = document.getElementById('animation-hitbox-display-toggle');
    let animPanToggle = document.getElementById('animation-pan-toggle');
    let animZoomIn = document.getElementById('animation-zoom-in');
    let animZoomOut = document.getElementById('animation-zoom-out');
    
    //RefreshZoomButton
    buttonSpeedSlow.addEventListener('click', () => {
        animator.decreaseSpeed();
        inputSpeedCounter.value = animator.speed;
    });

    buttonSpeedFast.addEventListener('click', () => {
        animator.increaseSpeed();
        inputSpeedCounter.value = animator.speed;
    });

    inputSpeedCounter.value = animator.speed;
    inputSpeedCounter.addEventListener('input', () => {
        let currentAnimation = animationList.currentAnimation;
        animationList.inputNumCheck(inputSpeedCounter, currentAnimation, (result) => {
            animator.dynamicSpeed(result);
            inputSpeedCounter.value = animator.speed;
        });
    });

    hitboxToggle.addEventListener('click', () => {
        animator.canvasClass.modifyHitboxDisplayer(hitboxToggle.checked);
    });

    animPanToggle.addEventListener('click', () => {
        animator.canvasClass.panOption(!animator.canvasClass.optionPan);
    });

    animZoomIn.addEventListener('click', animator.canvasClass.zoomInTrigger);
    animZoomOut.addEventListener('click', animator.canvasClass.zoomOutTrigger);
    //#endregion
    
    //#region Elements For Frame View
    let inputOskinBehind = document.getElementById('frame-view-oskin-behind');
    let inputOskinAhead = document.getElementById('frame-view-oskin-ahead');
    let frameViewPanToggle = document.getElementById('frame-view-pan-toggle');
    let frameViewZoomOut = document.getElementById('frame-view-zoom-out');
    let frameViewZoomIn = document.getElementById('frame-view-zoom-in');
    let frameViewPanReset = document.getElementById('frame-view-pan-reset');
    let frameViewZoomReset = document.getElementById('frame-view-zoom-reset');
    let frameViewControlToggle = document.getElementById('frame-view-control-toggle');
    let frameViewHitboxDisplayToggle = document.getElementById('frame-view-hitbox-display-toggle');

    inputOskinBehind.value = editor.onionSkinBack;
    inputOskinBehind.addEventListener('input', () => {
        let frame = animationList.currentFrame;
        animationList.inputNumCheck(inputOskinBehind, frame, (result) => {
            editor.modifySkinBehind(result);
            inputOskinBehind.value = editor.onionSkinBack;
        });
    });

    inputOskinAhead.value = editor.onionSkinFront;
    inputOskinAhead.addEventListener('input', () => {
        let frame = animationList.currentFrame;
        animationList.inputNumCheck(inputOskinAhead, frame, (result) => {
            editor.modifySkinAhead(result);
            inputOskinAhead.value = editor.onionSkinFront;
        });
    });

    frameViewPanToggle.addEventListener('click', () => {
        editor.canvasClass.panOption(frameViewPanToggle.checked);
    });

    frameViewZoomOut.addEventListener('click', editor.canvasClass.zoomOutTrigger);
    frameViewZoomIn.addEventListener('click', editor.canvasClass.zoomInTrigger);
    frameViewPanReset.addEventListener('click', editor.canvasClass.panRefresh);
    frameViewZoomReset.addEventListener('click', editor.canvasClass.zoomRefresh);
    
    frameViewControlToggle.addEventListener('click', () => {
        if(frameViewHitboxDisplayToggle.checked == true){
            editor.modifyHitboxController(frameViewControlToggle.checked);
        } 
        editor.modifySpriteController(!frameViewControlToggle.checked);
    });

    frameViewHitboxDisplayToggle.addEventListener('click', () => {
        editor.canvasClass.modifyHitboxDisplayer(frameViewHitboxDisplayToggle.checked);
        if(frameViewHitboxDisplayToggle.checked == true){
            editor.modifyHitboxController(frameViewControlToggle.checked);
        }else{
            editor.modifyHitboxController(false);
        }
        
        editor.modifySpriteController(!frameViewControlToggle.checked);
    });
    //#endregion

    //#region Start Canvas
    requestAnimationFrame(animator.animationPlay);
    requestAnimationFrame(editor.showFrame);
    //#endregion

}

window.onresize = () => {
    editor.canvasClass.resize();
    animator.canvasClass.resize();
}

