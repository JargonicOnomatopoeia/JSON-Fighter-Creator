import { animationList } from "./animationlist.js";

export const DisplayInJson = () =>{
    let outputScreen = document.getElementById("text20 jsonoutput");
    outputScreen.value = JSON.stringify(animationList.animationListData);
}

export const DownloadJSON = () => {
    let string = JSON.stringify(GetData());

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

export const CopyJSONToClipboard = () => {
    if(navigator.clipboard){
        navigator.clipboard.writeText(JSON.stringify(GetData()));
    }
}