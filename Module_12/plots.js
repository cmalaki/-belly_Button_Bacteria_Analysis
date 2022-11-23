Plotly.newPlot("plotArea", [{x: [1, 2, 3], y: [10, 20, 30]}]);

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = sampleNames [0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
});
}
init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  }

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text('${key.toUpperCase()}: ${value}');
      });
    });
  }
        
function buildCharts(sample) { 
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var IDs_ = result.otu_ids.slice(0, 10).reverse();
      var labels_ = result.otu_labels.slice(0, 10).reverse();
      var values_ = result.sample_values.slice(0, 10).reverse();
  
      var bubble_Labels = result.otu_labels;
      var bubble_Values = result.sample_values;
      var IDs = result.otu_ids;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = IDs_.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: values_,
        y: yticks,
        type: 'bar',
        orientation: 'h',
        text: labels_
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
          title: "Top 10 Bacteria Cultures Found"
       
   
    };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  
  
      bubble_Labels = result.otu_labels;
      bubble_Values = result.sample_values;
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: IDs,
        y: bubble_Values,
        text: bubble_Labels,
        mode: "markers",
        marker: {
          size: bubble_Values,
          color: IDs,
          colorscale: "Jet"
        }
     }
      ];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OUT ID"},
        hovermode: "closest",
        automargins: true
    
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
  
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata;
      var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
  
      // 2. Create a variable that holds the first sample in the metadata array.
      var gauge_result = gaugeArray[0];
  
  
      // 3. Create a variable that holds the washing frequency.
      var wfreqs = gauge_result.wfreq;
      //console.log(wfreqs)
  
    // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
        value: wfreqs,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
        gauge: {
          axis: {range: [null,10], dtick: "2"},
  
          bar: {color: "black"},
          steps:[
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
          ], dtick: 2
        }
      }];
      
    
    // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        automargin: true
     
    };
  
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}