class Util{
    constructor(){}
    static trimKey = (key) => {
        let newKey = key.trim();
        return newKey;
    }
    static checkValidInput = (key) => {
        if (key == '' || key == ' '){
            alert("Please enter protein or gene name");
            return false;
        }
        return true;
    }
    static hideGraph = () => {
        let graphDivs = document.getElementsByClassName("multi-graph-container");
        for (let i = 0; i < graphDivs.length; i++){
            graphDivs[i].style.display = "none";
        }
    }
    static showGraph = () => {
        let graphDivs = document.getElementsByClassName("multi-graph-container");
        for (let i = 0; i < graphDivs.length; i++){
            graphDivs[i].style.display = "inline-block";
        }
    }
    static clearTitle = () => {
        //document.getElementById("graph-title").innerHTML = "";
    }
}
 