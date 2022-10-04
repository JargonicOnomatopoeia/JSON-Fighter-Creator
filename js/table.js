import { DisplayInJson } from "./JSONOutput.js";
import {FilterStringNoIndentsLines, NumberNotEmpty, SelectedTextFilter } from "./textfilter.js";

/*export const Hitbox = {

    table : null,
    rows : [],
    copiedFrame : null,
    copiedHitboxes: [],

    Initialize : () => {
        HitboxRows.table = document.getElementById("hitboxes");
    },

    AddRows : () => {
        let hitboxLength = currentFrame.hitboxListClasses.length
        if(hitboxLength <= 0){
            return;
        }

        for(let i = 0;i < hitboxLength;i++){
            let newRow = AddNewRow(i, currentFrame.hitbox[i], currentFrame);
            HitboxRows.rows.push(newRow);
            HitboxRows.table.appendChild(newRow);
        }
    },

    AddHitbox : () => {
        if(currentFrame != null){
            let newDataHolder = new Hitbox(currentFrame);
            currentFrame.AddHitbox(newDataHolder);
            let newRow = AddNewRow(currentFrame.hitbox.length, newDataHolder, currentFrame);
            HitboxRows.rows.push(newRow);
            HitboxRows.table.appendChild(newRow);
        }
    },

    AddNewRow : () => {

    },

    Clear : () => {
        let currentRows = HitboxRows.rows;
        while(currentRows.length > 0){
            while(currentRows[0].hasChildNodes()){
                let cell = currentRows[0].lastChild;
                while(cell.hasChildNodes()){
                    delete cell.removeChild(cell.firstChild);
                }
                delete currentRows[0].removeChild(cell);
                
            }
            delete currentRows.shift().remove();
        }
    },

    CopyAll : () => {
        let copiedHitboxes = HitboxRows.copiedHitboxes;
        if(currentFrame != null){
            HitboxRows.copiedFrame = currentFrame;
            for(let x = 0; x < currentFrame.hitbox.length;x++){
                
                let dup = new Hitbox();
                let tempHitbox = dup.hitbox;
                let origHitbox = currentFrame.hitboxList[x];

                tempHitbox.type = origHitbox.type;
                tempHitbox.offset.x = origHitbox.offset.x;
                tempHitbox.offset.y = origHitbox.offset.y;
                tempHitbox.height = origHitbox.height;
                tempHitbox.width = origHitbox.width;
                tempHitbox.priority = origHitbox.priority;
                tempHitbox.damage = origHitbox.damage;
                tempHitbox.hitstun = origHitbox.hitstun;

                copiedHitboxes.push(dup);
            }

            return true;
        }

        return false;
    },

    PasteAll : () => {
        let currentCopiedFrame = HitboxRows.copiedFrame;
        let copiedHitboxes = HitboxRows.copiedHitboxes;
        if(currentFrame != null && currentFrame != currentCopiedFrame
            && copiedHitboxes.length != 0){

            while(copiedHitboxes.length > 0){
                let hitbox = copiedHitboxes.shift();
                hitbox.frameData = currentFrame;
                currentFrame.AddHitbox(hitbox);
            }

            currentCopiedFrame = null;
            return true;
        }

        return false;
    },

    CancelCopy: () => {
        HitboxRows.currentCopiedFrame = null;
        let copiedHitboxes = HitboxRows.copiedHitbox;

        while(copiedHitboxes.length > 0){
            copiedHitboxes.pop().DeleteThis();
        }
    }


}

export const FrameData = {

    frameDataInputs : [],
    keys: [],

    Initialize : () => {
        let container = document.getElementById("frame-data-list");
        let currentFrameEmpty = InitializeFrameData();
        let objectKeys = Object.keys(currentFrameEmpty);
        let frameDataInputs = FrameData.frameDataInputs;
        
        let y = 0;
        let z = 1;
        let counter = container.childElementCount;
        console.log(counter);
        for(let x = 0; x < counter;x++){
            let input = container.children[x].firstElementChild;
            let primaryKey = objectKeys[z];
            console.log(y+" "+z);
            console.log(objectKeys[z]+" "+(currentFrameEmpty[objectKeys[z]] instanceof Object));
            frameDataInputs.push(input);
            switch(currentFrameEmpty[objectKeys[z]] instanceof Object){
                case true: 
                    let object = currentFrameEmpty[objectKeys[z]];
                    let secondaryKeys = Object.keys(object);
                    let secondaryKey = secondaryKeys[y];
                    
                    input.addEventListener("input", () => {
                        let currentFrame = HitboxRows.currentFrame;
                        if(currentFrame == null){
                            input.value = 0;
                            return;
                        }

                        let value = parseInt(input.value);
                        if(isNaN(value) || value == ""){
                            value = 0;
                        }
                        
                        currentFrame[primaryKey][secondaryKey] = value;
                        
                        DisplayInJson();
                    });
                    y++;
                    y = y % secondaryKeys.length;
                    break;
                case false:
                    input.addEventListener("input", () => {
                        let currentFrame = HitboxRows.currentFrame;
                        if(currentFrame == null){
                            input.value = 0;
                            return;
                        }

                        let value = parseInt(input.value);
                        if(isNaN(value) || value == ""){
                            value = 0;
                        }
                        
                        currentFrame[primaryKey] = value;
                        DisplayInJson();
                    });
                    
                ;break;
            }
            if(y == 0){
                z++;
            }
        }
        
    },

    FrameSet: () => {
        let frameDataInputs = FrameData.frameDataInputs;
        let counter = frameDataInputs.length;
        let currentFrame = HitboxRows.currentFrame;
        let objectKeys = Object.keys(currentFrame);

        let y = 0;
        let z = 1;
        for(let x = 0; x < counter;x++){
            switch(currentFrame[objectKeys[z]] instanceof Object){
                case true:
                    let secondaryKeys = Object.keys(currentFrame[objectKeys[z]]);
                    let secondaryLength = secondaryKeys.length;
                    frameDataInputs[x].value = currentFrame[objectKeys[z]][secondaryKeys[y]];
                    y++;
                    y = y % secondaryLength;break;
                case false:
                    frameDataInputs[x].value = currentFrame[objectKeys[z]];
                break;
            }
            if(y == 0){
                z++;
            }
        }
    }
}*/

export const DeleteRow = (container) => {
    
    while(container.hasChildNodes()){
        let child = container.firstChild;
        //console.log(child);
        while(child.hasChildNodes()){
            child.removeChild(child.firstChild);
        }

        child.remove();
    }

    container.remove();
    console.log(container.firstChild);
    container = null;
}


