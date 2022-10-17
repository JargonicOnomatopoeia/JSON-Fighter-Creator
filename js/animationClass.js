import * as animationList from "./animationList.js";
import * as animator from "./animator.js";
import { displayInJson } from "./jsonOutput.js";
import { deleteRow } from "./table.js";

export class animation{
    constructor(_animationName = ""){

        this.frameDataListClasses = [];

        this.animationData = {
            name: _animationName,
            frameDataList: []
        }

        this.tableRow = null;
    }

    addTableRow = (table) => {
        let contentList = [];
        let container = document.createElement('tr');
        this.tableRow = container;

        //#region 
        let nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = this.animationData.name;
        

        nameInput.addEventListener('input', () => {
            this.animationData.name = nameInput.value;
            displayInJson();
        });

        nameInput.addEventListener('click', () => {
            animationList.setCurrentAnim(this);
            animator.reset();
        });
        //#endregion
        contentList.push(nameInput);

        //#region 
        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';

        deleteButton.addEventListener('click', () => {
            this.deleteThis();
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

    addFrameData = (_frameData) => {
        this.frameDataListClasses.push(_frameData);
        this.animationData.frameDataList.push(_frameData.frameData);
    }

    //#region Delete Region
    deleteFrameData = (_frameData) => {
        let index = this.frameDataListClasses.findIndex(i => i == _frameData);
        delete this.animationData.frameDataList.splice(index, 1);
        delete this.frameDataListClasses.splice(index, 1);
    }

    deleteThis = () => {
        //#region DeleteRows

        for(let x = 0; x < this.frameDataListClasses.length;x++){
            deleteRow(this.frameDataListClasses[x].tableRow);
            this.frameDataListClasses[x].tableRow = null;
        }

        if(animationList.currentAnimation == this){
            animationList.setCurrentAnim();
            animationList.setCurrentFrame();
        }
        deleteRow(this.tableRow);
        //#endregion

        //#region Delete Data
        while(this.frameDataListClasses > 0){
            this.deleteFrameData(this.frameDataListClasses[0]);
        }

        animationList.removeFromList(this);
        displayInJson();
        //#endregion
        
    }   
    //#endregion
}