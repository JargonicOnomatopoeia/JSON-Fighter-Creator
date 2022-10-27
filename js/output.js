import { animationListData } from "./animationlist.js";

export const displayInJson = () =>{
    let outputScreen = document.getElementById("text20 jsonoutput");
    outputScreen.value = JSON.stringify(animationListData);
}

export const createJSON = () => {
    let string = JSON.stringify(animationListData);

    let text = new Blob(
        [string], {
            type: "text/plain"
        });

    return window.URL.createObjectURL(text);  
}

export const copyJSONToClipboard = () => {
    if(navigator.clipboard){
        navigator.clipboard.writeText(JSON.stringify(animationListData));
    }
}