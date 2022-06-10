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
    {label: 'FullName',fieldName: 'FullName__c', type : 'text', sortable: true},
    {label: 'Age',fieldName: 'Age__c', type : 'text', sortable: true},
    {label: 'Certifications',fieldName: 'Certifications__c', type : 'checkbox'},
    {label: 'DateOfBirth',fieldName: 'Date_of_Birth__c', type : 'text'},
    {label: 'Email',fieldName: 'Email__c', type : 'text'},
    {label: 'Experience',fieldName: 'Experience__c', type : 'text'},
    {label: 'PhoneNumber',fieldName: 'Phone_number__c', type : 'text'},
    {label: 'Position',fieldName: 'Position__c', type : 'checkbox', sortable: true},
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
    @track showDeleteMultiRecordButton = false;
    columns = COLUMNS;
    error = false;
    wiredEmployeeList;
    @track showTable = false;

    @track records;
    @track errors;
    recordsToDisplay;
    @track draftValues = [];

    listIdSelected;

    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    isDeletedRecords = true;

    modalEdit = false;
    modalView = false;
    modalCreate = false;
    recordId;

    handlePagination(event){
        console.log('paginating');
        this.recordsToDisplay = event.detail.records;
    } 

    handleSearch(event){   
        this.recordsToDisplay = event.detail.records;
        this.records = this.recordsToDisplay;
        this.template.querySelector('c-pagination').setupAgainPagination(this.records);
    }

    @wire(getAllEmployees) 
    getData(response){
        this.wiredEmployeeList = response;
        if(response.data){
            this.records = response.data;
            console.log("wire data : ",JSON.stringify(this.records));
            this.errors = undefined;
            this.showTable = true;
        }else if(response.error){
            this.records = [];
            this.errors = response.error;
            this.showTable = false;
        }
    }

    
    handleSelected(event){
        const selectedRows = event.detail.selectedRows;
        this.listIdSelected = [];
        for (let i = 0; i < selectedRows.length; i++) {
            this.listIdSelected.push(selectedRows[i].Id)
        }
        
        if(this.listIdSelected.length >0) {
            this.showDeleteMultiRecordButton = true;
          } else {
              this.showDeleteMultiRecordButton = false;
          }
    }
    async confirmDeletes(){
        let messageDelete ="Are you sure you want to delete these Employees?";
        let result = await LightningConfirm.open({
            message: messageDelete,
            label : "Delete Employees",
            theme: "error"
        });
        if(result){

            if(this.handleDeletes(this.listIdSelected)){
                let fieldToast = {title : 'Success' , message :'Deleted !' , variant: 'success', mode :'success'}
                this.showToast(
                    fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode
                );
                
            }else{
                let fieldToast = {title : 'Error' , message :'Can not delete  !' , variant: 'error', mode :'error'}
                this.showToast(
                    fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode
                );
               
            }        
        }
    }

    handleDeletes(data){
        console.log('handle deletes',JSON.stringify(data));
        for (let i = 0 ; i<data.length;i++){
            console.log('id ? : ',data[i]);
            deleteRecord(data[i]).then(result => {
                this.refreshRecords();
            })
            .catch(error => {
                console.log('error');
                this.isDeletedRecords  = false;
            });
        }
        return this.isDeletedRecords;
    }


    handleRowActions(event){
        let id =event.detail.row.Id;
        switch(event.detail.action.name){
            case 'edit':
                this.openEdit(id);
                break;
            case 'view':
                this.openDetails(id);
                break;
            case 'delete':
                this.confirmDelete(id);
        }
    }

    async confirmDelete(id){
        const messageDelete ="Are you sure you want to delete this Employee?"
        const result = await LightningConfirm.open({
            message: messageDelete,
            label : "Delete Employee",
            theme: "error"
        });

        if(result){
            deleteRecord(id).then(result => {
                if(result){
                    const fieldToast = {title : 'Success' , message :'Deleted !' , variant: 'success', mode :'success'}
                    this.showToast(
                    fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode);
                }
                this.refreshRecords();
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    

    openEdit(data){
        this.modalEdit = true;  
        this.recordId = data;
    }
    editSuccess(){
        console.log('edit');
        const fieldToast = {title : 'Success' , message :'Edited !' , variant: 'success', mode :'success'}
        this.showToast(
        fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode);

        this.modalEdit = false;
        this.refreshRecords();
    }


    

    closeEdit(){
        this.modalEdit = false;
    }



    openDetails(data){
        this.modalView = true;
        this.recordId = data
    }

    closeDetails(){
        this.modalView = false;
    }


    openCreate(){
        this.modalCreate = true;
    }
    createSuccess(){
        const fieldToast = {title : 'Success' , message :'Created !' , variant: 'success', mode :'success'}
        this.showToast(
        fieldToast.title, fieldToast.message, fieldToast.variant, fieldToast.mode);
       this.modalCreate = false;
       this.refreshRecords();
    }
    closeCreate(){
        this.modalCreate = false;
    }


    showToast(title, message, variant,mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode : mode
        });
        this.dispatchEvent(event);
    }

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

    async refreshRecords(){
        let promise = await refreshApex(this.wiredEmployeeList);
        Promise.all(promise).then(record => {
            
        }).catch(error => {
            
        }).finally(()=>{
            console.log("edit data : ",JSON.stringify(this.records));
            this.template.querySelector('c-pagination').setupAgainPagination(this.records);
        })
    }
    
}