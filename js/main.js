import * as animationList from './animationList.js'
import { displayInJson , downloadJSON, copyJSONToClipboard} from './jsonOutput.js';
import { animationPlay , animatorInitialize }from './animator.js';
import { showFrame , editorInitialize } from './editor.js';


window.onload = () => {
    
    


    //#region Declarations
    let imageUploader = document.getElementById("add-files");
    let buttonNewHitbox = document.getElementById("add-new-hitbox");
    let buttonCopyHitbox = document.getElementById("copy-hitbox-list");
    let buttonPasteHitbox = document.getElementById("paste-hitbox-list");
    let buttonCancelCopy = document.getElementById("cancel-copy-hitbox-list");
    let pasteCancelContainer = document.getElementById("after-copy-hitbox-list");
    let buttonDownload = document.getElementById("cp-json");
    let buttonClipboard = document.getElementById("dl-json");

    animationList.initialize();
    //editorInitialize();
    //animatorInitialize();
    //FrameData.Initialize();
    //HitboxRows.Initialize();
    //#endregion

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
        if(animationList.currentFrame != null){
            let newHitbox = animationList.currentFrame.addNewHitbox();
            newHitbox.addTableRow(animationList.hitboxListElem);
            displayInJson();
        }
        
    });

    buttonDownload.addEventListener("click", downloadJSON);
    buttonClipboard.addEventListener("click", copyJSONToClipboard);
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
    //requestAnimationFrame(animationPlay);
    //requestAnimationFrame(showFrame);

}
/*

window.onresize = () => {
    ResizeCanvas();
}

const ResizeCanvas = () => {
    canvasAnimator.Resize();
    canvasEditor.Resize();
}

*/
