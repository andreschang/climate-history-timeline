
/**
 * scroller - handles the details
 * of figuring out which section
 * the user is currently scrolled
 * to.
 */
function scroller() {
  var container = d3.select('body');
  // event dispatcher
  var dispatch = d3.dispatch('active', 'progress');

  // d3 selection of all the
  // text sections that will
  // be scrolled through
  var sections = null;

  var sectionPositions = [];
  var currentIndex = -1;
  var containerStart = 0;

  /**
   * scroll - constructor function.
   * Sets up scroller to monitor
   * scrolling of els selection.
   *
   * @param els - d3 selection of
   *  elements that will be scrolled
   *  through by user.
   */
  function scroll(els) {
    sections = els;

    // when window is scrolled call
    // position. When it is resized
    // call resize.
    d3.select(window)
      .on('scroll.scroller', position)
      .on('resize.scroller', resize);

    // manually call resize
    // initially to setup
    // scroller.
    resize();
    var timer = d3.timer(function () {
      position();
      timer.stop();
    });
  }

  /**
   * resize - called initially and
   * also when page is resized.
   * Resets the sectionPositions
   *
   */
  function resize() {
    // sectionPositions will be each sections
    // starting position relative to the top
    // of the first section.
    sectionPositions = [];
    console.log('get sectionPos')
    var startPos;
    sections.each(function (d, i) {
      var top = this.getBoundingClientRect().top;
      if (i === 0) {
        startPos = top;
      }
      sectionPositions.push(top - startPos);
    });
    // sectionPositions = sectionPositions.map( function(n) {return n});
    containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;

    var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (is_safari == true) {
        $('#status').css('display', 'inline');
        setTimeout( function() {
        $('#status').fadeOut(400);
        $('#preloader').fadeOut(800);
        $('.contain-wrap').css('overflow', 'visible');
        $('body').css({'overflow':'visible'});
      }, 3000)
    } else {
        $('#preloader').fadeOut(600);
        $('.contain-wrap').css('overflow', 'visible');
        $('body').css({'overflow':'visible'});
    }
  }

  /**
   * position - get current users position.
   * if user has scrolled to new section,
   * dispatch active event with new section
   * index.
   *
   */
  function position() {
    var pos = window.pageYOffset - 5 - containerStart;
    var yLoc = (pos > 0) ? pos : 0;
    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size(), sectionIndex);

    d3.select("#miniLocator")
      .attr("transform",   function() {
        var translateY=miniLocatorScale((yLoc+5)),
        translateY2 = translateY < 370 ? translateY : 370;
        return "translate(0,"+translateY2+")"  
        });
    d3.select("#miniYear")
      .text(function() {
        var adj = yLoc <= 5460 ? 5 : 86,
          year = miniYearScale((yLoc+adj)),
          showYear = year >= 0 ? d3.format(".0f")(year) : d3.format(",.0f")(-year)+' BCE',
          showYear2 = year >= -1000000 ? showYear : '1,000,000+ BCE',
          depth = (year <= 1988 && year >= -237000) ? depthScale((year)) : '1',
          showDepth = depth <= 0 ? ' / '+d3.format(".0f")(depth)+' m' : '';
        return( showYear2+showDepth);
      });

    if (currentIndex !== sectionIndex) {
      // @v4 you now `.call` the dispatch callback
      // next section is called only once year is passed
      var callSection = (sectionIndex >= 1) ? sectionIndex-1 : 0
      dispatch.call('active', this, callSection);
      console.log('new section')
      currentIndex = sectionIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
    console.log(currentIndex)
    // console.log(progress)
    // @v4 you now `.call` the dispatch callback
    dispatch.call('progress', this, currentIndex, progress);
  }

  /**
   * container - get/set the parent element
   * of the sections. Useful for if the
   * scrolling doesn't start at the very top
   * of the page.
   *
   * @param value - the new container value
   */
  scroll.container = function (value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  // @v4 There is now no d3.rebind, so this implements
  // a .on method to pass in a callback to the dispatcher.
  scroll.on = function (action, callback) {
    dispatch.on(action, callback);
  };

  return scroll;
}
