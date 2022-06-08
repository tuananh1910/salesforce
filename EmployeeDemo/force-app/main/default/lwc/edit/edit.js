import { api, LightningElement, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';

export default class Edit extends LightningElement {
    @track modalContainer = false;
    editEmployee;

    @api records;

    @api
    openModalEdit(data){
        this.modalContainer = true;
        this.editEmployee = data;
    }

    closeModalAction(){
        this.modalContainer=false;
    }
    
    finish(event){
        const customEvent = new CustomEvent('changeopen');
        this.dispatchEvent(customEvent);
        this.closeModalAction();
    }
}