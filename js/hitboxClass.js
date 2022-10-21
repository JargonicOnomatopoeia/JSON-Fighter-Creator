import { displayInJson } from "./jsonOutput.js";
import { deleteRow } from "./table.js";

export class hitbox{
    constructor(_frameData = null, _hitboxType = "hurtbox"){
        this.frameData = _frameData;

        this.hitbox = {
            type: _hitboxType, 
            offset: {
                x: 0,
                y: 0
            },
            width: 0,
            height: 0,
            damage: 0,
            hitstun: 0
        }

        this.inputs = [];
    }

    deleteThis(){
        this.frameData.deleteHitbox(this);
    }
}