class EventHandler{
    constructor(){}
    static searchButtonListener(){
        document.getElementById("search-btn").addEventListener("click", function(){
            let keyType = document.getElementById('key-type-dropdown').value;
            let key = document.getElementById('key-textbox').value;
            if (Util.checkValidInput(key)){
                key = Util.trimKey(key);
                RequestData.pyRequest(key,keyType);
            };
        })
        //filter button does the same
        document.getElementById("filter-btn").addEventListener("click", function(){
            let keyType = document.getElementById('key-type-dropdown').value;
            let key = document.getElementById('key-textbox').value;
            if (Util.checkValidInput(key)){
                key = Util.trimKey(key);
                RequestData.pyRequest(key,keyType);
            };
        })
    }
    static main(){
        this.searchButtonListener();
    }
}