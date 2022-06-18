/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";

export default class ReadviewViewController extends mwf.ViewController {

    constructor() {
        super();

        console.log("ReadviewViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        const myitem = this.args.item;
        
        // const titleElement = this.root.querySelector("header h1");
        // const imgElement = this.root.getElementsByTagName("img")[0];
        // const deleteElement = this.root.getElementsByClassName("mwf-img-delete")[0];

        // titleElement.textContent = myitem.title;
        // imgElement.src = myitem.src;

        // deleteElement.onclick = () => {
        //    myitem.delete().then(() => this.previousView({deletedItem: myitem}));
        // }

        this.viewProxy = this.bindElement("mediaReadviewTemplate", {item: myitem}, this.root).viewProxy;
        this.viewProxy.bindAction("deleteItemAction", () => {
           this.deleteItem(myitem);
        });

        // call the superclass once creation is done
        super.oncreate();
    }

    deleteItem(item) {
        item.delete().then(() => this.previousView({deletedItem: item}));
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    bindListItemView(listviewid, itemview, itemobj) {
        // TODO: implement how attributes of itemobj shall be displayed in itemview
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    }

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
    }

}

