import { FrameData } from "./table.js";

class Animation{
    constructor(_animationName = ""){

        this.framaDataListClasses = [];

        this.animation = {
            name: "",
            framaDataList: []
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
        deleteButton.innerText = 'X';

        deleteButton.addEventListener('click', () => {
            DeleteRow(this.tableRow);
        });
        //#endregion
        contentList.push(deleteButton);

        while(contentList.length){
            let containerC = document.createElement('td');
            containerC.appendChild(contentList.shift());
            container.appendChild(containerC);
        }
        
        table.appendChild(container);
    }

    AddFrameData = (_frameData) => {
        this.framaDataListClasses.push(_frameData);
        this.animation.framaDataList.push(_frameData.frameData);
    }

    //#region Delete Region
    DeleteFrameData = (_frameData) => {
        let index = this.framaDataListClasses.findIndex(i => i == _frameData);
        this.animation.frameDataList.splice(index, 1);
        this.framaDataListClasses.splice(index, 1).DeleteThis();
    }

    DeleteThis = () => {
        while(this.frameDataListClasses.length > 0){
            DeleteFrameData(this.frameDataListClasses[0]);
        }

        delete this;
    }   
    //#endregion
}