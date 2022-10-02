export const SelectedTextFilter = (selected, noIndents = false, noNum = false, noLetter = false) => {
    

    let position = selected.anchorOffset;
    let oldLength = selected.anchorNode.textContent.length;
    let text = selected.anchorNode.textContent;
    //let combine = text.substring(0, position-1) + text.substring(position);
    //console.log(combine);
    //selected.anchorNode.textContent = combine;
    if(noLetter == true){
        text = FilterStringNoLetter(text);
    }

    if(noNum == true){
        text = FilterStringNoNum(text);
    }

    if(noIndents == true){
        text = FilterStringNoIndentsLines(text);
    }
    selected.anchorNode.textContent = text;
    let newLength = text.length;
    position = (newLength - (oldLength - position));
    //position = (position > tableCell.innerText.length)?position-1: position;
    selected.setPosition(selected.anchorNode, position);
    return text;
}

export const FilterStringNoLetter = (string) => {
    return string.replace(/[A-Z a-z]/g, "");
}

export const FilterStringNoNum = (string) => {
    return string.replace(/[0-9]/g, "");
}

export const FilterStringNoIndentsLines = (string) => {
    return string.replace(/<br\s*\/?>/gi, "");
}

export const NumberNotEmpty = (string) => {
    if(string === ""){
        string = "0";
    }

    return string;
}

