import HorizontalScroll from '@oberon-amsterdam/horizontal';
import ScrollReveal from 'scrollreveal';
import SweetScroll from 'sweet-scroll'


//Horizontal Scrolling
var scroll = null;
handleScroll();
window.addEventListener("resize", handleScroll);

function handleScroll(){
    if (window.innerWidth > 768 && !scroll) {
        scroll = new HorizontalScroll();
    }

    if(scroll && window.innerWidth <= 768){
        scroll.destroy();
        scroll = null;
    }
}

//Fade In Animations for all h1, h2, h3, and p
ScrollReveal().reveal(document.querySelectorAll('h1, h2, h3, p'), { easing: 'ease-in-out', duration: '800', delay: '300' });

//except those in the chapters blob and footer blob
ScrollReveal().clean(document.querySelectorAll('#chapters-blob h1,#chapters-blob h2,#chapters-blob h3,#chapters-blob p'))
ScrollReveal().clean(document.querySelectorAll('.footer h1,.footer h2,.footer h3,.footer p'))

const scrollBehaviour = [
    {id: 'path-1', startPct: 1, endPct: 4},
    {id: 'path-2a', startPct: 6.5, endPct: 10},
    {id: 'path-2b', startPct: 13, endPct: 19},
    {id: 'path-activity-1', startPct: 23.5, endPct: 25},
    {id: 'path-activity-2', startPct: 23, endPct: 23.5},
    {id: 'path-3', startPct: 26, endPct: 28},
    {id: 'path-4', startPct: 28, endPct: 30},
    {id: 'path-5', startPct: 30, endPct: 32},
    {id: 'path-6', startPct: 34, endPct: 37},
    {id: 'path-7', startPct: 38, endPct: 40},
    {id: 'path-new-1', startPct: 42, endPct: 44},
    {id: 'path-new-2', startPct: 45, endPct: 47},
    {id: 'path-time-1', startPct: 48, endPct: 51},
    {id: 'path-time-2', startPct: 51, endPct: 52},
    {id: 'path-8', startPct: 52, endPct: 54},
    {id: 'path-9', startPct: 54.5, endPct: 56},
    {id: 'path-mood-1', startPct: 62, endPct: 63},
    {id: 'path-mood-2', startPct: 59, endPct: 62},
    {id: 'path-10', startPct: 63, endPct: 64},
    {id: 'path-11', startPct: 66, endPct: 68},
    {id: 'path-new-3', startPct: 70.5, endPct: 72.5},
    {id: 'path-new-4', startPct: 74.25, endPct: 76},
    {id: 'path-12', startPct: 77.7, endPct: 80},
    {id: 'path-attitude-1', startPct: 80, endPct: 81},
    {id: 'path-attitude-2', startPct: 81, endPct: 84},
    {id: 'path-13', startPct: 85, endPct: 88},
    {id: 'path-14', startPct: 89.5, endPct: 90},
    {id: 'path-ending-note-1', startPct: 90.5, endPct: 93},
    {id: 'path-ending-note-2', startPct: 93.5, endPct: 95.5},
 ];

 window.addEventListener("DOMContentLoaded", (event) => {
    scrollEventHandler();
    window.addEventListener("scroll", scrollEventHandler)
})


function scrollEventHandler()
{
 // Calculate how far right the page the user is 
 var percentOfScroll = (document.documentElement.scrollLeft + document.body.scrollLeft) / (document.documentElement.scrollWidth - document.documentElement.clientWidth) * 100;
 // For each element that is getting drawn...
 for (var i=0; i<scrollBehaviour.length; i++)
 {
   var data = scrollBehaviour[i];
   var elem = document.querySelector(`#${data.id}`);

   // Get the length of this elements path
   console.log(data.id)
   var dashLen = elem.getTotalLength();
    console.log(percentOfScroll)
   // Calculate where the current scroll position falls relative to our path
   var fractionThroughThisElem = (percentOfScroll - data.startPct) / (data.endPct - data.startPct);
   // Clamp the fraction value to within this path (0 .. 1)
   fractionThroughThisElem = Math.max(fractionThroughThisElem, 0);
   fractionThroughThisElem = Math.min(fractionThroughThisElem, 1);

   var dashOffset = dashLen * (1 - fractionThroughThisElem);

   elem.setAttribute("stroke-dasharray", dashLen);
   elem.setAttribute("stroke-dashoffset", dashOffset);
 }
}

/*
    smooth scrolling links in chapters blob
*/



window.addEventListener(
    'DOMContentLoaded',
    () => {
      const scroller = new SweetScroll({
        vertical: (window.innerWidth > 768) ? false : true,
        horizontal: (window.innerWidth > 768) ? true : false,
        easing: 'easeInOutCubic',
      });
    }
);


/*
    activity icons hover labels
*/

function displayActivityLabel(label){
  document.getElementById('activity-display').innerHTML = label;
}

function displayExamples(examples){
  document.getElementById('activity-examples').innerHTML = examples ? `E.g., ${examples}` : ''
}

[...document.querySelectorAll('.inflow-item'), ...document.querySelectorAll('.bidirectional-item')].forEach(item => {
  item.addEventListener('mouseover', function(event){
    displayActivityLabel(item.querySelector('span').innerHTML);
    displayExamples(item.dataset.examples);
  })

  item.addEventListener('mouseout', function(event){
    displayActivityLabel('');
    displayExamples('')
  })
})


/*
  Display Sticky scroll navbar after scrolling past Activity Start
*/

// Get the navbar
var stickyNav = document.getElementById("sticky-nav");

// Get Activity Section Offset

var activity = document.getElementById("activity-text");
var activityOffset = activity.offsetLeft;

var time = document.getElementById("time-anchor");
var timeOffset = time.offsetLeft;

var mood = document.getElementById("mood-div");
var moodOffset = mood.offsetLeft;

var attitude = document.getElementById("attitude-div");
var attitudeOffset = attitude.offsetLeft;

var ending_note_right_line = document.getElementById("ending-note-right-line")
var ending_note_right_lineOffset = ending_note_right_line.offsetLeft;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function handleStickyNavDisplay() {
  if ((window.pageXOffset >= activityOffset) && (window.pageXOffset < ending_note_right_lineOffset)) {
    stickyNav.style.visibility = "visible"
  } else {
    stickyNav.style.visibility = "hidden"
  }
}

//reset sticky nav elements
function resetElements(){
  var navdots = document.querySelectorAll('.sticky-nav-dot');
  for(var i=0; i<navdots.length; i++){
      navdots[i].style.backgroundColor = "lightgray";
  }

  var navlabels = document.querySelectorAll('.sticky-nav-label');
  for(var i=0; i<navlabels.length; i++){
      navlabels[i].style.visibility = "hidden"
  }
}

//highlight the current section in the sticky navbar by making dot green and showing section label
function highlightCurrentSection() {
  resetElements();

  let halfScreenWidth = screen.width / 2
  let offset = window.pageXOffset + halfScreenWidth

  if(window.pageXOffset >= activityOffset && offset < timeOffset){
    document.getElementById("activity-dot").style.backgroundColor = "#484848"
    document.getElementById("sticky-nav-activity-label").style.visibility = "visible"
  }else{
    if(offset >= timeOffset && offset < moodOffset){
      document.getElementById("time-dot").style.backgroundColor = "#484848"
      document.getElementById("sticky-nav-time-label").style.visibility = "visible"
    }else{
      if(offset >= moodOffset && offset < attitudeOffset){
        document.getElementById("mood-dot").style.backgroundColor = "#484848"
        document.getElementById("sticky-nav-mood-label").style.visibility = "visible"
      }else{
        if(offset >= attitudeOffset && window.pageXOffset < ending_note_right_lineOffset){
          document.getElementById("attitude-dot").style.backgroundColor = "#484848"
          document.getElementById("sticky-nav-attitude-label").style.visibility = "visible"
        }
      }
    }
  }
}

// When the user scrolls the page, execute sticky nav functions
window.onscroll = function() {
  handleStickyNavDisplay();
  highlightCurrentSection();
};



