// @TODO: YOUR CODE HERE!
// Set up our chart
var svgWidth = 1000;
var svgHeight = 700;
var margin = { top: 30, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins

var svg = d3.select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// append an svg group
var chart = svg.append("g");

d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

url = "/data";
d3.json(url, function (err, data) {
    if (err) throw err;

    // copy data into global dataset
    dataset = data

    // Initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        // Define position
        .offset([80, -60])
        // The html() method allows us to mix JavaScript with HTML in the callback function
        .html(function (data) {
            var state = data.geography;
            return state;
        });

    // define scale functions(range)
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    // define axis functions
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    function findMinAndMaxX(dataColumnX) {
        xMin = d3.min(dataset, function (d) { return d[dataColumnX] * 0.8 });
        xMax = d3.max(dataset, function (d) { return d[dataColumnX] * 1.2 });
    };

    function findMinAndMaxY(dataColumnY) {
        yMin = d3.min(dataset, function (d) { return d[dataColumnY] * 0.8 });
        yMax = d3.max(dataset, function (d) { return d[dataColumnY] * 1.2 });
    };

    // set the default x-axis
    var defaultAxisLabelX = "percentBelowPoverty"

    // set the default y-axis
    var defaultAxisLabelY = "smokers"

    // call the findMinAndMax() on the default X Axis
    findMinAndMaxX(defaultAxisLabelX)
    findMinAndMaxY(defaultAxisLabelY)

    // set the domain of the axes
    xScale.domain([xMin, xMax]);
    yScale.domain([yMin, yMax])

    // create chart
    chart.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d[defaultAxisLabelX]);
        })
        .attr("cy", function (d) {
            return yScale(d[defaultAxisLabelY]);
        })
        .attr("r", 15)
        .attr("fill", "#4380BA")
        .attr("opacity", 0.75)

    // create state labels
    chart.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            return d.locationAbbr;
        })
        .attr("x", function (d) {
            return xScale(d[defaultAxisLabelX]);
        })
        .attr("y", function (d) {
            return yScale(d[defaultAxisLabelY]);
        })
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("class","stateText")


    // create x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    // create y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
)}