import { displayInJson } from "./jsonOutput.js";
import { deleteRow } from "./table.js";

export class hitbox{
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

    //#region For canvas Display
    //#endregion


    //#endregion
    
    //#region For Table
    addTableRow = (table) => {
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
                displayInJson();
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
                            displayInJson();
                        });
                        tableContent.push(input);
                    }
                break;
                case false:
                    let input = inputNumbers(this.hitbox[key]);
                    input.addEventListener("input", () => {
                        this.hitbox[key] = inputFilter(input);
                        displayInJson();
                    });
                    tableContent.push(input);
                break;
            }
        }

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';

        deleteButton.addEventListener('click', ()=> {
            deleteRow(this.tableRow);
            this.deleteThis();
            displayInJson();
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

    deleteThis(){
        this.frameData.DeleteHitbox(this);
    }
}