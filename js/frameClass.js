import { displayInJson } from "./jsonOutput.js";
import { deleteRow } from "./table.js";
import { hitbox } from "./hitboxClass.js";
import * as animator from "./animator.js";
import * as animationList from "./animationList.js";

export class frame{
    constructor(_animRef = null, _imageSource = "", _frameName="", _rotation = 0, _offsetx = 0, _offsety = 0, _veloX = 0, _veloY = 0, _frametime = 0, _hitbox = []){
        
        this.animRef = _animRef
        this.image = new Image();
        this.image.src = _imageSource

        this.hitboxListClasses = [];
        
        this.frameData = {
            name: _frameName,
            rotate: _rotation,
            offset:{
                x: _offsetx,
                y: _offsety,
            },
            velocity: {
                x: _veloX,
                y: _veloY 
            },
            frametime: _frametime,
            hitboxList: _hitbox
        }

        this.tableRow = null;
    }

    addHitbox = (_hitbox) => {
        this.hitboxListClasses.push(_hitbox);
        this.frameData.hitboxList.push(_hitbox.hitbox);
    }
    //#region For canvas
    
    //#endregion
    
    addTableRow = (table, hitboxTable, frameDataElems) => {
        let contentList = [];
        let container = document.createElement('tr');
        this.tableRow = container;
        //#region Index
        let indexContainer = document.createElement('td');
        indexContainer.innerText = this.animRef.frameDataListClasses.findIndex(i => i == this).toString();
        container.appendChild(indexContainer);
        //#endregion

        //#region Name Input
        let name = document.createElement('input');
        name.type = "text";
        name.value = this.frameData.name;

        name.addEventListener("input", () => {
            this.frameData.name = name.value;
        });

        let primeKeys = Object.keys(this.frameData);
        name.addEventListener("click", () => {
            animationList.setCurrentFrame(this);
            animationList.setCurrentAnim(this.animRef);
            animator.reset();
            let y = 1;
            for(let x = 0; x < frameDataElems.length;){ 
                let primaryKey = primeKeys[y];
                switch(this.frameData[primaryKey] instanceof Object){
                    case true:
                        let secondKeys = Object.keys(this.frameData[primaryKey]);
                        for(let z = 0; z < secondKeys.length;z++){
                            let secondaryKey = secondKeys[z];
                            frameDataElems[x].value = this.frameData[primaryKey][secondaryKey];
                            x++;
                        }
                    ;break;
                    case false:
                        frameDataElems[x].value = this.frameData[primeKeys[y]];  
                        x++;
                    ;break;
                }
                y++;
            }

            while(hitboxTable.hasChildNodes()){
                deleteRow(hitboxTable.firstChild);
            }

            for(let x = 0; x < this.hitboxListClasses.length;x++){
                let hitboxRow = this.hitboxListClasses[x];
                hitboxRow.addTableRow(hitboxTable);
            }

            displayInJson();
        });
        contentList.push(name);
        //#endregion

        let close = document.createElement('button');
        close.innerText = 'X';

        close.addEventListener("click", () => {
            deleteRow(this.tableRow);
            if(this.animRef.frameDataListClasses.length == 1){
                deleteRow(this.animRef.tableRow);
                animationList.removeFromList(this.animRef);
                return;
            }
            displayInJson();
            this.deleteThis();
            
        });
        contentList.push(close);

        while(contentList.length > 0){
            let tempTD = document.createElement('td');
            tempTD.appendChild(contentList.shift());
            container.appendChild(tempTD);
        }
        table.appendChild(container);
    }

    AddNewHitbox = () => {
        let newHitbox = new hitbox(this);
        this.frameData.hitboxList.push(newHitbox.hitbox);
        this.hitboxListClasses.push(newHitbox);

        return newHitbox;
    }
    
    DeleteHitbox = (_hitbox) => {
        let index = this.hitboxListClasses.findIndex(i => i == _hitbox);
        delete this.frameData.hitboxList.splice(index , 1);
        delete this.hitboxListClasses.splice(index, 1);
    }

    deleteThis = () => {
        for(let x = 0; x < this.hitboxListClasses.length; x++){
            deleteRow(this.hitboxListClasses[x].tableRow);
        }

        while(this.hitboxListClasses.length > 0){
            this.DeleteHitbox(this.hitboxListClasses[0]);
        }

        if(animationList.currentFrame == this){
            animationList.setCurrentFrame();
        }
        this.animRef.deleteFrameData(this);
    }

    CopyHitboxes = () => {
        let hitboxListCopy = [];
        

        for(let x = 0; x < this.hitboxListClasses.length; x++){
            let tempHitbox = new hitbox();
            let tempObjectKeys = Object.keys(tempHitbox.hitbox.keys);
            let hitbox = this.hitboxListClasses[x].hitbox;
            for(let y = 0; y < tempObjectKeys.length;y++){
                let primeKey = tempObjectKeys[y];
                switch(tempHitbox[primeKey] instanceof Object){
                    case true:
                        let secondaryKeys = Object.keys(tempHitbox[primeKey]);
                        for(let z = 0; z < secondaryKeys.length;z++){
                            let secondaryKey = secondaryKeys[z];
                            tempHitbox.hitbox[primeKey][secondaryKey] = hitbox[primeKey][secondaryKey];
                            
                        }
                    ;break;
                    case false:
                        tempHitbox.hitbox[primeKey] = hitbox[primeKey];
                        
                    ;break;
                }
            }
            hitboxListCopy.push(tempHitbox);
        }

        return hitboxListCopy;
    }

    PasteHitbox = (hitboxListCopy) => {

        hitboxListCopy.foreach(i => () => {
            i.frameData = this;
            this.frameData.hitboxList.push(i.hitbox);
        });

        this.hitboxListClasses = this.hitboxListClasses.concat(hitboxListCopy);
    }
}