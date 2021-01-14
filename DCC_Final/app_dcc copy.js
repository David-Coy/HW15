let dropdown = d3.select("#selDataset");
dropdown.on("change", handleSelect);

function handleSelect(event) {
  let id = dropdown.property("value");
  getPlots(id);
}

d3.json("./data/samples.json").then((data) => {
  //console.log(data);
  // open samples.json in firefox to view structure
  //append all of the availiable id's to the provided dropdown menu
  //console.log(data.names);

  data.names.forEach(function (name_id) {
    //https://github.com/d3/d3-selection/blob/v2.0.0/README.md#selection_property
    //https://stackoverflow.com/questions/43121679/how-to-append-option-into-select-combo-box-in-d3
    //console.log(dropdown.append("option").text(name_id).property("value"));
    dropdown.append("option").text(name_id).property("value");
  });
  //console.log(data.names);
  getInfo(data.names[0]);
});

//Get info for each name ID and create a small summary section to show information
function getInfo(id) {
  //Again read the json file
  d3.json("./data/samples.json").then((data) => {
    let names = data.names;
    let metadata = data.metadata;
    let samples = data.samples;
    //console.log(id);
    //console.log(data);
    //dd;
    //console.log(data.id.toString());
    metadata_info = metadata.filter((data) => {
      data.id.toString() === id;
      //console.log(data);
    })[0];

    let result = metadata.filter((meta) => meta.id.toString() === id)[0];
    let demographicInfo = d3.select("#sample-metadata");
    //Remove all children from HTML:
    demographicInfo.html(""); // This is used to clear summary table everytime  a new value is entered
    // or use this: demographicInfo.selectAll("*").remove();

    // The Object.entries() method returns an array of a given object's own enumerable
    // string-keyed property [key, value] pairs
    Object.entries(result).forEach((item) => {
      key = item[0]; // collect string key of the pair
      value = item[1]; // collect the value of the dict/pair
      //console.log(typeof value, value);
      demographicInfo
        .append("h5")
        .text(key.toUpperCase() + ": " + value.toString());
    });
  });
}

function getPlots(id) {
  //console.log(id);
  //Again the samples.json file needs to be parsed
  console.log(typeof id, id);
  d3.json("./data/samples.json").then((data) => {
    idk = data.samples.filter((data2) => {
      console.log(data2.id.toString() === id);
      data2.id === id;
    });
    console.log(idk[0]);
    let sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
    //console.log(sampleValues);
    let OTU_top = data.samples[0].otu_ids.slice(0, 10).reverse();

    let OTU_id = OTU_top.map((d) => "OTU " + d);
    //console.log(`OTU IDS: ${OTU_id}`);

    let labels = data.samples[0].otu_labels.slice(0, 10);
    //console.log(`${sampleValues}, #{OTU_id}`);
    let trace1 = {
      x: sampleValues,
      y: OTU_id,
      text: labels,
      marker: {
        opacity: 0.3,
        color: "blue",
        line: {
          color: "rgb(8,48,107)",
          width: 2.5,
          opacity: 1,
        },
      },
      type: "bar",
      orientation: "v",
    };
    let data1 = [trace1];

    let layout1 = {
      bargap: 0.95,
      bargroupgap: 0.1,
      height: 500,
      width: 1000,
      title:
        "Top 10 OTUs (Operational Taxonomic Units) <br> Found in the Individual",
      yaxis: {
        tickmode: "linear",
        tickangle: -0,
      },
      margin: {
        l: 100,
        r: 10,
        t: 100,
        b: 100,
      },
    };

    // Create Bar Plot
    Plotly.newPlot("bar", data1, layout1);

    // Create Bubble Chart
    let trace2 = {
      x: data.samples[0].otu_ids,
      y: data.samples[0].sample_values,

      mode: "markers",
      marker: {
        size: data.samples[0].sample_values, // size of bubble/marker is a function of the value
        color: data.samples[0].otu_ids, // colors are ae function of otu_ids
      },
      text: data.samples[0].otu_labels,
    };

    // set the layout for the bubble plot
    let layout_2 = {
      xaxis: { title: "OTU ID" },
      height: 500,
      width: 1000,
    };

    // creating data variable
    let data2 = [trace2];

    // create the bubble plot
    Plotly.newPlot("bubble", data2, layout_2);
  });
}

// create the function for the change event
// optionChanged is referenced in the html file
function optionChanged(id) {
  getPlots(id);
  //getInfo(id);
}
dropdown.dispatch("change");
