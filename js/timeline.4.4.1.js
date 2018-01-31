// Parameters
var lanes = ["Timeline"],
  laneLength = lanes.length,
  timeBegin = -1000000,
  timeEnd = 2020;

var tf = [2020, 1800, 0, -22000, -100000],
  t0 = [1801, 1, -21999, -99999, -999999],
  units = [10, 100, 1000, 10000, 100000],
  nUnits = tf.map(function(n, i) { return (tf[i]+1-t0[i]) / units[i]; });

tf.splice(5,0,-1000000)

// Placement
var mTop = 50,
  m = 15,
  mLeft = 30,
  mainHeight = 6000 - mTop-m,
  miniHeight = 470 - mTop-m,
  miniWidth = 70 - 2*m,
  mainWidth = 220 - miniWidth;

// Calculate ranges for shifting scale timeline
nUnits.splice(0,0,0);
var nDom = nUnits.map( function(n, i) { return nUnits.slice(0,i+1).reduce(getSum) ;}),
  totalDom = nUnits.reduce(getSum),
  scaleDom = nDom.map( function(n) { return n*mainHeight/totalDom});

var scale0 = d3.scaleLinear().domain([tf[0], tf[1]]).range([scaleDom[0],scaleDom[1]]),
  scale1 = d3.scaleLinear().domain([tf[1], tf[2]]).range([scaleDom[1],scaleDom[2]]),
  scale2 = d3.scaleLinear().domain([tf[2], tf[3]]).range([scaleDom[2],scaleDom[3]]),
  scale3 = d3.scaleLinear().domain([tf[3], tf[4]]).range([scaleDom[3],scaleDom[4]]),
  scale4 = d3.scaleLinear().domain([tf[4], tf[5]]).range([scaleDom[4],scaleDom[5]]);

var y2 = d3.scaleLinear()
  .domain([timeEnd, tf[5]])
  .range([0, miniHeight]);
var x1 = d3.scaleLinear()
  .domain([0, laneLength])
  .range([0, mainWidth]);
var x2 = d3.scaleLinear()
  .domain([0, laneLength])
  .range([0, miniWidth]);
var gispEnd = y2(-237000)

function multiScale(inputNumber) {
      if (tf[1] <= inputNumber && inputNumber <= tf[0]) {
        return scale0(inputNumber);
      } else if (tf[2] <= inputNumber && inputNumber < tf[1]) {
        return scale1(inputNumber);
      } else if (tf[3] <= inputNumber && inputNumber < tf[2]) {
        return scale2(inputNumber);
      } else if (tf[4] <= inputNumber && inputNumber < tf[3]) {
        return scale3(inputNumber);
      } else if (tf[5] <= inputNumber && inputNumber < tf[4]) {
        return scale4(inputNumber);
      };
};

var bounds = tf.map(function(n) {return multiScale(n) ;} )

function boxMultiScale(inputNumber) {
      if (bounds[0] <= inputNumber && inputNumber <= bounds[1]) {
        return y2(scale0.invert(inputNumber));
      } else if (bounds[1] <= inputNumber && inputNumber < bounds[2]) {
        return y2(scale1.invert(inputNumber));
      } else if (bounds[2] <= inputNumber && inputNumber < bounds[3]) {
        return y2(scale2.invert(inputNumber));
      } else if (bounds[3] <= inputNumber && inputNumber < bounds[4]) {
        return y2(scale3.invert(inputNumber));
      } else if (inputNumber >= bounds[4]) {
        return y2(scale4.invert(inputNumber));
      };
};

function yearMultiScale(inputNumber) {
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

var dScale0 = d3.scaleLinear().range([-6.00, -69.25]).domain([1988, 1800]),
  dScale1 = d3.scaleLinear().range([-76.93, -477.88]).domain([1800, 0]),
  dScale2 = d3.scaleLinear().range([-557, -1737]).domain([0, -9000]),
  dScale3 = d3.scaleLinear().range([-1737, -2027]).domain([-9000, -22000]),
  dScale4 = d3.scaleLinear().range([-1999, -2426]).domain([-22000, -48000]),
  dScale5 = d3.scaleLinear().range([-2426, -2768]).domain([-48000, -100000]),
  dScale6 = d3.scaleLinear().range([-2768, -3005]).domain([-48000, -237000]);

function dMultiScale(inputNumber) {
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
      // } else if (bounds[1] <= inputNumber && inputNumber < bounds[2]) {
      //   return scale1.invert(inputNumber);
      // } else if (bounds[2] <= inputNumber && inputNumber < bounds[3]) {
      //   return scale2.invert(inputNumber);
      // } else if (bounds[3] <= inputNumber && inputNumber < bounds[4]) {
      //   return scale3.invert(inputNumber);
      // } else if (inputNumber >= bounds[4]) {
      //   return scale4.invert(inputNumber);
      // };
};

// }

function getSum(total, num) {
    return total + num;
};

// BUILD MAIN TL
// main timeline
var mainTL = d3.select("#sections")
  .append("svg")
  .attr("width", mainWidth+miniWidth+40)
  .attr("height", mainHeight+mTop+m)
  .append("g")
  .attr("transform", "translate(" + (miniWidth+mLeft+m+40) + "," + mTop + ")") // position mainTL
  .attr("height", mainHeight)
  .attr("width", mainWidth);

mainTL.append("rect")
  .attr("x", .12*x1(1))
  .attr("width", .75*x1(1))
  .attr("height", mainHeight-(multiScale(-1000000)-multiScale(-600000)))
  .attr("fill", "#edf1f2");

// mainTL.append("rect")
//   .attr("x", .1*x1(1))
//   .attr("y", multiScale(1993))
//   .attr("width", .02*x1(1))
//   .attr("height", (multiScale(-273000)-multiScale(1993)))
//   .attr("fill", "#f6a355");

// BUILD EACH Y-SCALE
var axis0 = d3.axisLeft(scale0)
  .ticks(20, "f");
var axis0d = d3.axisRight(scale0)
  .ticks(20)
  .tickSize(0)
  .tickFormat(function(d, i) {var showDepth = depth0[i] <= 0 ? depth0[i]+' m' : ''; return showDepth});
var axis1 = d3.axisLeft(scale1)
  .ticks(20, "f");
var axis2 = d3.axisLeft(scale2)
  .ticks(20, "f")
  .tickFormat(function(d) {var showYear0 = d >= 0 ? d3.format(".0f")(d) : d3.format(",.0f")(-d)+' BC';
        return( showYear0 )});
var axis3 = d3.axisLeft(scale3)
  // .ticks(20, ".2s");
  .ticks(10)
  .tickFormat(function(d) {var showYear0 = d >= 0 ? d3.format(".0f")(d) : d3.format(",.0f")(-d)+' BC';
        return( showYear0 )});
var axis4 = d3.axisLeft(scale4)
  // .ticks(20, ".2s");
  .ticks(10)
  .tickFormat(function(d) {var showYear0 = d >= 0 ? d3.format(".0f")(d) : d3.format(",.0f")(-d)+' BC';
        return( showYear0 )});

// minor ticks
// var axis2m = d3.axisLeft(scale2)
//   .ticks(2000, "f");
// var axis1m = d3.axisLeft(scale1)
//   .ticks(200, "f");

// BUILD MINI TL
// mini timeline
var miniTL = d3.select("#miniTL")
  .append("svg")
  .attr("width", miniWidth+2*m)
  .attr("height", miniHeight+2*mTop)
  .append("g")
  .attr("transform", "translate(" + mLeft + "," + mTop + ")") // position miniTL
  .attr("height", miniHeight)
  .attr("width", miniWidth);

miniTL.append("rect")
  .attr("x", 0.05*x2(1))
  .attr("width", .75*x2(1))
  // height edited to match limit of miniBox slider
  // .attr("height", (miniHeight-16))
  .attr("height", (miniHeight-(y2(-400000))))
  .attr("fill", "#edf1f2");

// Load data and build timelines
d3.tsv("web_timeline.4.5.tsv", function(items) {

  // lines

  // main events
  mainTL.append("g").selectAll("mainEvent")
    .data(items)
    .enter().append("rect")
    .attr("class", function(d) {return "event" + d.lane + " mainEvent" + " event" + d.lane + d.start + " step"})
    .attr("id", function(d) {return "mainEvent"+ d.lane + d.start})
    .attr("y", function(d) {return multiScale(d.end, tf, t0, scaleDom);})
    .attr("x", .12*x1(1))
    .attr("width", .75*x1(1))
    .attr("height", function(d) {return multiScale(d.start, tf, t0, scaleDom)-multiScale(d.end, tf, t0, scaleDom)});

  // Remove event marker for title slide
  mainTL.selectAll('.mainEvent').filter('.event02018')
    .classed('event0', false)
    .attr('fill', 'none');

  // append y-axes
  mainTL.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20,0)")
    .call(axis0)
    .select(".domain").remove();

  mainTL.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20,0)")
    .call(axis1)
    .select(".domain").remove();

  mainTL.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20,0)")
    .call(axis2)
    .select(".domain").remove();

  mainTL.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20,0)")
    .call(axis3)
    .select(".domain").remove();

  mainTL.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20,0)")
    .call(axis4)
    .select(".domain").remove();


  // minor ticks
  // mainTL.append("g")
  //   .attr("class", "axis")
  //   .attr("transform", "translate(20,0)")
  //   .call(axis1m)
  //   .selectAll("text, .domain").remove();

  // mainTL.append("g")
  //   .attr("class", "axis")
  //   .attr("transform", "translate(20,0)")
  //   .call(axis2m)
  //   .selectAll("text, .domain").remove();

  // //mini events
  miniTL.append("g").selectAll("miniEvent")
    .data(items)
    .enter().append("rect")
    .attr("class", function(d) {return "event" + d.lane + " miniEvent" + " event" + d.lane + d.start})
    .attr("y", function(d) {return y2(d.end);})
    // .attr("x", function(d) {return x2(d.lane)+0.1*x2(1);})
    .attr("x", 0.05*x2(1))
    .attr("width", .75*x2(1))
    .attr("height", function(d) {return y2(d.start)-y2(d.end)});

  // miniLocator with year ticker
  var miniLocator = miniTL.append("g")
    .attr("id", "miniLocator")
    .attr("width", miniHeight+2*m)
    .attr("height", 10);

  miniLocator.append("rect")
    .attr("id", "miniBox")
    .attr("width", .85*x2(1))
    .attr("height", 4)
    .attr("fill", "#F6A04D")
    .attr("opacity", .5)
    .attr();

  miniLocator.append("line")
    .attr("x1", -4)
    .attr("x2", 0)
    .attr("y1", 2)
    .attr("y2", 2)
    .attr("stroke-width", 1)
    .attr("opacity", .5)
    .attr("stroke", "#F6A04D");

  miniLocator.append("text")
    .attr("id", "miniYear")
    // .attr("transform", "translate(-8,2)rotate(-90)");
    .attr("transform", "translate(-8,8)rotate(-90)");

  // d3.selectAll(".event0-1000000").filter(".miniEvent")
  //   .attr("height", (86.8246-16));

 })

  // Add interactivity 
  function handleMouseOver(d, i) {
    if (d3.select(this).style("opacity") != 0) {
            d3.select(this)
              .transition()        
              .duration(200)      
              .style("opacity", 1);}
  };

  function handleMouseOut(d, i) {
    if (d3.select(this).style("opacity") > 0.4) {
            d3.select(this)
              .transition()        
              .duration(200)      
              .style("opacity", .4);}
  };