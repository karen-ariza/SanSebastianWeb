let items = document.querySelectorAll('.curiosidades-slider .curiosidad-item');
let next = document.getElementById('curiosidad-next');
let prev = document.getElementById('curiosidad-prev');

let active = 0;

function loadShow(){

    items.forEach(item => {
        item.style.transform = "scale(0.3)";
        item.style.opacity = "0";
        item.style.filter = "blur(5px)";
    });

    let total = items.length;

    // Item central (activo)
    let center = items[active];
    center.style.transform = `translateX(0px) scale(1) rotateY(0deg)`;
    center.style.opacity = 1;
    center.style.filter = "none";
    center.style.zIndex = 10;

    // Item siguiente
    let nextIndex = (active + 1) % total;
    let nextItem = items[nextIndex];
    nextItem.style.transform = `translateX(150px) scale(0.8) rotateY(-15deg)`;
    nextItem.style.opacity = 0.6;
    nextItem.style.zIndex = 5;

    // Item anterior
    let prevIndex = (active - 1 + total) % total;
    let prevItem = items[prevIndex];
    prevItem.style.transform = `translateX(-150px) scale(0.8) rotateY(15deg)`;
    prevItem.style.opacity = 0.6;
    prevItem.style.zIndex = 5;
}

loadShow();

// BOTONES
next.onclick = function () {
    active = (active + 1) % items.length;
    loadShow();
}

prev.onclick = function () {
    active = (active - 1 + items.length) % items.length;
    loadShow();
}
