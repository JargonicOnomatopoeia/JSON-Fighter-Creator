export const deleteRow = (container) => {
    if(container == null){
        return;
    }

    while(container.hasChildNodes()){
        let child = container.firstChild;
        //console.log(child);
        while(child.hasChildNodes()){
            child.removeChild(child.firstChild);
        }

        child.remove();
    }

    container.remove();
    container = null;
}




