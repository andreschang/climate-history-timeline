
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */

var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 560;
  var height = 520;
  var top_height = 704;
  var margin = { top: 0, left: 10, bottom: 40, right: 10 };

  var lastIndex = -1;
  var activeIndex = 0;

  var svg = null;
  var g = null;

  var activateFunctions = [];
  var updateFunctions = [];

  /**
   * Sets up SVG group that panels
   * will display in
   */

  var panelGroup = function (selection) {
    selection.each(function (timelineData) {
      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([timelineData]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', top_height + margin.top + margin.bottom);

      svg.append('g');

      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      setupVis(timelineData)
      setupSections();

    });
  };

  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   */

  var setupVis = function (timelineData) {

    // Here is where all of the image data and custom placements are defined

    // img_slides is the slide that each image shows up in (ex. the 5th image, 'church')
    // shows up in slide 6

    // img_names is filename (w/o .jpg extension) of image loaded in panel
    // lBox_names is filename of image that loads in LightBox (usually the same as img_names)
    // img_dims is the original image's dimensions in pixels [Width,Height]
    // img_x and img_y are target placement of image in event panel
    // fRead is the list of slides with "further reading" info loaded in
    // arrow_x, arrow_y, and fRead_y are placement parameters.
    // arrows all need to be shifted manually when description lengths are changes (sorry!)

    var img_slides = [1, 2, 3, 4, 6, 7, 8, 10, 12, 13, 15, 18],
      img_names = ['iceloss_crop', 'shuvinai', 'gisp2_crop', 'northpole2', 'church', 'frank', 'woodmap',
      'bruegel', 'hyperborea', 'mask2', 'lgm', 'dirtyice'],
      lBox_names = ['iceloss2', 'shuvinai', 'gisp2_crop', 'northpole2', 'church', 'frank', 'woodmap',
      'bruegel', 'hyperborea', 'mask2', 'lgm', 'dirtyice'],
      img_dims = [[365, 564],[800,599],[331,574],[902,1200],[880,501],[750,1024],[286,553],[629,453],
      [720,668],[477,742],[1000,966],[850,1269]],
      img_x = [325, 270, 400, 340, 228, 376, 370, 240, 240, 380, 300, 350],
      img_y = [100, 120, 100, 120, 126, 50, 50, 30, 60, 43, 60, 40],
      arrow_x = [100, 2, 2, 96, 213, 2, 304, 156, 308, 300, 2, 343, 
      308, 345, 221, 250, 252, 2, 233, 319],
      arrow_y = [430, 307, 399, 307, 338, 338, 307, 338, 307, 338, 338, 307, 
      368, 338, 338, 338, 338, 307, 368, 399],
      fRead = [1,5,9,14,15,19];
      // fRead_y = [510, 530, 530, 400, 510, 488];

    g.append('g').selectAll('img')
      .data(img_slides)
      .enter()
      .append('svg:a')
        .attr('xlink:href', function(d,i) {return 'images/'+lBox_names[i]+'.jpg'})
        .attr('data-lightbox', function(d,i) {return 'image #'+i})
        .attr('data-title', function(d,i) {return timelineData[d].imgName+'<br>'+timelineData[d].imgSource})
      .append('svg:image')
      .attr('class', function(d, i) {return 'slide'+img_slides[i]+' img'})
      .attr('xlink:href', function(d,i) {return 'images/'+img_names[i]+'.jpg'})
      .attr('x', function(d,i) {return img_x[i]})
      .attr('y', function(d,i) {return img_y[i]+100})
      .attr('width', function(d,i) {return (width-img_x[i])})
      .attr('height', function(d,i) {return ((width-img_x[i])*img_dims[i][1]/img_dims[i][0])})
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .style('opacity', 0);

    g.append('g').selectAll('eventDepth')
      .data(timelineData)
      .enter()
      .append('text')
      .attr('class', function(d, i) {return 'slide'+i+' eventDepth'})
      .attr('y', (height / 31)+100)
      // .attr('y', (height / 10.8))
      .attr('x', 6)
      .text(function(d) {
        var depth = d.depthm <= 0.0 ? d.depthm+' meters / '+d.depthmi+' miles' : '';
        return depth})
      .style('opacity', 0);

    g.append('g').selectAll('eventYear')
      .data(timelineData)
      .enter()
      .append('text')
      .attr('class', function(d, i) {return 'slide'+i+' eventYear'})
      .attr('y', (height / 10.8)+100)
      // .attr('y', (height / 24))
      .attr('x', 6)
      .text(function(d) { var showYear = d.start >= 0 ? d.start : -d.start+' BC';
        return( showYear );})
      .style('opacity', 0);

    g.append('g').selectAll('title')
      .data(timelineData)
      .enter()
      .append('text')
      .attr('class', function(d, i) {return 'slide'+i+' title'})
      .attr('y',  (height / 5)+100)
      .attr('x', width / 3)
      .text(function(d) {return d.id})
      .call(wrap, 400)
      .style('opacity', 0);

    g.append('g').selectAll('fRead')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        .attr('y', (height / 2.42)+100)
        .attr("width", 500)
        .attr("height", 500)
        .attr('class', function(d, i) {return 'slide'+i+' fRead fR'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return "<h1>Further Reading</h1>"+d.furtherReading});

    g.append('g').selectAll('desc')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        .attr('y', (height / 2.42)+100)
        .attr("width", 510)
        .attr("height", 306)
        .attr('class', function(d, i) {return 'slide'+i+' desc'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return d.desc});

    g.append('g').selectAll('quote')
      .data(timelineData)
      .enter()
      .append('foreignObject')
        .attr('y', (height / 2.42)+100)
        .attr("width", 510)
        .attr("height", 300)
        .attr('class', function(d, i) {return 'slide'+i+' quote'})
        .style('opacity', 0)
      .append('xhtml:div')
        .html(function(d) {return '<p>'+d.quote+"</p>"});

    g.append('g').selectAll('arrows')
      .data(timelineData)
      .enter()
      .append('text')
      .text('READ MORE')
      // .append('svg:image')
      // .attr('xlink:href', '../images/Read-More5.svg')
      .attr('class', function(d, i) {return 'slide'+i+' arrow'})
      .attr('x', function(d, i) {return arrow_x[i]})
      .attr('y', function(d, i) {return arrow_y[i]+117})
      .on("click", function(d, i){
        var sClass = '.slide'+i;
        g.selectAll(sClass).filter('.quote, .arrow')
          .transition()
          .duration(0)
          .attr('pointer-events', 'none')
          .style('opacity', 0);
        g.selectAll(sClass).filter('.desc, .fReadArrow')
        // g.selectAll(sClass).filter('.fReadArrow')
          .transition()
          .duration(200)
          .attr('pointer-events', 'all')
          .style('opacity', 1);})
      // .attr('width', 12)
      .attr('width', 140)
      .attr('height', 140)
      .style('opacity', 0);

    g.append('g').selectAll('fReadArrows')
      .data(fRead)
      .enter()
      .append('text')
      .text('FURTHER READING')
      // .append('svg:image')
      // .attr('xlink:href', '../images/Further-Reading2.svg')
      .attr('class', function(d, i) {return 'slide'+d+' fReadArrow fR'})
      .attr('x', 1)
      // .attr('y', function(d, i) {return fRead_y[i]+108})
      .attr('y', 638)
      .on("click", function(d, i){
        var sClass = '.slide'+d;
        g.selectAll(sClass).filter('.desc,.fReadArrow')
          .transition()
          .duration(0)
          .attr('pointer-events', 'none')
          .style('opacity', 0);
        g.selectAll(sClass).filter('.fRead')
          .transition()
          .duration(200)
          .style('opacity', 1);})
      // .attr('width', 12)
      .attr('width', 140)
      .attr('height', 140)
      .style('opacity', 0);

    // Custom slide edits
    g.selectAll('.slide0').filter('.eventYear').remove();
    g.selectAll('.slide0').filter('.desc').attr('transform', 'translate(0,-80)');
    g.selectAll('.slide2').filter('.eventYear').text('2000s');
    g.selectAll('.slide4').filter('.desc').attr('height', 328);
    g.selectAll('.slide6').filter('.eventYear').text('Late 1800s');
    g.selectAll('.slide8').filter('.eventYear').text('Early 1800s');
    g.selectAll('.slide9').filter('.eventYear').text('1500-1800');
    g.selectAll('.slide9,.slide15').filter('.fReadArrow').attr('y', 642);
    g.selectAll('.slide10').filter('.eventYear').text('1300-1850');
    g.selectAll('.slide0').filter('.arrow').remove()
    g.selectAll('.slide15').filter('.eventYear').text('11000-9500 BC');
    g.selectAll('.slide18').filter('.eventYear').text('130000-115000 BC');
    g.selectAll('.slide19').filter('.eventYear').text('3000000 BC');

    };

  var setupSections = function() {

    for (var i = 0; i < 21; ++i){

      activateFunctions[i] = getFun(i);
      updateFunctions[i] = getUp(i)};

    function getFun(val) {
        var xb = val-1,
          xf = val+1;

        return function() {
        g.selectAll('.slide'+xb)
          .transition()
          .duration(0)
          .style('opacity', 0);

        g.selectAll('.slide'+xf)
          .transition()
          .duration(0)
          .style('opacity', 0);

        g.selectAll(':not(.slide'+val+')')
          .attr('pointer-events', 'none');

        g.selectAll('.slide'+val).filter(':not(.desc)').filter(':not(.fR)')
          .transition()
          .duration(600)
          .style('opacity', 1.0);

        g.selectAll('.slide'+val).filter('.img')
          .attr('pointer-events', 'all')
          .transition()
          .duration(600)
          .style('opacity', 0.4);

        g.selectAll('.slide'+val).filter('.arrow')
          .attr('pointer-events', 'all')
          .transition()
          .duration(600)
          .style('opacity', 1.0);}

      };

    function getUp(val) {
      return function(progress) {
          var xb = val-1,
          xf = val+1,
          img_y = [120, 100, 120, 126, 50, 120, 120];

        g.selectAll('.slide'+xb).filter('.img')
        // trinomial scroll for image to reach its center and then fly off screen
          .attr('transform', function(d,i) {
            var img_h = d3.select(this).node().getBBox().height,
            offset = (height-img_y[i]-img_h/2)/(height);
            // console.log((-4*Math.pow((progress-offset),3)));
            return 'translate(0,'+(-4*Math.pow((progress-offset),3))*(height+img_h)+')'}
          )}
    }};


  var wrap = function(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        // dy = parseFloat(text.attr("dy")),
        dy = 0,
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

  panelGroup.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  panelGroup.update = function (index, progress) {
    updateFunctions[index](progress);
    // console.log(progress)
  };

  // return chart function
  return panelGroup;
};


/**
 * sets up the scroller and
 * displays the visualization.
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select('#vis')
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.tsv('web_timeline.4.5.tsv', display);

