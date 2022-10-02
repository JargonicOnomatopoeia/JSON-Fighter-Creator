import { FrameData, Hitbox } from "./table.js";
import { DisplayInJson } from "./JSONOutput.js"
import { animationList, currentFrame, currentAnimation } from "./main.js";

export const animationList = null;

export const AnimationListInit = () => {
    animationList = new AnimationList();
}

class AnimationList{
    constructor(){
        this.animationList = [];
        this.animationIndex = 0;
        this.currentFrame = null;
        this.currentAnimation = null;
        
    }

    AddToList = (animation) => {
        this.animationList.push(animation);
    }

    RemoveFromList = (animation) => {
        let index = this.animationList.findIndex(i == i == animation);
        this.animationList.splice(index, 1).DeleteThis();
    }

    BuildAnimSeparateSprite = (imageArray) => {
        let animation = new Animation(this.animationIndex.toString());
        animation.AddTableRow();
        this.animationIndex++;

        for(let x = 0; x < imageArray.length;x++){
            let picture = new FileReader();
            picture.addEventListener('load', (e)=>{
                let newFile = e.target.result;
                let frameData = new new Frame(animation, newFile);
                frameData.AddTableRow();
                animation.AddFrameData(frameData);
            });
            picture.readAsDataURL(imageArray[x]);
        }
    }
}

export const BuildTreeList = (imageArray) => {
    
    let newAnimationList = InitializeAnimationData("Animation"+animationList.length);
    let table = document.getElementById("animation-list");

    //Holds the rows
    let animationTableRows = [];
    let animationFrames = InitAnimation(newAnimationList);
    

    //Title Container
    let animationTitleContainer = document.createElement("tr");
    //Title Cell
    let animationTitleCell = document.createElement("td");
    let animationTitleInput = document.createElement("input");
    //Button Cell
    let animationDeleteCell = document.createElement("td");
    let animationTitleDeleteButton = document.createElement("button");

    //#region (For First Row Animation Title)

    animationTitleContainer.appendChild(animationTitleCell);
    animationTitleCell.appendChild(animationTitleInput);
    animationTableRows.push(animationTitleContainer);
    

    animationTitleCell.setAttribute("colspan", 2);
    
    animationTitleInput.setAttribute("type", "text")
    animationTitleInput.setAttribute("class", "animation-list-input");
    animationTitleInput.value = "Animation#"+animationList.length;
    animationTitleInput.addEventListener("input", () => {
        newAnimationList.animName = animationTitleInput.value;
        DisplayInJson();        
    });

    animationTitleContainer.appendChild(animationDeleteCell);
    animationDeleteCell.appendChild(animationTitleDeleteButton);

    animationTitleDeleteButton.setAttribute("class", "animation-list-button");
    animationTitleDeleteButton.innerText = "Delete Anim";
    animationTitleDeleteButton.addEventListener("click", () => {
        DeleteAnimation(newAnimationList);
        while(animationTableRows.length > 0){
            DeleteRow(animationTableRows.pop());
        }
        DisplayInJson();
    });
    //#endregion

    //#region (For Frames)
    for(let x = 0; x < imageArray.length;x++){
        let newFrameDataHolder = InitializeFrameData(imageArray[x].name);
        let frameRowContainer = document.createElement("tr");
        let frameIndex = document.createElement("td");
        let frameNameCell = document.createElement("td");
        let frameNameInput = document.createElement("input");
        let frameDeleteCell = document.createElement("td");
        let frameDeleteButton = document.createElement("button");

        animationTableRows.push(frameRowContainer);
        frameRowContainer.appendChild(frameIndex);
        frameRowContainer.appendChild(frameNameCell);
        frameRowContainer.appendChild(frameDeleteCell);

        frameIndex.innerText = x;

        frameNameCell.appendChild(frameNameInput);
        frameDeleteCell.appendChild(frameDeleteButton);

        frameNameInput.setAttribute("type", "text");
        frameNameInput.setAttribute("class", "animation-list-input");
        frameNameInput.value = imageArray[x].name;

        let picReader = new FileReader();
        picReader.addEventListener("load", (e) =>{
            let newImageHolder = InitImage(newFrameDataHolder, e.target.result);
            animationFrames.imageSources.push(newImageHolder);
        });
        picReader.readAsDataURL(imageArray[x]);
        
        frameNameInput.addEventListener("click", () => {
            HitboxRows.currentFrame = newFrameDataHolder;
            AnimationPlayer.InitializeAnimation(newAnimationList);
            FrameData.FrameSet();
            HitboxRows.Clear();
            HitboxRows.AddRows();
        });

        frameNameInput.addEventListener("input", () => {
            newFrameDataHolder.frameName = frameNameInput.value;
            DisplayInJson();
        });

        frameDeleteButton.setAttribute("class", "animation-list-button");
        frameDeleteButton.innerText = "Delete Frame";
        frameDeleteButton.addEventListener("click", () => {
            DeleteFrameData(newAnimationList, newFrameDataHolder);
            DeleteRow(frameRowContainer);
            
            if(newAnimationList.frameData.length == 0){
                DeleteAnimation(newAnimationList);
                DeleteRow(animationTitleContainer);
            }
            DisplayInJson();
        });

        newAnimationList.frameData.push(newFrameDataHolder);
    }
    animationList.push(newAnimationList);
    canvasImageSources.push(animationFrames);
    //#endregion

    animationTableRows.forEach(i => {
        table.appendChild(i);
    });
}
//#region  Initialization
export const InitializeAnimationData = (_animationName = "") => {
    let newAnimationDataHolder = {
        animName: _animationName,
        frameData: []
    }

    return newAnimationDataHolder;
}

export const InitializeFrameData = (_frameName="", _rotation = 0, _offsetx = 0, _offsety = 0, _veloX = 0, _veloY = 0, _frametime = 0) => {
    let newDataHolder = {
        frameName: _frameName,
        rotation: _rotation,
        offset: {
            x: _offsetx,
            y: _offsety
        },
        velocity: {
            x: _veloX,
            y: _veloY
        },
        frametime: _frametime,
        hitbox:[],
    }

    return newDataHolder;
}
//#endregion

const ContentChangeTrue = (element) => {
    element.focus();
    element.contentEditable = true;
}

//#region For Animation Table
const DeleteRow = (element) => {
    while(element.hasChildNodes()){
        let child = element.firstChild;
        while(child.hasChildNodes()){
            child.removeChild(child.firstChild);
        }

        delete child.remove();
    }

    delete element.remove();
}
//#endregion

//#region Delete Data
const DeleteFrameData = (animation, frameData) => {
    delete animation.frameData.Splice(animation.frameData.findIndex(i => i == frameData), 1);
}

const DeleteAnimation = (animation) => {
    delete animationList.splice(animationList.findIndex(i => i == animation), 1);
}
//#endregion

/*const TreeFunc = {
    selected: null,
    prevDblClickListener: null,
    prevCloseListener: null,
    prevOnKeyEnterListener: null,

    edit : (element) => {
        TreeFunc.selected = element;
        element.contentEditable = true;
        
        element.addEventListener("click", TreeFunc.prevCloseListener = (e) => {TreeFunc.close(e);});
        element.addEventListener("keydown", TreeFunc.prevOnKeyEnterListener = (e) => {
            if(e.key == "Enter"){
                TreeFunc.close(true);
                return false;
            }
        });
        element.removeEventListener("dblclick", TreeFunc.prevDblClickListener);
    },
    close : (e) => {
        let cell = TreeFunc.selected;
        console.log(e.target);
        console.log(cell);
        if(cell != null && e.target != cell){
            console.log("Here!");
            cell.contentEditable = false;
            TreeFunc.selected = null;
            cell.removeEventListener("click", TreeFunc.prevCloseListener);
            cell.removeEventListener("keydown", TreeFunc.prevOnKeyEnterListener);
            cell.addEventListener("dblclick", TreeFunc.prevDblClickListener = () => {
                console.log("Something Went Wrong");
                TreeFunc.edit(cell);
            });
        }
    }
}*/