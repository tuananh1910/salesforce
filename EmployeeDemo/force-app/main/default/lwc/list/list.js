import { api, LightningElement, track, wire } from 'lwc';
import getAllEmployees from '@salesforce/apex/EmployeeController.getAllEmployees'
const COLUMNS = [
    {label: 'FirstName',fieldName: 'FirstName__c', type : 'text'},
    {label: 'LastName',fieldName: 'LastName__c', type : 'text'},
    {label: 'FullName',fieldName: 'FullName__c', type : 'text'},
    {label: 'Age',fieldName: 'Age__c', type : 'text'},
    {label: 'Certifications',fieldName: 'Certifications__c', type : 'checkbox'},
    {label: 'DateOfBirth',fieldName: 'DateOfBirth__c', type : 'text'},
    {label: 'Email',fieldName: 'Email__c', type : 'text'},
    {label: 'Experience',fieldName: 'Experience__c', type : 'text'},
    {label: 'PhoneNumber',fieldName: 'PhoneNumber__c', type : 'text'},
    {label: 'Position',fieldName: 'Position__c', type : 'checkbox'},
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
    employee;
    @track employees;
    connectedCallback(){
        getAllEmployees()
        .then(result => {
            this.employees = result;
        })
        .catch(error =>{
            this.employees = error;
        });
    }

    handleRowAction(event){
        console.log(event.detail.row);
        const dataRow = event.detail.row;
        switch(event.detail.action.name){
            case 'edit': 
                break;
            case 'view':
                console.log('view');
                this.employee = dataRow;
                console.log(this.employee);
                this.openDetails(dataRow);
                break;
        }
    }

    openDetails(data){
        this.template.querySelector('c-details').openModalDetails(data);
    }

    openCreate(data){
        this.template.querySelector('c-create').create();
    }
  
}