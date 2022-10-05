import { DisplayInJson } from "./JSONOutput.js";
import { DeleteRow } from "./table.js";

export class Hitbox{
    constructor(_frameData = null){
        this.frameData = _frameData;

        this.hitbox = {
            type: "hurtbox", 
            offset: {
                x: 0,
                y: 0
            },
            width: 0,
            height: 0,
            priority: 0,
            damage: 0,
            hitstun: 0
        }

        this.keys = Object.keys(this.hitbox);
        this.keysLength = this.keys.length;
        this.selectType = ["hurtbox", "hitbox"];
        this.tableRow = null;
    }

    //#region For Canvas Display
    GetHitboxColor = (hitbox, hurtbox) => {
        switch(this.hitbox.type == "hitbox"){
            case true: return hitbox;break;
            case false: return hurtbox;break;
        }
    }

    Draw = (canvasClass) => {
        let hitboxPosx = (this.hitbox.offset.x + this.frameData.frameData.offset.x) - (this.hitbox.width/2);// + (this.frameData.image.width/2);
        let hitboxPosy = (this.hitbox.offset.y + this.frameData.frameData.offset.y) - (this.hitbox.height/2);// + (this.frameData.image.height/2);

        canvasClass.context.save();
        
        canvasClass.context.translate((canvasClass.canvas.width/2), (canvasClass.canvas.height/2));

        canvasClass.context.fillStyle = this.GetHitboxColor("rgba(255, 0, 0, 0.41)", "rgba(0, 255, 34, 0.41)");
        canvasClass.context.fillRect(hitboxPosx , hitboxPosy, this.hitbox.width, this.hitbox.height);
        canvasClass.context.restore();
    }
    //#endregion

    //#region Canvas Interaction
    CheckMouseWithinArea = (canvasEditor, posx, posy) => {
        let canvas = canvasEditor.canvas;
        let rect = canvas.getBoundingClientRect();

        let mousePosX = (posx - rect.x + canvasEditor.offset.x) * (canvasEditor.scale + 1);
        let mousePosY = (posy - rect.y + canvasEditor.offset.y) * (canvasEditor.scale + 1);

        //Get Top Left
        let hitboxPosxPrime = ((canvas.width/2) + ((this.hitbox.offset.x + this.frameData.frameData.offset.x) - (this.hitbox.width/2))) * (canvasEditor.scale + 1);
        let hitboxPosyPrime = ((canvas.height/2) + ((this.hitbox.offset.y + this.frameData.frameData.offset.y) - (this.hitbox.height/2))) * (canvasEditor.scale + 1);
        
        // Get Bottom Right
        let hitboxPosx = (hitboxPosxPrime + this.hitbox.width) * (canvasEditor.scale + 1);
        let hitboxPosy = (hitboxPosyPrime + this.hitbox.height) * (canvasEditor.scale + 1);

        return (mousePosX >= hitboxPosxPrime && mousePosX <= hitboxPosx) && (mousePosY >= hitboxPosyPrime && mousePosY <= hitboxPosy);
    }

    Click = (canvasEditor, posx, posy) => {
        let checker = this.CheckMouseWithinArea(canvasEditor, posx, posy);

        if(checker == true){
            canvasEditor.startX = posx;
            canvasEditor.startY = posy;
        }
        
        return checker;
    }

    Move = (canvasEditor, posx, posy) => {
        let deltaX = parseInt(posx - canvasEditor.startX);
        let deltaY = parseInt(posy - canvasEditor.startY);

        this.hitbox.offset.x += deltaX;
        this.hitbox.offset.y += deltaY;

        this.tableRow.children[2].firstElementChild.value = parseInt(this.hitbox.offset.x);
        this.tableRow.children[3].firstElementChild.value = parseInt(this.hitbox.offset.y);

        canvasEditor.startX = posx;
        canvasEditor.startY = posy;

        DisplayInJson();
    }

    //Not Sure LOL
    Resize = () => {

    }


    //#endregion
    
    //#region For Table
    AddTableRow = (table) => {
        // array of cells
        let tableContent = [];
        //Create Table Row
        let container = document.createElement("tr");
        this.tableRow = container;
        // Index

        let indexContainer = document.createElement('td');
        indexContainer.innerText = this.frameData.hitboxListClasses.findIndex(i => i == this).toString();
        container.appendChild(indexContainer);
        //#region Select
        let typeSelect = document.createElement("select");
        for(let x = 0; x < this.selectType.length;x++){
            let typeOption = document.createElement("option");
            let tempString = this.selectType[x];
            
            typeOption.innerText = tempString[0].toUpperCase() + tempString.slice(1 ,tempString.length);
            typeOption.value = tempString;
            
            if(this.selectType[x] == this.hitbox.type){
                typeOption.selected = true;
            }

            typeSelect.addEventListener("change", () => {
                this.hitbox.type = typeSelect.selectedOptions[0].value;
                DisplayInJson();
            });

            typeSelect.appendChild(typeOption);
        }
        tableContent.push(typeSelect);
        //#endregion
        
        let inputNumbers = (number) => {
            let input = document.createElement('input');
            input.type = "number";
            input.value = number;

            return input;
        }

        let inputFilter = (input) => {
            let rnumber = parseInt(input.value);
                if(isNaN(rnumber) && input.value != ""){
                    input.value = 0;
                    return 0;
                }

                if(input.value == ""){
                    return 0;
                }
                
                input.value = rnumber;
                return rnumber;
        }
        
        //#region Inputs
        for(let x = 1; x < this.keys.length;x++){
            let key = this.keys[x];
            switch(this.hitbox[key] instanceof Object){
                case true:
                    let secKeys = Object.keys(this.hitbox[key]);
                    for(let y = 0; y < secKeys.length;y++){
                        let secKey = secKeys[y];
                        let input = inputNumbers(this.hitbox[key][secKey]);
                        input.addEventListener("input", () => {
                            this.hitbox[key][secKey] = inputFilter(input);
                            DisplayInJson();
                        });
                        tableContent.push(input);
                    }
                break;
                case false:
                    let input = inputNumbers(this.hitbox[key]);
                    input.addEventListener("input", () => {
                        this.hitbox[key] = inputFilter(input);
                        DisplayInJson();
                    });
                    tableContent.push(input);
                break;
            }
        }

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';

        deleteButton.addEventListener('click', ()=> {
            DeleteRow(this.tableRow);
            this.DeleteThis();
            DisplayInJson();
        });

        tableContent.push(deleteButton);
        //#endregion

        //Popping Continues
        while(tableContent.length != 0){
            let cell = document.createElement('td');
            cell.appendChild(tableContent.shift());
            container.appendChild(cell);
        }

        table.appendChild(container);
    }
    //#endregion

    DeleteThis(){
        this.frameData.DeleteHitbox(this);
    }
}