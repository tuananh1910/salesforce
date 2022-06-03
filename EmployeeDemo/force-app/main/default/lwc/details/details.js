import { api, LightningElement, track } from 'lwc';

export default class Details extends LightningElement {
    detailsEmployee;
    @track modalContainer = false;

    @api
    openModalDetails(data){
        this.detailsEmployee = data;
        this.modalContainer = true;
    }

    closeModalAction(){
        this.modalContainer=false;
      }
}