import * as animationList from "./animationList.js";

export let colorHitbox = "rgba(255, 0, 0, 0.41)";
export let colorHurtbox = "rgba(0, 255, 34, 0.41)";

export let speedPan = 1;
export let speedZoom = 0.0005;

export let zoomMin = 0.1;
export let zoomMax = 2;

let prevWidth = 0;
let prevHeight = 0;

export class canvas{
    constructor(document){
        
        this.optionZoom = true;

        this.optionPan = true;
        this.toPan = false;

        this.pan = {
            x: 0,
            y: 0
        }
        this.start = {
            x: 0,
            y: 0
        }
        this.zoom = 1;

        this.canvas = document;
        this.parent = document.parentElement;

        this.context = this.canvas.getContext('2d');
        this.resize();
    }

    panTrigger = () => {
        this.context.translate(this.canvas.width/2 + this.pan.x, this.canvas.height/2 + this.pan.y);
    }

    panMouse = (currentPos) => {
        this.pan.x += (currentPos.x - this.start.x) * speedPan;
        this.pan.y += (currentPos.y - this.start.y) * speedPan;
        this.start = {...currentPos};
    }

    panOption = (mode) => {
        this.optionPan = mode;
    }

    panRefresh = () => {
        this.pan.x = 0;
        this.pan.y = 0;
    }
    //#region  Zoom
    zoomTrigger = () => {
        this.context.scale(this.zoom, this.zoom);
    }
    
    zoomOption = (mode) => {
        this.optionZoom = mode;
    }

    zoomRefresh = () => {
        this.zoom = 1;
    }

    zoomInTrigger = () => {
        this.zoom = clamp(this.zoom+0.1, zoomMin, zoomMax);
    }

    zoomOutTrigger = () => {
        this.zoom = clamp(this.zoom-0.1, zoomMin, zoomMax);
    }

    zoomDynamic = (value) => {
        let zoomVal = speedZoom * value;
        this.zoom = clamp(this.zoom-zoomVal, zoomMin, zoomMax);
    }

    zoomScale = () => {
        this.context.scale(this.zoom, this.zoom);
    }
    //#endregion

    mousePosStart = (clientX, clientY) => {
        this.start = {...this.getMousPos(clientX, clientY)};
    }

    erase = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getMousPos = (clientX, clientY) => {
        let rect = this.canvas.getBoundingClientRect();

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        }
    }

    displayerFrame = (frame, hasFilter = false, filterString = 'sepia(100%)') => {
        this.context.save();
        if(hasFilter == true){
            this.context.filter = filterString;
        }
        this.context.drawImage(frame.image, frame.getLeft(), frame.getTop());   
        this.context.restore();
    }

    displayerHitbox = (currentHitbox, color, stroke = false) => {
        let hitboxData = currentHitbox.hitboxData;
        if(stroke == false){
            this.context.fillStyle = color;
            this.context.fillRect(currentHitbox.getLeft(), currentHitbox.getTop(), hitboxData.width, hitboxData.height);
        }else{
            this.context.strokeStyle = color;
            this.context.strokeRect(currentHitbox.getLeft(), currentHitbox.getTop(), hitboxData.width, hitboxData.height);
        }
    }

    resize = () => {
        this.canvas.width = 100;
        this.canvas.height = 100;

        this.canvas.width = this.parent.clientWidth;
        this.canvas.height = this.parent.clientHeight;
    }
}

export const middle = (width, height) => {
    return {
        x: width/2,
        y: height/2
    }
}

export const clamp = (num, min, max) => {
    return Math.max(min, Math.min( num, max));
}

export const isBetween = (number, min, max) => {
    return number >= min && number <= max;
}
