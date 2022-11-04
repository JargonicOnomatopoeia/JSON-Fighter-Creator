export class hitbox{
    constructor(_frame = null, _hitboxType = "hurtbox"){
        this.frameRef = _frame;
        this.frameData = _frame.frameData;

        this.hitboxData = {
            type: _hitboxType, 
            offset: {
                x: 0,
                y: 0
            },
            width: 100,
            height: 100,
            damage: 0,
            hitstun: 0,
            coords: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }
        }

        this.listeners = [];
        this.parentElement;
        this.indexElement;
        this.setCoords();
    }

    resetHitbox = (_frameRef = null, _hitboxType = "hitbox") => {
        let hitboxData = this.hitboxData;
        this.frameRef = _frameRef;
        this.frameData = _frameRef.frameData;
        hitboxData.type = _hitboxType;
        hitboxData.offset.x = 0;
        hitboxData.offset.y = 0;
        hitboxData.width = 100;
        hitboxData.height = 100;
        hitboxData.damage = 0;
        hitboxData.hitstun = 0;
        this.triggerListeners();
    }

    setCoords = () => {
        let coords = this.hitboxData.coords;
        let hoffset = this.hitboxData.offset;

        coords.left = hoffset.x - (this.hitboxData.width/2);
        coords.top = hoffset.y - (this.hitboxData.height/2);
        coords.right = hoffset.x + (this.hitboxData.width/2);
        coords.bottom = hoffset.y + (this.hitboxData.height/2);
    }

    //#region getter
    getLeft = (scale = 1, pan = 0) => {
        return (this.hitboxData.coords.left + this.frameData.offset.x) * scale + pan;
    }

    getTop = (scale = 1, pan = 0) => {
        return (this.hitboxData.coords.top + this.frameData.offset.y) * scale + pan;
    }

    getRight = (scale = 1, pan = 0) => {
        return (this.hitboxData.coords.right + this.frameData.offset.x) * scale + pan;
    }

    getBottom = (scale = 1, pan = 0) => {
        return (this.hitboxData.coords.bottom + this.frameData.offset.y) * scale + pan;
    }
    //#endregion

    registerListener = (listener) => {
        this.listeners.push(listener);
    }

    triggerListeners = () => {
        for(let x = 0; x < this.listeners.length;x++){
            this.listeners[x]();
        }
    }

    deleteThis = () => {
        this.frameRef.deleteHitbox(this);
    }
}