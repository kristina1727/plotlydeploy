function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var washes = data.metadata;
    console.log(washes);   
    // Create a variable that holds the first sample in the array.
    var metadataArray = washes.filter(sampleObj => sampleObj.id ==sample);
    console.log(metadataArray);
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResults = metadataArray[0];
    console.log (metaResults);
    
    // 3. Create a variable that holds the washing frequency.
    var wfreq = metaResults.wfreq
    console.log (wfreq)

    // 3. Create a variable that holds the samples array. 
    var bacteria = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = bacteria.filter(sampleObj => sampleObj.id === sample);
    //  5. Create a variable that holds the first sample in the array.
    var results = resultArray[0];
    console.log(results);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids;
    // console.log(otu_ids);

    var otu_labels = results.otu_labels.slice(0, 10).reverse();
    // console.log(otu_labels);

    var sample_values = results.sample_values.slice(0, 10).reverse();
    // console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(sampleObj => "OTU " + sampleObj).slice(0, 10).reverse();
    // console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: otu_labels,
      marker: {
        color: "#0e2264"
      }

    };

    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "Top 10 Bacteria Cultures Found", font: {family: "Franklin Gothic Medium"}},
      font: {color:"#0e2264"},
      paper_bgcolor: "b1dcea",
      plot_bgcolor: "b1dcea"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    // 1. Create the trace for the bubble chart.
    var trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'YlGnBu',

      }
    };
    var bubbleData = [trace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "Bacteria Cultures Per Sample", font: {family: "Franklin Gothic Medium"}},
      xaxis: { title: "OTU ID" },
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
      hovermode: 'closest',
      font: {color:"#0e2264"},
      paper_bgcolor: "b1dcea",
      plot_bgcolor: "b1dcea"
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var trace = {
      value: wfreq,
      title: { text: "Washes per Week", font: {size: 14, family: "Franklin Gothic Medium"}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10], tickcolor: "#0e2264" },
        bar: {color: "#0e2264"},
        bordercolor: "#595959",
        steps: [
          { range: [0, 2], color: "#e8f6d4" },
          { range: [2, 4], color: "#bfe6b5" },
          { range: [4, 6], color: "#79cabc" },
          { range: [6, 8], color: "#39aec3" },
          { range: [8, 10], color: "#1f7db7" }
        ],

      }
    }

    var gaugeData = [trace];

    // // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: "Belly Button Washing Frequency",
      width: 500, 
      height: 375,
      paper_bgcolor: "b1dcea", 
      font: {color:"#0e2264",family: "Franklin Gothic Medium"} 
    };

    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}
