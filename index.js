import HorizontalScroll from '@oberon-amsterdam/horizontal';

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