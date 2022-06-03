import { api, LightningElement, track } from 'lwc';
export default class Create extends LightningElement {
    @track modalContainer = false;

    @api
    openModalCreate(){
        this.modalContainer = true;
        // call api create controller
    }

    closeModalAction(){
        this.modalContainer=false;
    }
}