import * as animationList from './animationList.js'
import { downloadJSON, copyJSONToClipboard} from './jsonOutput.js';
import * as animator from './animator.js';
import * as editor from './editor.js';
import { clamp } from './canvas.js';


window.onload = () => {
    //#region Declarations
    let imageUploader = document.getElementById("add-files");
    let buttonNewHitbox = document.getElementById("add-new-hitbox");
    let buttonNewHurtbox = document.getElementById("add-new-hurtbox");
    let buttonCopyHitbox = document.getElementById("copy-hitbox-list");
    let buttonPasteHitbox = document.getElementById("paste-hitbox-list");
    let buttonCancelCopy = document.getElementById("cancel-copy-hitbox-list");
    let pasteCancelContainer = document.getElementById("after-copy-hitbox-list");
    let buttonDownload = document.getElementById("cp-json");
    let buttonClipboard = document.getElementById("dl-json");
    
    animationList.initialize();
    editor.initialize();
    animator.initialize();
    //FrameData.Initialize();
    //HitboxRows.Initialize();
    

    //Hidden File Uploader;
    let fileAdd = document.createElement('input');
    fileAdd.type = 'file';
    fileAdd.multiple = 'true';
    fileAdd.accept = 'image/png, image/jpg, image/jpeg';
    fileAdd.addEventListener('change', (e) => {
        if(window.File && window.FileReader && window.FileList && window.Blob){
            animationList.buildAnimationSprite(e.target.files);
        }
    });
    
    imageUploader.addEventListener("click", () =>{
        fileAdd.click();
    });
    
    buttonNewHitbox.addEventListener("click", () => {
        animationList.addHitbox(false);
    });

    buttonNewHurtbox.addEventListener('click', () => {
        animationList.addHitbox(true);
    });

    buttonDownload.addEventListener("click", downloadJSON);
    buttonClipboard.addEventListener("click", copyJSONToClipboard);
    //#endregion
    //#region Elements for Animator View
    let buttonSpeedFast = document.getElementById('animation-fast-speed');
    let buttonSpeedSlow = document.getElementById('animation-slow-speed');
    let inputSpeedCounter = document.getElementById('speed-counter');
    let hitboxToggle = document.getElementById('animation-hitbox-toggle');
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

    hitboxToggle.addEventListener('click', animator.toggleHitboxDisplay);

    animPanToggle.addEventListener('click', () => {
        animator.canvasClass.panOption(!animator.canvasClass.optionPan);
    });

    animZoomIn.addEventListener('click', animator.canvasClass.zoomInTrigger);
    animZoomOut.addEventListener('click', animator.canvasClass.zoomOutTrigger);
    //#endregion

    //#region Elements For Frame View
    //#endregion
    /*
    buttonCopyHitbox.addEventListener("click", () => {
        let checker = HitboxRows.CopyAll();
        switch(checker){
            case true:
                buttonCopyHitbox.hidden = true;
                pasteCancelContainer.style.display = "grid";
                break;
            case false:;break;
        }
    });
    buttonPasteHitbox.addEventListener("click", () => {
        let checker = HitboxRows.PasteAll();
        switch(checker){
            case true:
                pasteCancelContainer.style.display = "none";
                buttonCopyHitbox.hidden = false;
                HitboxRows.Clear();
                HitboxRows.AddRows();
                displayInJson();
                break;
            case false:;break;
        }
    });

    buttonCancelCopy.addEventListener("click", () => {
        HitboxRows.CancelCopy();
        pasteCancelContainer.style.display = "none";
        buttonCopyHitbox.hidden = false;
    });
*/
    requestAnimationFrame(animator.animationPlay);
    requestAnimationFrame(editor.showFrame);

}

window.onresize = () => {
    //animator.canvasClass.resize();
}

