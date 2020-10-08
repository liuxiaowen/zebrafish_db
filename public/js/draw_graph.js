class DrawGraph{
    phase1 = ["64-cell stage", "256-cell stage", "16 somite stage", "5 somite stage"];
    phase2 = ["bud stage", "shield stage", "50% epiboly stage"];
    phase3 = ["dome stage", "prim 5 stage", "20 somite stage"];

    phases = [this.phase1, this.phase2, this.phase3]

    vegaObj;
    data = [];

    constructor(rawData){
        this.rawData = JSON.parse(rawData);
    }
    prepareData(){
        //iterate over JSON to build a new JSON with format matching the input for Vega-lite
        let xPos = 0;
        let phaseCnt = 0;
          
        this.phases.forEach(phase => {
            let singleData = {"x":0, "y":0, "c":0};
            for (let i = 0; i < phase.length; i++){
                let singleData = {"x":0, "y":0, "c":0};
                let val = this.rawData[phase[i]];

                singleData.x = xPos;
                singleData.y = parseFloat(val);
                singleData.c = phaseCnt
                this.data.push(singleData);
                xPos++;
            }
            phaseCnt++;
            //at the end of each phase, add one more entry with same data as the last one to make the line connected
            singleData.x = xPos - 1;
            singleData.y = parseFloat(this.rawData[phase[phase.length - 1]]);
            singleData.c = phaseCnt
            this.data.push(singleData);
        })
        console.log(this.data)
    }
    prepareSpec(){
        this.vegaObj = {
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "description": "A basic line chart example.",
            "width": 500,
            "height": 200,
            "padding": 5,
          
            "signals": [
              {
                "name": "interpolate",
                "value": "linear",
                "bind": {
                  "input": "select",
                  "options": [
                    "basis",
                    "cardinal",
                    "catmull-rom",
                    "linear",
                    "monotone",
                    "natural",
                    "step",
                    "step-after",
                    "step-before"
                  ]
                }
              }
            ],
          
            "data": [
              {
                "name": "table",
                "values": this.data
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
              {"orient": "bottom", "scale": "x"},
              {"orient": "left", "scale": "y"}
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
                    "from": {"data": "series"},
                    "encode": {
                      "enter": {
                        "x": {"scale": "x", "field": "x"},
                        "y": {"scale": "y", "field": "y"},
                        "stroke": {"scale": "color", "field": "c"},
                        "strokeWidth": {"value": 2}
                      },
                      "update": {
                        "interpolate": {"signal": "interpolate"},
                        "strokeOpacity": {"value": 1}
                      },
                      "hover": {
                        "strokeOpacity": {"value": 0.5}
                      }
                    }
                  }
                ]
              }
            ]
          }
    }
    main(){
        this.prepareData();
        this.prepareSpec();
        vegaEmbed('#graph-container', this.vegaObj);
    }

}