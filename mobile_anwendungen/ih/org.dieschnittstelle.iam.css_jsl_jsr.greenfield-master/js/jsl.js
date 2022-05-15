
class ViewContoller {
    root = document.body;
    constructor() {

    }

    initialiseView() {
        this.prepareViewSwitching();
    }

    prepareViewSwitching() {
        const mainEl = this.root.getElementsByTagName("main")[0];
        const viewSwitch = this.root.querySelector("header");

        viewSwitch.onlick = () => {
            mainEl.setAttribute("class", "fade-in");
        }
    }

}

window.onload = () => {
    const vc = new ViewContoller(document.body);
    vc.root = document.body;
    vc.initialiseView();
}


// {
//     "use strict"


    function mytile() {

        var para = document.getElementsByClassName("myapp-tile")[0];
        var paro = document.getElementsByTagName("ul")[0];
        var pari = document.getElementsByTagName("main")[0];
        

        if (para.classList.contains("myapp-tiles")) {
            paro.classList.remove("fade-also");
            setTimeout(function () {

                para.classList.remove("myapp-tiles");
            }, 1000);
            pari.classList.add("fade-in");

        }
        else {
            pari.classList.remove("fade-in");
            paro.classList.add("fade-also");
            setTimeout(function () {
                para.classList.add("myapp-tiles");
            }, 1000);
        }

        // console.log(paro)

    }

    
    window.onload = () => {
        const listitem = document.getElementsByTagName("li");
        const listoption = document.getElementsByClassName("dotdotdot");


        
        for (let i = 0; i < listitem.length; i++) {
            const currentitem = listitem[i];


            
            currentitem.onclick = () => {
                alert(currentitem.querySelector("h2").textContent);
                // console.log(currentitem);
            }
            [...currentitem.getElementsByTagName('button')].forEach(b => {
                const n = b.className;
                if(n.includes('playbutton')) {
                    b.onclick = () => {};
                } else if(n.includes('dotdotdot')) {
                    b.onclick = (ev) => {
                        const lorem = currentitem.getElementsByClassName("container-web-datum")[0];
                        const p1 = lorem.children[0].textContent;
                        
                        alert(currentitem.querySelector("h2").textContent + "\n" + p1);
                        ev.stopPropagation();
                    };
                }
            })
            
        } 
        // console.log(listoption);  

    }
            
        
    

   


// }