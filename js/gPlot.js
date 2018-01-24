
// SVG geometry
var width = 560;
var height = 520;
var margin = { top: 0, left: 10, bottom: 40, right: 10 };   

// gPlot variables
var parseTime = d3.timeParse("%Y-%m-%d");
var x0G = 200,
  y0G = 300;
var xG = d3.scaleTime()
    .rangeRound([0, width-x0G]);
var yG = d3.scaleLinear()
    .rangeRound([height-y0G, 0]);

// append SVG
var gPlot = d3.select('#vis')
  .append("svg")
  .attr('width', width)
  .attr('height', height);

gPlot.append("g")

gP = gPlot.select('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('class', 'slide1');

// Greenland Plot  
var line = d3.line()
  .x(function(d) { return xG(d.date); })
  .y(function(d) { return yG(d.mass); });

d3.csv('greenland_mass_date.csv', function(d){
  d.date = parseTime(d.date);
  d.mass = +d.mass;
  return d;
  }, function(error, data) {
    if (error) throw error;

    xG.domain(d3.extent(data, function(d) { return d.date; }));
    yG.domain(d3.extent(data, function(d) { return d.mass; }));

    linePlot = gP.append("g")
      .attr("transform", "translate("+(x0G)+","+(y0G)+")")
      // .attr("class", "slide1 slide2");

    linePlot.call(d3.axisBottom(xG))
      .selectAll(".domain")
      .remove();

    linePlot.append("g")
      .call(d3.axisLeft(yG))
      .selectAll(".domain")
      .remove()
      // .append('text')
      // .text('Ice mass anomaly (Gigatonnes)');

    linePlot.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", line);

  });