import HorizontalScroll from '@oberon-amsterdam/horizontal';

var scroll = null;
handleScroll();
window.addEventListener("resize", handleScroll);

function handleScroll(){
    if (window.innerWidth > 768) {
        scroll = new HorizontalScroll();
    }

    if(scroll && window.innerWidth <= 768){
        scroll.destroy();
        window.location.reload();
    }
}