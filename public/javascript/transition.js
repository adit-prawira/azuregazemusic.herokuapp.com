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
            container.style.backgroundColor = "rgb(139,212,193)";
            break;
        case 1:
            container.style.backgroundColor = "rgb(255,254,254)";
            break;
        case 2:
            container.style.backgroundColor = "rgb(99,137,141)";
            break;
        case 3:
            container.style.backgroundColor = "rgb(215,194,172)";
            break;
        case 4:
            container.style.backgroundColor = "rgb(99,147,122)";
            break;
        case 5:
            container.style.backgroundColor = "rgb(8,9,110)";
            break;
        default:
            container.style.backgroundColor = "#fffefe";
    }

    slideIndex++;

    setTimeout(autoChange, 1500);
}
