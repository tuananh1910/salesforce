import { api, LightningElement, track } from 'lwc';

export default class Edit extends LightningElement {
    @track modalContainer = false;
    editEmployee;

    @api
    openModalEdit(data){
        this.modalContainer = true;
        this.editEmployee = data;
    }

    closeModalAction(){
        this.modalContainer=false;
    }
    
    finish(){
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
        const customEvent = new CustomEvent('changeopen');
        this.dispatchEvent(customEvent);
        this.closeModalAction();
    }
}