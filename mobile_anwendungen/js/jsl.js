



// {
//     "use strict"


function mytile() {

    const kachel = document.getElementsByClassName("myapp-img-kachel")[0];

    const para = document.getElementsByClassName("myapp-tile")[0];
    const paro = document.getElementsByTagName("ul")[0];
    const pari = document.getElementsByTagName("main")[0];

    kachel.onclick = () => {
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
    }

}

    
    window.onload = () => {
        mytile();
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