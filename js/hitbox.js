import { DeleteRow } from "./table";

class Hitbox{
    constructor(_frameData = null){
        this.frameData = _frameData;

        this.hitbox = {
            type: "hurtbox", 
            offset: {
                x,
                y
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
        indexContainer.innerText = this.frameData.hitBoxListClasses.findIndex(i => i == this);
        tableContent.push(indexContainer);
        //#region Select
        let typeSelect = document.createElement("select");
        for(let x = 0; x < this.selectType.length;x++){
            let typeOption = document.createElement("option");
            let tempString = this.selectType[x];
            
            typeOption.innerText = tempString[0].toUpperCase() + tempString.splice(1);
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
        
        //#region Inputs
        for(let x = 1; x < this.hitbox.length;x++){
            let key = this.keys[x];
            let inputNumbers = (number) => {
                let input = document.createElement('input');
                input.type = "number";
                input.value = number;

                input.addEventListener("input", () => {
                    let number = parseInt(input.value);
                    if(isNaN(number) || input.value == ""){
                        input.value = 0;
                        return;
                    }

                    input.value = number;
                });

                tableContent.push(input);
            }
            switch(this.hitbox[key] instanceof Object){
                case true:
                    let secKeys = Object.keys(this.hitbox[key]);
                    for(let y = 0; y < secKeys.length;y++){
                        inputNumbers(this.hitbox[key][secKeys[y]]);
                    }
                break;
                case false:
                    inputNumbers(this.hitbox[key][secKeys[y]]);
                break;
            }
        }

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';

        deleteButton.addEventListener('click', ()=> {
            DeleteRow(this.tableRow);
            this.DeleteThis();
        });
        //#endregion

        //For Index Cell
        cell.appendChild(tableContent.pop());
        //Popping Continues
        while(tableContent.length != 0){
            let cell = document.createElement('td');
            cell.appendChild(tableContent.pop());
            container.appendChild(cell);
        }

        table.appendChild(container);
    }
    //#endregion

    DeleteThis(){
        this.DeleteTableRow();
        this.frameData.DeleteHitbox(this);
    }
}