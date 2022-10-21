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
    }

    addHitbox = (_hitbox) => {
        this.hitboxListClasses.push(_hitbox);
        this.frameData.hitboxList.push(_hitbox.hitbox);
    }
    //#region For canvas
    
    //#endregion
    addNewHitbox = (type) => {
        let newHitbox = new hitbox(this, type);
        this.frameData.hitboxList.push(newHitbox.hitbox);
        this.hitboxListClasses.push(newHitbox);

        return newHitbox;
    }
    
    deleteHitbox = (_hitbox) => {
        let index = this.hitboxListClasses.findIndex(i => i == _hitbox);
        delete this.frameData.hitboxList.splice(index , 1);
        delete this.hitboxListClasses.splice(index, 1);
    }

    deleteThis = () => {
        for(let x = 0; x < this.hitboxListClasses.length; x++){
            deleteRow(this.hitboxListClasses[x].tableRow);
        }

        while(this.hitboxListClasses.length > 0){
            this.deleteHitbox(this.hitboxListClasses[0]);
        }

        if(animationList.currentFrame == this){
            animationList.setCurrentFrame();
        }
        this.animRef.deleteFrameData(this);
    }

    copyHitboxes = () => {
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

    pasteHitbox = (hitboxListCopy) => {

        hitboxListCopy.foreach(i => () => {
            i.frameData = this;
            this.frameData.hitboxList.push(i.hitbox);
        });

        this.hitboxListClasses = this.hitboxListClasses.concat(hitboxListCopy);
    }
}