import { api, LightningElement, track } from 'lwc';

export default class Details extends LightningElement {
    detailJobPostingSite;
    @track modalContainer = false;

    @api
    openModalDetails(data){
        this.detailJobPostingSite = data;
        this.modalContainer = true;
    }

    closeModalAction(){
        this.modalContainer=false;
      }
}