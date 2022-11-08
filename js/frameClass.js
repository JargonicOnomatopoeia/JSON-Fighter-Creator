import { hitbox } from "./hitboxClass.js";
import * as animationList from "./animationlist.js";

export class frame{
    constructor(_animRef = null, _imageSource = "", _frameName=""){
        
        this.animRef = _animRef

        this.image = new Image();
        this.image.src = _imageSource;

        this.hitboxListClasses = [];
        
        this.frameData = {
            name: _frameName,
            offset:{
                x: 0,
                y: 0
            },
            velocity: {
                x: 0,
                y: 0 
            },
            frametime: 0,
            coords:{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            },
            hitboxList: []
        }

        this.listeners = [];
        this.hoverListener;

        this.parentElement;
        this.inputElement;
        this.toggleCopyElement;
    }

    resetFrame = (_animRef, _imageSrc, _frameName) => {
        this.parentElement.classList.remove('list-sub-item-active');
        let frameData = this.frameData;
        this.animRef = _animRef;
        this.image.src = _imageSrc;
        frameData.name = _frameName;
        frameData.offset.x = 0;
        frameData.offset.y = 0;
        frameData.velocity.x = 0;
        frameData.velocity.y = 0;
        frameData.frametime = 0;

        this.inputElement.value = _frameName;
        this.hoverListener();
    }

    //#region set
    setCoords = () => {
        let coords = this.frameData.coords;
        let offset = this.frameData.offset;
        coords.left = offset.x - this.image.width/2;
        coords.top = offset.y - this.image.height/2;
        coords.right = offset.x + this.image.width/2;
        coords.bottom = offset.y + this.image.height/2;
    }

    setHitboxCoords = () => {
        for(let x = 0; x < this.hitboxListClasses.length;x++){
            this.hitboxListClasses[x].setCoords();
        }
    }
    //#endregion
    //#region get
    getLeft = (scale = 1, pan = 0) => {
        return this.frameData.coords.left * scale + pan;
    }

    getTop = (scale = 1, pan = 0) => {
        return this.frameData.coords.top  * scale + pan;
    }

    getRight = (scale = 1, pan = 0) => {
        return this.frameData.coords.right  * scale + pan;
    }

    getBottom = (scale = 1, pan = 0) => {
        return this.frameData.coords.bottom  * scale + pan;
    }

    addHitbox = (_hitbox) => {
        this.hitboxListClasses.push(_hitbox);
        this.frameData.hitboxList.push(_hitbox.hitbox);
    }
    //#endregion
    
    //#endregion
    addHitbox = (hitbox) => {
        this.hitboxListClasses.push(hitbox);
        this.frameData.hitboxList.push(hitbox.hitboxData);
    }

    addNewHitbox = (type) => {
        let newHitbox = new hitbox(this, type);
        this.frameData.hitboxList.push(newHitbox.hitboxData);
        this.hitboxListClasses.push(newHitbox);

        return newHitbox;
    }
    
    deleteHitbox = (_hitbox) => {
        let index = this.hitboxListClasses.findIndex(i => i == _hitbox);
        this.hitboxListClasses[index].parentElement.remove();
        this.frameData.hitboxList.splice(index , 1);
        animationList.garbageHitboxes.push(this.hitboxListClasses.splice(index, 1));
    }

    deleteThis = () => {
        while(this.hitboxListClasses.length > 0){
            this.hitboxListClasses[0].deleteThis();
        }

        if(animationList.currentFrame == this){
            animationList.setCurrentFrame();
        }
        this.animRef.deleteFrameData(this);
    }

    copyHitboxes = (frameClass) => {
        let hitboxListCopy = [];
        for(let x = 0; x < this.hitboxListClasses.length; x++){
            let hitboxClass = this.hitboxListClasses[x];
            let tempHitbox;

            if(animationList.garbageHitboxes.length > 0){
                tempHitbox = animationList.garbageHitboxes.pop()[0];
                tempHitbox.resetHitbox(frameClass, hitboxClass.hitboxData.type);
            }else{
                tempHitbox = new hitbox(frameClass, hitboxClass.hitboxData.type);
                animationList.buildHitboxRowContainer(x+1, tempHitbox, (hitboxClass.hitboxData.type == "hurtbox")? true: false);
            }

            const primaryCallback = (key) => {
                tempHitbox.hitboxData[key] = hitboxClass.hitboxData[key];
            }

            const secondaryCallback = (primaryKey, secondaryKey) => {
                tempHitbox.hitboxData[primaryKey][secondaryKey] = hitboxClass.hitboxData[primaryKey][secondaryKey];
            }

            animationList.objectLooper(hitboxClass.hitboxData, 1, Object.keys(hitboxClass.hitboxData).length, primaryCallback, secondaryCallback);
            
            tempHitbox.triggerListeners();
            hitboxListCopy.push(tempHitbox);
        }
        return hitboxListCopy;
    }

    pasteHitboxes = (hitboxListCopy) => {
        for(let x = 0; x < hitboxListCopy.length;x++){
            this.frameData.hitboxList.push(hitboxListCopy[x].hitboxData);
        }

        this.hitboxListClasses.push(...hitboxListCopy);
    }

    triggerListeners = () => {
        for(let x = 0; x < this.listeners.length ;x++){
            this.listeners[x]();
        }
    }
}