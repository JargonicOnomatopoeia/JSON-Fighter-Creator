import * as animationList from './animationList.js'
import { displayInJson , downloadJSON, copyJSONToClipboard} from './jsonOutput.js';
import * as animator from './animator.js';
import * as editor from './editor.js';


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
        animationList.addHitbox(false);
    });

    buttonNewHurtbox.addEventListener('click', () => {
        animationList.addHitbox(true);
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
    requestAnimationFrame(animator.animationPlay);
    requestAnimationFrame(editor.showFrame);

}

window.onresize = () => {
    //animator.canvasClass.resize();
}

