import HorizontalScroll from '@oberon-amsterdam/horizontal';
import ScrollReveal from 'scrollreveal';


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

function initializeDashOffsets() {
    for (let i=0; i<scrollBehaviour.length; i++){
        let data = scrollBehaviour[i];
        let elem = document.querySelector(`#${data.id}`);
        let dashLen = elem.getTotalLength();
        elem.style.strokeDasharray = dashLen + ' ' + dashLen;
        elem.style.strokeDashoffset = dashLen;
    }
}

var scrollBehaviour = [
    {id: 'path-1', startPct: 1, endPct: 8},
    {id: 'path-2', startPct: 7, endPct: 9},
    {id: 'path-3', startPct: 22, endPct: 24},
    {id: 'path-4', startPct: 24, endPct: 26},
    {id: 'path-5', startPct: 27, endPct: 29},
    {id: 'path-6', startPct: 31, endPct: 34},
    {id: 'path-7', startPct: 36, endPct: 38},
    {id: 'path-8', startPct: 47, endPct: 48},
    {id: 'path-9', startPct: 50, endPct: 53},
    {id: 'path-10', startPct: 60, endPct: 62},
    {id: 'path-11', startPct: 64, endPct: 68},
    {id: 'path-13', startPct: 80, endPct: 83},
    {id: 'path-14', startPct: 87, endPct: 88},
 ];


scrollEventHandler();
window.addEventListener("scroll", scrollEventHandler)


function scrollEventHandler()
{
 // Calculate how far down the page the user is 
 var percentOfScroll = (document.documentElement.scrollLeft + document.body.scrollLeft) / (document.documentElement.scrollWidth - document.documentElement.clientWidth) * 100;
    console.log(percentOfScroll);
 // For each lement that is getting drawn...
 for (var i=0; i<scrollBehaviour.length; i++)
 {
   var data = scrollBehaviour[i];
   var elem = document.querySelector(`#${data.id}`);

   // Get the length of this elements path
   var dashLen = elem.getTotalLength();

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
