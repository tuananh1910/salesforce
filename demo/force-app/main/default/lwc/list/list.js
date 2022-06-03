import { api, LightningElement, track, wire } from 'lwc';
import getJobPostingSiteList from '@salesforce/apex/JobPostingSiteController.getJobPostingSiteList'
const COLUMNS = [
    {label: 'Name',fieldName: 'Name', type : 'text'},
    {label: 'Description',fieldName: 'Description__c', type : 'text'},
    {label: 'Job Posting Site URL',fieldName: 'Job_Posting_Site_URL__c', type : 'text'},
    {label: 'Status',fieldName: 'Status__c', type : 'text'},
    {label: 'Technical Site',fieldName: 'Technical_Site__c', type : 'checkbox'},
    {   
        label: 'View',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'action:preview',
            title: 'Preview',
            variant: 'border-filled',
            alternativeText: 'View',
            name : 'view'
        },
        value: 'details',
    },
    {label:'Edit',type: "button", typeAttributes: {
        label: 'Edit',
        name: 'Edit',
        title: 'Edit',
        disabled: false,
        value: 'edit',
        iconPosition: 'left',
    }},
    {label:'Delete',type: "button", typeAttributes: {
        label: 'Delete',
        name: 'Delete',
        title: 'Delete',
        disabled: false,
        value: 'Delete',
        iconPosition: 'left'
    }}
]
export default class List extends LightningElement {
    columns = COLUMNS;
    error = false;

    @track jobPostingSites;
    connectedCallback(){
        getJobPostingSiteList()
        .then(result => {
            this.jobPostingSites = result;
        })
        .catch(error =>{
            this.jobPostingSites = error;
        });
    }

    handleRowAction(event){
        const dataRow = event.detail.row;
        switch(event.detail.action.name){
            case 'edit': 
                break;
            case 'view':
                this.oepnDetails(dataRow);
                break;
        }
    }

    oepnDetails(data){
        this.template.querySelector('c-details').openModalDetails(data);
    }

    openCreate(data){
        this.template.querySelector('c-create').create();
    }
  
}