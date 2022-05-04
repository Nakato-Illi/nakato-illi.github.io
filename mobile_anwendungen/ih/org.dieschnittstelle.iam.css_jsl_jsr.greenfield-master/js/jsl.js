
{
    "use strict"

    
    function mytile() {
        var para = document.getElementsByClassName("myapp-tile");
        // console.log(para);

        if(para[0].classList.contains("myapp-tiles")) {
            para[0].classList.remove("myapp-tiles");
        }
        else {
            para[0].classList.add("myapp-tiles");
        }
    }

}