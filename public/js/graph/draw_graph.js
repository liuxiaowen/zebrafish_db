class DrawGraphSingle{
    //one graph version
    /*phase1 = ["64-cell stage", "256-cell stage", "dome stage", "50% epiboly stage"];
    phase2 = ["shield stage", "bud stage", "5 somite stage"];
    phase3 = ["16 somite stage","20 somite stage","prim 5 stage"];*/

    //3 graph version
    phase1 = ["64-cell stage", "256-cell stage", "dome stage", "50% epiboly stage"];
    phase2 = ["64-cell stage","shield stage", "bud stage", "5 somite stage"];
    phase3 = ["64-cell stage","16 somite stage","20 somite stage","prim 5 stage"];

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
                          "signal": "format(datum.change, '+.1%')"
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
    }
    main(){
        this.prepareData();
        this.prepareSpec();
        vegaEmbed('#graph-container', this.vegaObj);
    }

}