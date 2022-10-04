import { animationList } from "./animationlist.js";
import { DisplayInJson } from "./JSONOutput.js";
import { DeleteRow } from "./table.js";
import { Hitbox } from "./hbox.js"
import { canvasAnimator } from "./canvas.js";

export class Frame {
    constructor(_animRef = null, _imageSource = "", _frameName="", _rotation = 0, _offsetx = 0, _offsety = 0, _veloX = 0, _veloY = 0, _frametime = 0, _hitbox = []){
        
        this.animRef = _animRef
        this.image = new Image();
        this.image.src = _imageSource

        this.hitboxListClasses = [];
        
        this.frameData = {
            name: _frameName,
            rotation: _rotation,
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

    GetData = () => {
        this.frameData;
    }

    GetHitboxData = () => {
        this.frameData.hitboxList;
    }

    AddHitbox = (_hitbox) => {
        this.hitboxListClasses.push(_hitbox);
        this.frameData.hitboxList.push(_hitbox.hitbox);
    }
    //#region For Canvas
    Draw = (canvas, context, scale) => {
        context.save(); 
        
        context.translate(canvas.width/2, canvas.height/2);
        context.scale(scale, scale);

        let midx = this.image.width/2;
        let midy = this.image.height/2;

        context.rotate(this.frameData.rotation * Math.PI/180);
        context.drawImage(this.image, this.frameData.offset.x - midx, this.frameData.offset.y - midy)

        context.restore();
    }
    //#endregion
    
    AddTableRow = (table, hitboxTable, frameDataElems) => {
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
            animationList.currentFrame = this;
            animationList.currentAnimation = this.animRef;
            canvasAnimator.Initialize();
            let y = 1;
            console.log("Working");
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
                DeleteRow(hitboxTable.firstChild);
            }

            for(let x = 0; x < this.hitboxListClasses.length;x++){
                let hitboxRow = this.hitboxListClasses[x];
                hitboxRow.AddTableRow(hitboxTable);
            }

            DisplayInJson();
        });
        contentList.push(name);
        //#endregion

        let close = document.createElement('button');
        close.innerText = 'X';

        close.addEventListener("click", () => {
            DeleteRow(this.tableRow);
            if(this.animRef.frameDataListClasses.length == 1){
                DeleteRow(this.animRef.tableRow);
                animationList.RemoveFromList(this.animRef);
                return;
            }
            DisplayInJson();
            this.DeleteThis();
            
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
        let newHitbox = new Hitbox(this);
        this.frameData.hitboxList.push(newHitbox.hitbox);
        this.hitboxListClasses.push(newHitbox);

        return newHitbox;
    }
    
    DeleteHitbox = (_hitbox) => {
        let index = this.hitboxListClasses.findIndex(i => i == _hitbox);
        this.frameData.hitboxList.splice(index , 1);
        this.hitboxListClasses.splice(index, 1)
    }

    DeleteThis = () => {
        for(let x = 0; this.hitboxListClasses.length > 0; x++){
            console.log(this.hitboxListClasses[x].tableRow);
        }

        if(animationList.currentFrame == this){
            animationList.currentFrame = null;
        }

        this.animRef.DeleteFrameData(this);
    }

    CopyHitboxes = () => {
        let hitboxListCopy = [];
        

        for(let x = 0; x < this.hitboxListClasses.length; x++){
            let tempHitbox = new Hitbox();
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