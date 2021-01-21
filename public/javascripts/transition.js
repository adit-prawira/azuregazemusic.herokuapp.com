var slideIndex = 0;
autoChange();

function autoChange() {
    var x = document.getElementsByClassName("SlideShow");
    var container = document.getElementById("SlideShowContainer");

    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    if (slideIndex >= x.length) {
        slideIndex = 0;
    }

    x[slideIndex].style.display = "block";

    switch (slideIndex) {
        case 0:
            container.style.backgroundColor = "#7A88AE";
            break;
        case 1:
            container.style.backgroundColor = "#72D7C0";
            break;
        case 2:
            container.style.backgroundColor = "#FFFEFE";
            break;
        case 3:
            container.style.backgroundColor = "#588A8E";
            break;
        case 4:
            container.style.backgroundColor = "#DBC2A8";
            break;
        case 5:
            container.style.backgroundColor = "#549578";
            break;
        case 6:
            container.style.backgroundColor = "#3C62B7";
            break;
        case 7:
            container.style.backgroundColor = "#C3D59F";
            break;
        case 8:
            container.style.backgroundColor = "#99B8F5";
            break;
        case 9:
            container.style.backgroundColor = "#081029";
            break;
        default:
            container.style.backgroundColor = "#fffefe";
    }

    slideIndex++;

    setTimeout(autoChange, 1500);
}
