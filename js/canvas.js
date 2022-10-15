import * as animationList from "./animationList.js";

export let colorHitbox = "rgba(255, 0, 0, 0.41)";
export let colorHurtbox = "rgba(0, 255, 34, 0.41)";

export let speedPan = 1;
export let speedZoom = 0.0005;

export class canvas{
    constructor(document, _width = 0, _height = 0, _offsetx = 0, _offsety = 0){
        this.canvas = document;
        this.context = this.canvas.getContext('2d');
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
        let cframeData = frame.frameData;
        let cImage = middle(frame.image.width, frame.image.height);
        let imgoffsetx = cframeData.offset.x - cImage.x;
        let imgoffsety = cframeData.offset.y - cImage.y;
        
        this.context.rotate(cframeData.rotate * Math.PI / 180);
        if(hasFilter == true){
            this.context.filter = filterString;
        }
        this.context.drawImage(frame.image, imgoffsetx, imgoffsety);
            //this.context.strokeStyle = color;
            //this.context.strokeRect(imgoffsetx, imgoffsety, frame.image.width, frame.image.height);   
        
        this.context.restore();
    }

    displayerHitbox = (currentHitbox, currentFrame, color, stroke = false) => {
        let hitboxData = currentHitbox.hitbox;
        let frameData = currentFrame.frameData;
        let centerh = middle(hitboxData.width, hitboxData.height);

        let offsetx = hitboxData.offset.x + frameData.offset.x - centerh.x;
        let offsety = hitboxData.offset.y + frameData.offset.y - centerh.y;

        if(stroke == false){
            this.context.fillStyle = color;
            this.context.fillRect(offsetx, offsety, hitboxData.width, hitboxData.height);
        }else{
            this.context.strokeStyle = color;
            this.context.strokeRect(offsetx, offsety, hitboxData.width, hitboxData.height);
        }
        
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
