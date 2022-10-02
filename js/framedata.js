import { animationList } from "./main";

class Frame {
    constructor(_animRef = null, _imageSource = "", _frameName="", _rotation = 0, _offsetx = 0, _offsety = 0, _veloX = 0, _veloY = 0, _frametime = 0, _hitbox = []){
        
        this.animRef = _animRef
        this.image = _imageSource

        this.hitboxListClasses = [];
        
        this.frameData = {
            name: _frameName,
            rotation: _rotation,
            offset:{
                x: 0,
                y: 0,
            },
            velocity: {
                x: _veloX,
                y: _veloY 
            },
            frameetime: _frametime,
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
        context.drawImage(this.image, this.frameData.offsetx - midx, this.frameData.offsety - midy)

        context.restore();
    }
    //#endregion
    
    AddTableRow = (table) => {
        let container = document.createElement('tr');
        this.tableRow = container;

        //#region Index
        let indexContainer = document.createElement('td');
        indexContainer.innerText = this.animRef.findIndex(i => i == this);
        //#endregion

        //#region Name Input
        let name = document.createElement('input');
        name.type = "text";
        name.value = this.image.name;

        name.addEventListener("input", () => {
            this.frameData.name = name.value;
        });
        //#endregion

        let close = document.createElement('button');
        close.innerText = 'X';

        close.addEventListener("click", () => {
            DeleteRow(this.tableRow);
            if(this.animRef.frameDataListClasses.length == 1){
                animationList.RemoveFromList(this.animRef);
                return;
            }
            this.DeleteThis();
        })

        table.appendChild(container);
    }
    
    DeleteHitbox = (_hitbox) => {
        let index = this.hitboxListClasses.findIndex(i => i == _hitbox);
        this.frameData.hitboxList.splice(index , 1);
        this.hitboxListClasses.splice(index, 1).DeleteThis();
    }

    DeleteThis = () => {
        while(this.hitboxListClasses.length > 0){
           this.DeleteHitbox(this.hitboxListClasses[0]);
        }

        this.animRef.DeleteFrameData(this);
    }
}