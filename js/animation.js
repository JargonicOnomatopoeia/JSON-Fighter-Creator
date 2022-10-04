import { animationList } from "./animationlist.js";
import { DisplayInJson } from "./JSONOutput.js";
import { DeleteRow } from "./table.js";

export class Animation{
    constructor(_animationName = ""){

        this.frameDataListClasses = [];

        this.animation = {
            name: _animationName,
            frameDataList: []
        }

        this.tableRow = null;
    }

    AddTableRow = (table) => {
        let contentList = [];
        let container = document.createElement('tr');
        this.tableRow = container;

        //#region 
        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = this.animation.name;
        

        nameInput.addEventListener('input', () => {
            this.animation.name = nameInput.value;
        });
        //#endregion
        contentList.push(nameInput);

        //#region 
        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';

        deleteButton.addEventListener('click', () => {
            this.DeleteThis();
        });
        //#endregion
        contentList.push(deleteButton);

        while(contentList.length){
            let containerC = document.createElement('td');
            containerC.appendChild(contentList.shift());
            container.appendChild(containerC);
        }
        container.firstElementChild.setAttribute('colspan', 2);
        table.appendChild(container);
    }

    AddFrameData = (_frameData) => {
        this.frameDataListClasses.push(_frameData);
        this.animation.frameDataList.push(_frameData.frameData);
    }

    //#region Delete Region
    DeleteFrameData = (_frameData) => {
        let index = this.frameDataListClasses.findIndex(i => i == _frameData);
        delete this.animation.frameDataList.splice(index, 1);
        let temp = this.frameDataListClasses.splice(index, 1);
        temp[0].DeleteThis();
    }

    DeleteThis = () => {
        //#region DeleteRows
        console.log("Working");
        for(let x = 0; x < this.frameDataListClasses.length;x++){
            console.log(this.frameDataListClasses[x].tableRow);
            DeleteRow(this.frameDataListClasses[x].tableRow);
        }

        if(animationList.currentAnimation == this){
            animationList.currentAnimation = null;
            animationList.currentFrame = null;
        }
        console.log(this.tableRow);
        DeleteRow(this.tableRow);
        //#endregion

        //#region Delete Data
        while(this.frameDataListClasses > 0){
            this.DeleteFrameData(this.frameDataListClasses[0]);
        }

        animationList.RemoveFromList(this);
        DisplayInJson();
        //#endregion
        
    }   
    //#endregion
}