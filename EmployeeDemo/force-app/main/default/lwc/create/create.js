import { api, LightningElement, track } from 'lwc';
export default class Create extends LightningElement {
    @track modalContainer = false;

    @api
    create(){
        this.modalContainer = true;
        // call api create controller
        this.modalContainer=false;

    }

    closeModalAction(){
        this.modalContainer=false;
    }
}