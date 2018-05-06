// This code lays out the mainTimeline and miniTimeline
// base graphics, and all scaling.

// Mobile check
var mobile = $(window).width();
var docWindow = 480;

// Timeline Parameters
var lanes = ["Timeline"],
  laneLength = lanes.length,
  timeBegin = -1000000,
  timeEnd = 2020;

// Scale intervals
var timeF = [2020, 1800, 0, -22000, -100000],
  time0 = [1801, 1, -21999, -99999, -999999],
  units = [10, 100, 1000, 10000, 100000],
  nUnits = timeF.map(function(n, i) { return (timeF[i]+1-time0[i]) / units[i]; });

timeF.splice(5,0,-1000000)

// Placement
var mTop = 50,
  m = 15,
  mLeft = 30,
  mainHeight = 6000 - mTop-m,
  miniHeight = 470 - mTop-m,
  miniWidth = 70 - 2*m,
  mainWidth = 220 - miniWidth;

// Calculate ranges for shifting-scale timeline
nUnits.splice(0,0,0);
var nDom = nUnits.map( function(n, i) { return nUnits.slice(0,i+1).reduce(getSum) ;}),
  totalDom = nUnits.reduce(getSum),
  scaleDom = nDom.map( function(n) { return n*mainHeight/totalDom});

var scale0 = d3.scaleLinear().domain([timeF[0], timeF[1]]).range([scaleDom[0],scaleDom[1]]),
  scale1 = d3.scaleLinear().domain([timeF[1], timeF[2]]).range([scaleDom[1],scaleDom[2]]),
  scale2 = d3.scaleLinear().domain([timeF[2], timeF[3]]).range([scaleDom[2],scaleDom[3]]),
  scale3 = d3.scaleLinear().domain([timeF[3], timeF[4]]).range([scaleDom[3],scaleDom[4]]),
  scale4 = d3.scaleLinear().domain([timeF[4], timeF[5]]).range([scaleDom[4],scaleDom[5]]);

// Build each y-axis
var axis0 = d3.axisLeft(scale0).ticks(20, "f"),
  axis1 = d3.axisLeft(scale1).ticks(20, "f"),
  axis2 = d3.axisLeft(scale2).ticks(20, "f")
    .tickFormat(function(d) {var showYear0 = d >= 0 ? d3.format(".0f")(d) : d3.format(",.0f")(-d)+' BCE';
          return( showYear0 )}),
  axis3 = d3.axisLeft(scale3).ticks(10)
    .tickFormat(function(d) {var showYear0 = d >= 0 ? d3.format(".0f")(d) : d3.format(",.0f")(-d)+' BCE';
          return( showYear0 )}),
  axis4 = d3.axisLeft(scale4).ticks(10)
    .tickFormat(function(d) {var showYear0 = d >= 0 ? d3.format(".0f")(d) : d3.format(",.0f")(-d)+' BCE';
          return( showYear0 )});

// horizontal scaling
var xMain = d3.scaleLinear()
  .domain([0, laneLength])
  .range([0, mainWidth]);
var xMini = d3.scaleLinear()
  .domain([0, laneLength])
  .range([0, miniWidth]);

// vertical scaling
var yMini = d3.scaleLinear()
  .domain([timeEnd, timeF[5]])
  .range([0, miniHeight]);
var gispEnd = yMini(-237000)

function mainScale(inputNumber) {
      if (timeF[1] <= inputNumber && inputNumber <= timeF[0]) {
        return scale0(inputNumber);
      } else if (timeF[2] <= inputNumber && inputNumber < timeF[1]) {
        return scale1(inputNumber);
      } else if (timeF[3] <= inputNumber && inputNumber < timeF[2]) {
        return scale2(inputNumber);
      } else if (timeF[4] <= inputNumber && inputNumber < timeF[3]) {
        return scale3(inputNumber);
      } else if (timeF[5] <= inputNumber && inputNumber < timeF[4]) {
        return scale4(inputNumber);
      };
};

var bounds = timeF.map(function(n) {return mainScale(n) ;} )

// miniLocator vertical, year, and depth scaling
function miniLocatorScale(inputNumber) {
      if (bounds[0] <= inputNumber && inputNumber <= bounds[1]) {
        return yMini(scale0.invert(inputNumber));
      } else if (bounds[1] <= inputNumber && inputNumber < bounds[2]) {
        return yMini(scale1.invert(inputNumber));
      } else if (bounds[2] <= inputNumber && inputNumber < bounds[3]) {
        return yMini(scale2.invert(inputNumber));
      } else if (bounds[3] <= inputNumber && inputNumber < bounds[4]) {
        return yMini(scale3.invert(inputNumber));
      } else if (inputNumber >= bounds[4]) {
        return yMini(scale4.invert(inputNumber));
      };
};

function miniYearScale(inputNumber) {
      if (bounds[0] <= inputNumber && inputNumber <= bounds[1]) {
        return scale0.invert(inputNumber);
      } else if (bounds[1] <= inputNumber && inputNumber < bounds[2]) {
        return scale1.invert(inputNumber);
      } else if (bounds[2] <= inputNumber && inputNumber < bounds[3]) {
        return scale2.invert(inputNumber);
      } else if (bounds[3] <= inputNumber && inputNumber < bounds[4]) {
        return scale3.invert(inputNumber);
      } else if (inputNumber >= bounds[4]) {
        return scale4.invert(inputNumber);
      };
};

// Approximate linear relationships between year and depth
var dScale0 = d3.scaleLinear().range([-6.00, -69.25]).domain([1988, 1800]),
  dScale1 = d3.scaleLinear().range([-76.93, -477.88]).domain([1800, 0]),
  dScale2 = d3.scaleLinear().range([-557, -1737]).domain([0, -9000]),
  dScale3 = d3.scaleLinear().range([-1737, -2027]).domain([-9000, -22000]),
  dScale4 = d3.scaleLinear().range([-1999, -2426]).domain([-22000, -48000]),
  dScale5 = d3.scaleLinear().range([-2426, -2768]).domain([-48000, -100000]),
  dScale6 = d3.scaleLinear().range([-2768, -3005]).domain([-48000, -237000]);

function depthScale(inputNumber) {
      if (1800 <= inputNumber && inputNumber <= 1988) {
        return dScale0(inputNumber);}
      else if (0 <= inputNumber && inputNumber < 1800) {
        return dScale1(inputNumber);}
      else if (-9000 <= inputNumber && inputNumber < 0) {
        return dScale2(inputNumber);}
      else if (-22000 <= inputNumber && inputNumber < -9000) {
        return dScale3(inputNumber);}
      else if (-48000 <= inputNumber && inputNumber < -22000) {
        return dScale4(inputNumber);}
      else if (-100000 <= inputNumber && inputNumber < -48000) {
        return dScale5(inputNumber);}
      else if (-237000 <= inputNumber && inputNumber < -100000) {
        return dScale6(inputNumber);}
};

// Build timeline frames
if (mobile > docWindow) {
    var mainTL = d3.select("#sections")
      .append("svg")
      .attr("width", mainWidth+miniWidth+40)
      .attr("height", mainHeight+mTop+m)
      .append("g")
      .attr("transform", "translate(" + (miniWidth+mLeft+m+40) + "," + mTop + ")") // position mainTL
} else {
  var mainTL = d3.select("#sections")
      .append("svg")
      .attr("width", mainWidth+miniWidth+40)
      .attr("height", mainHeight+mTop+m)
      .append("g")
      .attr("transform", "translate(" + (miniWidth+mLeft+m+70) + "," + mTop + ")") // position mainTL
}


mainTL.append("rect")
  .attr("x", .12*xMain(1))
  .attr("width", .75*xMain(1))
  .attr("height", mainHeight-(mainScale(-1000000)-mainScale(-600000)))
  .attr("fill", "#1B4757");

var miniTL = d3.select("#miniTL")
  .append("svg")
  .attr("width", miniWidth+2*m)
  .attr("height", miniHeight+2*mTop)
  .append("g")
  .attr("transform", "translate(" + mLeft + "," + mTop + ")") // position miniTL
  .attr("height", miniHeight)
  .attr("width", miniWidth);

miniTL.append("rect")
  .attr("x", 0.05*xMini(1))
  .attr("width", .75*xMini(1))
  // height edited to match limit of miniBox slider
  // .attr("height", (miniHeight-16))
  .attr("height", (miniHeight-(yMini(-400000))))
  .attr("fill", "#1B4757");

// Load data and fill timelines
d3.tsv("Spreadsheet.tsv", function(items) {
// d3.tsv("timeline.5.2.tsv", function(items) {

  var laneStyle = 0;
  // can be replaced with laneStyle if lane styles are desired

  mainTL.append("g").selectAll("mainEvent")
    .data(items)
    .enter().append("rect")
    .attr("class", function(d) {return "event" + laneStyle + " mainEvent" + " event" + laneStyle + d.start + " step"})
    .attr("id", function(d) {return "mainEvent"+ laneStyle + d.start})
    .attr("y", function(d) {return mainScale(d.end, timeF, time0, scaleDom);})
    .attr("x", .12*xMain(1))
    .attr("width", .75*xMain(1))
    .attr("height", function(d) {return mainScale(d.start, timeF, time0, scaleDom)-mainScale(d.end, timeF, time0, scaleDom)});

  var yearAxis = mainTL.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20,0)");
  yearAxis.append("g").call(axis0);
  yearAxis.append("g").call(axis1);
  yearAxis.append("g").call(axis2);
  yearAxis.append("g").call(axis3);
  yearAxis.append("g").call(axis4);
  yearAxis.selectAll(".domain").remove();

  // Remove mainEvent for title slide
  mainTL.selectAll('.mainEvent').filter('.eventime02018')
    .classed('eventime0', false)
    .attr('fill', 'none');

  miniTL.append("g").selectAll("miniEvent")
    .data(items)
    .enter().append("rect")
    .attr("class", function(d) {return "event" + laneStyle + " miniEvent" + " event" + laneStyle + d.start})
    .attr("y", function(d) {return yMini(d.end);})
    .attr("x", 0.05*xMini(1))
    .attr("width", .75*xMini(1))
    .attr("height", function(d) {
      var miniEventHeight = yMini(d.start)-yMini(d.end);
      var showHeight = miniEventHeight > 2 ? miniEventHeight : 2;
      return showHeight;
    });

  // miniLocator with year ticker
  var miniLocator = miniTL.append("g")
    .attr("id", "miniLocator")
    .attr("width", miniHeight+2*m)
    .attr("height", 10);

  miniLocator.append("rect")
    .attr("id", "miniBox")
    .attr("width", .85*xMini(1))
    .attr("height", 4)
    .attr("fill", "#3a96b8")
    .attr("opacity", .5)
    .attr();

  miniLocator.append("line")
    .attr("xMain", -4)
    .attr("xMini", 0)
    .attr("y1", 2)
    .attr("yMini", 2)
    .attr("stroke-width", 1)
    .attr("opacity", .5)
    .attr("stroke", "#3a96b8");

  miniLocator.append("text")
    .attr("id", "miniYear")
    .attr("transform", "translate(-8,20)rotate(-90)");
 })

function getSum(total, num) {
    return total + num;
};

  function imageMouseOver(d, i) {
    if (d3.select(this).style("opacity") != 0) {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1);}
  };

  function imageMouseOut(d, i) {
    if (d3.select(this).style("opacity") > 0.4) {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", .4);}
  };

  function linkMouseOver(d, i) {
    if (d3.select(this).style("opacity") != 0) {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1);}
  };

  function linkMouseOut(d, i) {
    if (d3.select(this).style("opacity") > 0.8) {
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", .7);}
  };
