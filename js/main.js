import {BuildTreeList} from './animationlist.js'
import { FrameData, HitboxRows } from './table.js';
import { CopyJSONToClipboard, DisplayInJson, DownloadJSON } from './JSONOutput.js';
import { canvasAnimator, canvasEditor, CanvasInitialize } from './canvas.js';

export const animationList = [];
export const currentAnimation = null;
export const currentFrame = null;

window.onload = () => {
    hitboxList = document.getElementById("hitboxes");

    //#region Declarations
    let imageUploader = document.getElementById("image-upload");
    let buttonNewHitbox = document.getElementById("add-new-hitbox");
    let buttonCopyHitbox = document.getElementById("copy-hitbox-list");
    let buttonPasteHitbox = document.getElementById("paste-hitbox-list");
    let buttonCancelCopy = document.getElementById("cancel-copy-hitbox-list");
    let pasteCancelContainer = document.getElementById("after-copy-hitbox-list");
    let buttonDownload = document.getElementById("json-download");
    let buttonClipboard = document.getElementById("json-clipboard");

    CanvasInitialize();
    FrameData.Initialize();
    HitboxRows.Initialize();
    //#endregion
    
    imageUploader.addEventListener("change", (e) =>{
        if(window.File && window.FileReader && window.FileList && window.Blob){
            let files = e.target.files;
            BuildTreeList(files, currentAnimation, animationList);
            DisplayInJson();
        }
    });

    buttonNewHitbox.addEventListener("click", () => {
        HitboxRows.AddHitbox();
        DisplayInJson();
    });

    buttonDownload.addEventListener("click", DownloadJSON);
    buttonClipboard.addEventListener("click", CopyJSONToClipboard);

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
                DisplayInJson();
                break;
            case false:;break;
        }
    });

    buttonCancelCopy.addEventListener("click", () => {
        HitboxRows.CancelCopy();
        pasteCancelContainer.style.display = "none";
        buttonCopyHitbox.hidden = false;
    });

    requestAnimationFrame(AnimationPlayer.AnimationPlay);
}

window.onresize = () => {
    ResizeCanvas();
}

const ResizeCanvas = () => {
    canvasAnimator.Resize();
    canvasEditor.Resize();
}


