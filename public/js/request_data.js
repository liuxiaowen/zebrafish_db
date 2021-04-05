class RequestData{
    constructor(){}
    static callAjax(url, callback){
        var xmlhttp;
        // compatible with IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
    static initGraph(data){
        if (data[0] == "{"){
            /*let drawGraphSingle = new DrawGraphSingle(data);
            drawGraphSingle.main();*/
            
            let drawGraphMulti = new DrawGraphMulti(data);
            drawGraphMulti.main();
            Util.showGraph();
            Util.showSequence();
        }else{
            document.getElementById("graph-title").innerHTML = data;
            Util.hideGraph();
            Util.hideSequence();
        } 
    }
    static pyRequest(key,keyType){
        var cd_url;
        cd_url = '/cgi-bin/protein-search.py?key='+ key + '&keyType=' + keyType;
        this.callAjax(cd_url,this.initGraph);
    }
}