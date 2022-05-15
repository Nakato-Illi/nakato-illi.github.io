class ViewContoller {
    // damit autocomplete funktiomiert. damit wird der typ angegeben 
    root = document.body;
    constructor() {

    }

    initialiseView() {
        this.mytile();
        this.getAndAddElements();
        this.prepareAddingNewElements();
        this. refreshAndGetElements();
        
    }

    mytile() {

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

    prepareListitemsection() {

        const listitem = this.root.getElementsByTagName("li");
        const listoption = this.root.getElementsByClassName("dotdotdot");

        for (let i = 0; i < listitem.length; i++) {
            const currentitem = listitem[i];
            this.setItemOnClick(currentitem);
        }
    }

    setItemOnClick(item) {
        item.onclick = () => {
            alert(item.querySelector("h2").textContent);
            // console.log(currentitem);
        }
        [...item.getElementsByTagName('button')].forEach(b => {
            const n = b.className;
            if (n.includes('playbutton')) {
                b.onclick = () => { };
            } else if (n.includes('dotdotdot')) {
                b.onclick = (ev) => {
                    const lorem = item.getElementsByClassName("container-web-datum")[0];
                    const p1 = lorem.children[0].textContent;

                    const res = confirm("wollen Sie das Element mit dem Titel: " + item.querySelector("h2").textContent + "\nund der Url: " + p1 + " wirklich löschen?");
                    if (res) {
                        item.remove();
                    }
                    
                    ev.stopPropagation();
                };
            }
        });
    }

    bindItemToView(item) {
        const itemview = `<li>
        <img src="${item.src}">
        <div class="container-row">
            <div class="container-web-datum">
                <p>${item.owner}</p>
                <p>${item.added}</p>
            </div>
            <h2>${item.title}</h2>
            <div class="container-play-dot-sero">
                <button class="playbutton listbuttons"></button>
                <p>${item.numOfTags}</p>
                <button class="dotdotdot listbuttons"></button>
            </div>
        </div>
    </li>`;
        const list = this.root.getElementsByTagName('ul')[0];
        list.innerHTML += itemview;
        this.prepareListitemsection();

    }

    prepareAddingNewElements(all = true) {
        const addNewItemButton = this.root.getElementsByClassName("myapp-img-plus")[0];

        addNewItemButton.onclick = () => {
            // alert("asdfghjk");
            this.getAndAddElements(false);


        }
    }

    getAndAddElements(all = true) {
        const req = new XMLHttpRequest();
        req.open('GET', 'data/listitems.json');
        req.send();

        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    const responseData = req.responseText;
                    const ro = JSON.parse(responseData);
                    if (all) {
                        ro.forEach(o => this.bindItemToView(o));
                    } else {
                        const newItemadd = ro[Date.now() % ro.length];
                        console.log('----', newItemadd);
                        const date = new Date().toLocaleDateString();
                        newItemadd.added = date;
                        this.bindItemToView(newItemadd);
                    }

                }
            }
        }
    }

    refreshAndGetElements() {
        const list = this.root.getElementsByTagName('ul')[0];
        const refresh = this.root.getElementsByClassName("myapp-img-refresh")[0];
        refresh.onclick = () => {
        list.innerHTML = "";
        setTimeout(() => {
            this.getAndAddElements();
        }, 1000);
        
        }
    }

}

window.onload = () => {
    const vc = new ViewContoller(document);
    vc.initialiseView();
}









