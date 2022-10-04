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
    //#region For Canvas
    GetHitboxColor = () => {
        switch(this.hitbox.type == "hitbox"){
            case true: return "rgba(255, 0, 0, 0.41)";break;
            case false: return "rgba(0, 255, 34, 0.41)";break;
        }
    }

    Draw = (canvas, context, offsetx, offsety, scale) => {
        context.save();
        
        context.translate(canvas.width/2, canvas.height/2);
        context.scale(scale, scale)

        context.fillStyle = GetHitboxColor();
        context.fillRect(this.hitbox.offset.x + offsetx, this.hitbox.offset.y + offsety, this.hitbox.width, this.hitbox.height);
        context.restore();
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
        console.log(this.frameData);
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