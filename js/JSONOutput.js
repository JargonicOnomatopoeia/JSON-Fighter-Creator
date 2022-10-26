import { animationListData } from "./animationlist.js";

export const displayInJson = () =>{
    let outputScreen = document.getElementById("text20 jsonoutput");
    outputScreen.value = JSON.stringify(animationListData);
}

export const downloadJSON = () => {
    let string = JSON.stringify(animationListData);

    let tempLink = document.createElement("a");
    tempLink.download = "JSON-Fighter-Creater.json";

    let text = new Blob(
        [string], {
            type: "text/plain"
        });

    tempLink.href = window.URL.createObjectURL(text);
    tempLink.click();  
    delete tempLink.remove();  
}

export const copyJSONToClipboard = () => {
    if(navigator.clipboard){
        navigator.clipboard.writeText(JSON.stringify(animationListData));
    }
}