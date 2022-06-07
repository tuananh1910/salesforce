import { api, LightningElement, track, wire } from 'lwc';
import getAllEmployees from '@salesforce/apex/EmployeeController.getAllEmployees'
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningConfirm from 'lightning/confirm'
import { deleteRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';

const COLUMNS = [
    {label: 'FirstName',fieldName: 'FirstName__c', type : 'text',sortable: true, editable: true},
    {label: 'LastName',fieldName: 'LastName__c', type : 'text', sortable: true, editable: true},
    {label: 'FullName',fieldName: 'FullName__c', type : 'text', sortable: true, editable: true},
    {label: 'Age',fieldName: 'Age__c', type : 'text'},
    {label: 'Certifications',fieldName: 'Certifications__c', type : 'checkbox'},
    {label: 'DateOfBirth',fieldName: 'Date_of_Birth__c', type : 'text'},
    {label: 'Email',fieldName: 'Email__c', type : 'text'},
    {label: 'Experience',fieldName: 'Experience__c', type : 'text'},
    {label: 'PhoneNumber',fieldName: 'Phone_number__c', type : 'text'},
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
    {
        label:'Edit',type: "button", 
        typeAttributes: {
            label: 'Edit',
            name: 'edit',
            title: 'Edit',
            value: 'edit',
            iconPosition: 'left',
        }
    },
    {
        label:'Delete',type: "button", 
        typeAttributes: {
            label: 'Delete',
            name: 'delete',
            title: 'Delete',
            disabled: false,
            value: 'Delete',
            iconPosition: 'left'
        }
    }
]
export default class List extends LightningElement {
    @track checkOpenCreate = true;
    @track checkOpenEdit = true;
    columns = COLUMNS;
    error = false;
    @track wiredEmployeeList = [];
    @api showTable = false;

    @api records;
    @track errors;
    @track recordsToDisplay;
    @track draftValues = [];

    defaultSortDirection = 'asc';
    sortDirection = 'asc';

    handlePagination(event){
        window.console.log('Pagination Action Handled ', JSON.stringify(event.detail.records));
        this.recordsToDisplay = event.detail.records;
    } 

    handleSearch(event){
        window.console.log(JSON.stringify(event.detail.records));
        // have records , set recordsToDisplay = result
        // if result more recordsperpage ? pagination : nothing
    }


    @wire(getAllEmployees) getData(response){
        this.wiredEmployeeList = response;
        if(response.data){
            this.records = response.data;
            this.errors = undefined;
            this.showTable = true;
        }else{
            console.log(response.error);
            this.records = undefined;
            this.errors = response.error;
            this.showTable = false;
        }
    }

    handleRowActions(event){
        const dataRow = event.detail.row;
        
        switch(event.detail.action.name){
            case 'edit':
                this.openEdit(dataRow)
                break;
            case 'view':
                this.openDetails(dataRow);
                break;
            case 'delete':
                this.confirmDelete(dataRow);
        }
    }

    async confirmDelete(data){
        const messageDelete ="Are you sure you want to delete this Employee?"
        const employee = data;
        const result = await LightningConfirm.open({
            message: messageDelete,
            label : "Delete Employee",
            theme: "warm"

        });

        if(result){
            const fieldToast = {title : 'Success' , message :'Deleted !' , variant: 'success', mode :'success'}
            deleteRecord(employee.Id).then(result => {
                this.showToast(
                    fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode
                );
                refreshApex(this.wiredEmployeeList);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    openEdit(data){
        this.checkOpenEdit = true;  
        this.template.querySelector('c-edit').openModalEdit(data);
    }
    turnOffEdit(){
        const fieldToast = {title : 'Success' , message :'Edited !' , variant: 'success', mode :'success'}
        this.checkOpenEdit = false;
        this.showToast(fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode);
        refreshApex(this.wiredEmployeeList);
    }

    openDetails(data){
        this.template.querySelector('c-details').openModalDetails(data);
    }

    openCreate(){
        this.checkOpenCreate = true;
        this.template.querySelector('c-create').openModalCreate();

    }
    
    turnOffCreate(){
        const fieldToast = {title : 'Success' , message :'Created !' , variant: 'success', mode :'success'}
        this.checkOpenCreate = false;
        this.showToast(fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode);
        refreshApex(this.wiredEmployeeList);     
    }

    showToast(title, message, variant,mode, data) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode : mode
        });
        this.dispatchEvent(event);
    }

    // sort
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.recordsToDisplay];
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.recordsToDisplay = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    sortBy( field, reverse, primer ) {

        const key = primer
        ? function( x ) {
            return primer(x[field]);
        }
        : function( x ) {
            return x[field];
        };

        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };
    }

    handleSave(event) {
        this.isLoading = true;
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        window.console.log(' Updating Records.... ');
        Promise.all(promises).then(record => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All Records updated',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            eval("$A.get('e.force:refreshView').fire();");
            return refreshApex(this.wiredEmployeeList);
        }).catch(error => {
            window.console.error(' error **** \n '+error);
        })
        .finally(()=>{
            this.isLoading = false;
        })
    }

    
}