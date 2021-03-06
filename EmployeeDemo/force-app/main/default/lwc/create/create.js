import { api, LightningElement, track } from 'lwc';
export default class Create extends LightningElement {
    @track modalContainer = false;

    @api
    openModalCreate(){
        this.modalContainer = true;
    }

    closeModalAction(){
        this.modalContainer=false;
    }
    
    finish(){
        const customEvent = new CustomEvent('changeopen');
        this.dispatchEvent(customEvent);
    }

}