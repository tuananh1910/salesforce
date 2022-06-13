import { api, LightningElement, track, wire } from 'lwc';
import getAllEmployees from '@salesforce/apex/EmployeeController.getAllEmployees'
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningConfirm from 'lightning/confirm'
import { deleteRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';

const COLUMNS = [
    {label: 'First Name',fieldName: 'FirstName__c', type : 'text',  clipText: true},
    {label: 'Last Name',fieldName: 'LastName__c', type : 'text',clipText: true},
    {label: 'Full Name',fieldName: 'FullName__c', type : 'text', sortable: true},
    {label: 'Age',fieldName: 'Age__c', type : 'text',clipText: true},
    {label: 'Certifications',fieldName: 'Certifications__c', type : 'text',clipText: true},
    {label: 'Date Of Birth',fieldName: 'Date_of_Birth__c', type : 'date',clipText: true},
    {label: 'Email',fieldName: 'Email__c', type : 'text',clipText: true},
    {label: 'Experience',fieldName: 'Experience__c', type : 'number',clipText: true},
    {label: 'Phone Number',fieldName: 'Phone_number__c', type : 'text',clipText: true},
    {label: 'Position',fieldName: 'Position__c', type : 'text',clipText: true},
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
            iconName: 'action:edit',
            name: 'edit',
            title: 'Edit',
            value: 'edit',
            iconPosition: 'center',
        }
    },
    {
        label:'Delete',type: "button", 
        typeAttributes: {
            iconName: 'action:delete',
            name: 'delete',
            title: 'Delete',
            value: 'Delete',
            iconPosition: 'center'
        }
    }
]
export default class List extends LightningElement {
    showDeleteMultiRecordButton = false;
    columns = COLUMNS;
    error = false;
    wiredEmployeeList;
    showTable = false;

    records;
    errors;
    recordsToDisplay;

    listIdSelected=[];

    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    isDeletedRecords = true;

    modalEdit = false;
    modalView = false;
    modalCreate = false;
    recordId;

    handlePagination(event){
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
        // if(selectedRows==null){
        //     this.listIdSelected = [];
        // }
        this.listIdSelected = [];
        for (let i = 0; i < selectedRows.length; i++) {
            this.listIdSelected.push(selectedRows[i].Id)
        }
        
        if(this.listIdSelected.length >0) {
            this.showDeleteMultiRecordButton = true;
          } else {
              this.showDeleteMultiRecordButton = false;
          }
        
        console.log(JSON.stringify(this.listIdSelected));
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
            deleteRecord(data[i]).then(result => {
                this.refreshRecords();
            })
            .catch(error => {
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
        const cloneData = [...this.records];
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        // this.recordsToDisplay = cloneData;
        this.records = cloneData;
        this.refreshRecords();

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

    async refreshRecords(){
        let promise = await refreshApex(this.wiredEmployeeList);
        Promise.all(promise).then(record => {
            
        }).catch(error => {
            
        }).finally(()=>{
            this.template.querySelector('c-pagination').setupAgainPagination(this.records);
        })
    }
    
}