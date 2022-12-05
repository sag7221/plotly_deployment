function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log("data: ", data)
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
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log("sampleArray: ", sampleArray)
    //  5. Create a variable that holds the first sample in the array.
    var sampleFirst = sampleArray[0]
    console.log("sampleFirst: ", sampleFirst)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = sampleFirst.otu_ids;
    console.log("otu_ids: ", otu_ids)
    let otu_labels = sampleFirst.otu_labels.slice(0,10).reverse();
    console.log("otu_labels: ",otu_labels)
    let sample_values = sampleFirst.sample_values.slice(0,10).reverse();
    console.log("sample_values: ",sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    top_otu_ids = otu_ids.slice(0,10)
    console.log("top_otu_ids: ", top_otu_ids)
    top_otu_ids = top_otu_ids.map(otu_id => "OTU "+otu_id);
    console.log("top_otu_ids: ", top_otu_ids)
    top_otu_labels = otu_labels.slice(0,10)
    // sample_values_sorted = data.samples.map(sample => sample.sample_values).sort((a,b) => b-a);
    // filteredWreq = otu_details.filter(element => element != null);
    // console.log(filteredWreq);
    // console.log("sample_values_sorted: ",sample_values_sorted.slice(0,10))

    // var yticks = top_otu_labels;
    var yticks = top_otu_ids
    console.log("yticks: ", yticks)

    let trace = {
      x: sample_values,
      y: yticks,
      orientation: "h",
      type: "bar",
      text: otu_labels
    }

    // 8. Create the trace for the bar chart. 
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Species",
      // xaxis: {ticks: yticks, showticklabels: true},
      // yaxis: {title: "sample values", ticks: otu_ids, showticklabels: true}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("plotArea", barData, barLayout);
  });

}
