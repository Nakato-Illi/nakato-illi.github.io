/**
 * @author Jörn Kreutel
 */
import { xhr } from "../../lib/js/framework-modules.js";
import { create } from "../../lib/js/mwf/crud/mwfXhr.js";
import { Application } from "../../lib/js/mwf/mwf.js";
import { mwf } from "../Main.js";
import { entities } from "../Main.js";
import { GenericCRUDImplLocal } from "../Main.js";
import MyApplication from "../MyApplication.js";

export default class ListviewViewController extends mwf.ViewController {

    constructor() {
        super();        

        this.addNewMediaItemElement = null;

        this.crudops = GenericCRUDImplLocal.newInstance("MediaItem");

    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        console.log("---------oncreate(): ", this.root);    
        
        this.prepareAddingNewElements();
        this.prepareCRUDSwitching();
        this.initialiseListitemsInListview();
       

        // call the superclass once creation is done
        super.oncreate();
    }

    prepareAddingNewElements() {

        this.addNewMediaItemElement = this.root.querySelector("header button:last-child");
        this.addNewMediaItemElement.onclick = () => {
            this.nextView("mediaEditview", {item: new entities.MediaItem()});
        }

    }

    prepareCRUDSwitching() {

        const switchingElement = this.root.querySelector("footer .mwf-img-refresh");
        switchingElement.onclick = () => {
            if(this.application.currentCRUDScope == "local") {
                this.application.switchCRUD("remote");
            } else {
                this.application.switchCRUD("local");
            }
            this.initialiseListitemsInListview();
        }
    }

    initialiseListitemsInListview() {
        entities.MediaItem.readAll().then(items => this.initialiseListview(items));
    }
    // async onresume() {
    //     // TODO: do databinding, set listeners, initialise the view
    //     this.addNewMediaItemElement = this.root.querySelector("header button:last-child");
    //     this.addNewMediaItemElement.onclick = () => {
    //
    //         const allitemdata = [
    //             [100,200,"lirem"],
    //             [300,100,"dipsi"],
    //             [100,50,"kanup"],
    //             [200,200,"haddem"],
    //         ];
    //         const [x,y,title] = allitemdata[Date.now() % allitemdata.length];
    //         const newitem = new entities.MediaItem(title, `https://placekitten.com/${x}/${y}`);
    //         newitem.create().then(() => this.addToListview(newitem));
    //
    //     }
    //
    //     entities.MediaItem.readAll().then(items => this.initialiseListview(items));
    //
    //     // call the superclass once creation is done
    //     super.onresume();

//     getListviewAdapter(): undefined mwf.js:171:13
//     template myapp-listitem uses databinding. Return as root+body segmented object... mwf.js:429:25
//     bindListItemView(): mwf.js:1665:17
//     applyDatabinding(): using template body and root children:
// <img class="mwf-left-align" src="{{src}}">
// <div class="mwf-li-titleblock">
// <h2>{{title}} {{_id}}</h2>
// <h3>{{addedDateString}}</h3>
// </div>
// <button class="mwf-imgbutton mwf-img-options-vertical mwf-right-align mwf-listitem-menu-control"></button>
// 0
    // }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    // bindListItemView(listviewid, itemview, itemobj) {
    //     // TODO: implement how attributes of itemobj shall be displayed in itemview
    //     console.log("--------------------bindListItem(): ", listviewid, itemview, itemobj);
    //     // itemview.root.querySelector("img").src = itemobj.src;
    //     // itemview.root.querySelector("h2").textContent = itemobj.title;


    //     itemview.root.getElementsByTagName("img")[0].src =
    //         itemobj.src;
    //     itemview.root.getElementsByTagName("h2")[0].textContent =
    //         itemobj.title;
    //     itemview.root.getElementsByTagName("h3")[0].textContent =
    //         itemobj.added;
    // }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
        // alert("id " + itemobj._id);
        this.nextView("mediaReadview", {item: itemobj});
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
    //  */
    // onListItemMenuItemSelected(menuitemview, itemobj, listview) {
    //     // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    //     if (menuitemview.classList.contains("myapp-action-delete")) {
    //         this.deleteItem(itemobj);
    //     } 
    //     else if (menuitemview.classList.contains("myapp-action-edit")) {
    //         this.updateItem(itemobj);
    //     } 
    //     else {
    //         alert("unbekannte aktion!!");
    //     }
    // }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
        // if(nextviewid === "mediaReadview") {
            if(returnValue) {
                if(returnValue.deletedItem) {
                    this.removeFromListview(returnValue.deletedItem._id);
                } else if(returnValue.updateItem){
                    this.updateInListview(returnValue.updateItem._id, returnValue.updateItem);
                } else if(returnValue.createItem) {
                    this.addToListview(returnValue.createItem);
                }
            }
        // }
        // // this.oncreate();
    }

    deleteItem(item) {
        item.delete().then(() => this.removeFromListview(item._id));
    }

    updateItem(item) {
        item.title += (" " + item.title);
        item.update().then(() => this.updateInListview(item._id,item));
    }

}