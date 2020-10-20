class DrawGraphMulti{
    //3 graph version
    phase1 = ["64-cell stage", "256-cell stage", "dome stage", "50% epiboly stage"];
    phase2 = ["64-cell stage","shield stage", "bud stage", "5 somite stage"];
    phase3 = ["64-cell stage","16 somite stage","20 somite stage","prim 5 stage"];

    phases = [this.phase1, this.phase2, this.phase3];
    
    vegaObj;
    data = [];

    constructor(rawData){
        this.rawData = JSON.parse(rawData);
    }
    filterByCheckbox = () => {
      let checkboxes = document.getElementsByClassName("filter");
      for (let i = 0; i < checkboxes.length; i++){
        if (!checkboxes[i].checked){
          if (checkboxes[i].value == "64-cell stage"){
            let id = checkboxes[i].id;
            let graphId = id[6];
            if (graphId == 0){
              this.phase1.shift();
            }else if(graphId == 1){
              this.phase2.shift();
            }else if(graphId == 2){
              this.phase3.shift();
            }else{
              console.log("invalid graphId");
            }
          }else{
            let val = checkboxes[i].value;
            let keepIteration = true;
            for (let i = 0; i < this.phase1.length; i++){
              if (this.phase1[i] == val){
                this.phase1.splice(i, 1);
                keepIteration = false;
              }
            }
            if (keepIteration){
              for (let i = 0; i < this.phase2.length; i++){
                if (this.phase2[i] == val){
                  this.phase2.splice(i, 1);
                  keepIteration = false;
                }
              }
            }
            if(keepIteration){
              for (let i = 0; i < this.phase3.length; i++){
                if (this.phase3[i] == val){
                  this.phase3.splice(i, 1);
                  keepIteration = false;
                }
              }
            }
          }
        }
      }
    }
    prepareData = () => {
      this.filterByCheckbox();
        //iterate over JSON to build a new JSON with format matching the input for Vega-lite
        this.phases.forEach(phase => {
          let tempData = [];
          for (let i = 0; i < phase.length; i++){
            let singleData = {"x":0, "y":0};
            let val = this.rawData[phase[i]];

            singleData.x = phase[i];;
            singleData.y = parseFloat(val);
            tempData.push(singleData);
          }
          this.data.push(tempData)
        })
    }
    prepareSpec = (graph_num) => {
      let vegaObj = {
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "description": "A basic line chart example.",
            "width": 500,
            "height": 200,
            "padding": 5, 
          
            "data": [
              {
                "name": "table",
                "values": this.data[graph_num]
              }
            ],
          
            "scales": [
              {
                "name": "x",
                "type": "point",
                "range": "width",
                "domain": {"data": "table", "field": "x"}
              },
              {
                "name": "y",
                "type": "linear",
                "range": "height",
                "nice": true,
                "zero": true,
                "domain": {"data": "table", "field": "y"}
              },
              {
                "name": "color",
                "type": "ordinal",
                "range": "category",
                "domain": {"data": "table", "field": "c"}
              }
            ],
          
            "axes": [
              {
                "orient": "bottom", 
                "scale": "x", 
                "title": "Expression Stage"
              },
              {"orient": "left", 
              "scale": "y",
              "title": "Log2 Ratio"
            }
            ],
          
            "marks": [
              {
                "type": "group",
                "from": {
                  "facet": {
                    "name": "series",
                    "data": "table",
                    "groupby": "c"
                  }
                },
                "marks": [
                  {
                    "type": "line",
                    "point":true,
                    "from": {"data": "series"},
                    "encode": {
                      "enter": {
                        "x": {"scale": "x", "field": "x"},
                        "y": {"scale": "y", "field": "y"},
                        "stroke": {"scale": "color", "field": "c"},
                        "strokeWidth": {"value": 2}
                      },
                      "update": {
                        "strokeOpacity": {"value": 1}
                      },
                      "hover": {
                        "strokeOpacity": {"value": 0.5}
                      }
                    }
                  },
                  {
                    "type": "symbol",
                    "from": {"data": "series"},
                    "encode": {
                      "enter": {
                        "description": {
                          "signal": "timeFormat(datum.unit0, '%B %Y') + ': ' + format(datum.change, '+.1%') + ' change from prior year'",
                        },
                        "tooltip": {
                          "signal": "{'y':datum['y']}"
                        },
                        "x": {"scale": "x", "field": "x"},
                        "y": {"scale": "y", "field": "y"},
                        "fill": {"value": "black"},
                        "size": {"value": 30}
                      }
                    }
                  }
                ]
              }
            ]
          }
      return vegaObj
    }
    addSequence = () => {
      let seq = this.rawData["sequence"];
      let shortSeq = seq;
      /*if (seq.length > 50){
        shortSeq = seq.slice(0, 50);
        document.getElementById("full-seq-btn").display = "inline-block";
      }*/
      document.getElementById("sequence").innerHTML = "<strong>Sequence:</strong> " + shortSeq;
    }
    addGraphTitle = () => {
      let accession = this.rawData["uniprot accession"];
      let protName = this.rawData["protein names"];
      let similarProt = this.rawData["similar protein"];

      document.getElementById("graph-title").innerHTML = 
      "<strong>Uniprot Accession:</strong> " + accession + "<br/>" + 
      "<strong>Protein Name:</strong> " + protName + "<br/>" + 
      "<strong>Similar Protein:</strong> " + similarProt;
    }
    main = () => {
        this.prepareData();
        this.addGraphTitle();
        this.addSequence();
        for (let i = 0; i < this.data.length; i++){
          let vegaObj = this.prepareSpec(i);
          let divName = "#multi-graph-container-" + i.toString();
          vegaEmbed(divName, vegaObj);
        }
    }
}