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
            width: 0,
            height: 0,
            damage: 0,
            hitstun: 0,
        }

        this.listeners = [];
    }

    getLeft = (scale = 1, pan = 0) => {
        return this.hitboxData.offset.x + this.frameData.offset.x - ((this.hitboxData.width/2) * scale) + pan;
    }

    getTop = (scale = 1, pan = 0) => {
        return this.hitboxData.offset.y + this.frameData.offset.y - ((this.hitboxData.height/2) * scale) + pan;
    }

    getRight = (scale = 1, pan = 0) => {
        return this.hitboxData.offset.x + this.frameData.offset.x + ((this.hitboxData.width/2) * scale) + pan;
    }

    getBottom = (scale = 1, pan = 0) => {
        return this.hitboxData.offset.y + this.frameData.offset.y + ((this.hitboxData.height/2) * scale) + pan;
    }

    registerListener = (listener) => {
        this.listeners.push(listener);
    }

    removeListeners = () => {
        while(this.listeners.length > 0){
            this.listeners.pop();
        }
    }

    triggerListeners = () => {
        this.listeners.forEach((i) => {
            i();
        });
    }

    deleteThis = () => {
        this.frameData.deleteHitbox(this);
    }
}