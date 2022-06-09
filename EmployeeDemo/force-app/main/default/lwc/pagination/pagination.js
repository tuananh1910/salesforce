import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const DELAY = 300;
export default class Pagination extends LightningElement {
    alwaysFalse = false;
    @api records;
    @api recordsperpage;

    totalRecords;
    pageNo;
    totalPages;
    startRecord;
    endRecord;
    end = false;
    pagelinks = [];
    isLoading = false;

    ortedBy;

    @track pageSize;
    
    changeNumberRecordDisplay(event){
        const field = event.target.name;
        if (field === 'optionSelect') {
            this.recordsperpage  = event.target.value;
            clearTimeout(this.timeoutId);
            this.setRecordsToDisplay();
        }

    }
    setPageSize(){
        this.pageSize = [];
        for(let i=5;i<=30;i=i+5){
            this.pageSize.push(i);
        }
    }

    @api
    setupAgainPagination(records){
        this.records = records;
        this.setRecordsToDisplay();
    }

    connectedCallback() {
        this.isLoading = true;
        this.setPageSize();
        this.setRecordsToDisplay();

    }
    
    @api
    setRecordsToDisplay() { 
        this.clearAllPageLinks();
        this.totalRecords = this.records.length;
        this.pageNo = 1;
        this.totalPages = Math.ceil(this.totalRecords / this.recordsperpage);
        this.preparePaginationList();

        for (let i = 1; i <= this.totalPages; i++) {
            this.pagelinks.push(i);
        }
        this.isLoading = false;
    }

    clearAllPageLinks(){
        for (let i = 1; i <= this.totalPages; i++) {
            this.pagelinks.pop(i);
        }
    }

    handleClick(event) {
        let label = event.target.label;
        if (label === "First") {
            this.handleFirst();
        } else if (label === "Previous") {
            this.handlePrevious();
        } else if (label === "Next") {
            this.handleNext();
        } else if (label === "Last") {
            this.handleLast();
        }
    }

    handleNext() {
        this.pageNo += 1;
        this.preparePaginationList();
    }

    handlePrevious() {
        this.pageNo -= 1;
        this.preparePaginationList();
    }

    handleFirst() {
        this.pageNo = 1;
        this.preparePaginationList();
    }

    handleLast() {
        this.pageNo = this.totalPages;
        this.preparePaginationList();
    }

    // @api
    // get recordsToDisplay() {
    //     console.log('recordsToDisplay');
    //     let begin = (this.pageNo - 1) * parseInt(this.recordsperpage);
    //     let end = parseInt(begin) + parseInt(this.recordsperpage);

    //     this.startRecord = begin + parseInt(1);
    //     this.endRecord = end > this.totalRecords ? this.totalRecords : end;
    //     this.end = end > this.totalRecords ? true : false;
    //     return this.records.slice(begin, end);
    // }

    preparePaginationList() {
        this.isLoading = true;
        console.log('recordsToDisplay');
        console.log(JSON.stringify(this.records));
        let begin = (this.pageNo - 1) * parseInt(this.recordsperpage);
        let end = parseInt(begin) + parseInt(this.recordsperpage);

        this.startRecord = begin + parseInt(1);
        this.endRecord = end > this.totalRecords ? this.totalRecords : end;
        this.end = end > this.totalRecords ? true : false;
        this.recordsToDisplay =  this.records.slice(begin, end);
        const event = new CustomEvent('pagination', {
            detail: { 
                records : this.recordsToDisplay
            }
        });
        this.dispatchEvent(event);

        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.disableEnableActions();
        }, DELAY);
        this.isLoading = false;
    }

    disableEnableActions() {
        let buttons = this.template.querySelectorAll("lightning-button");
        buttons.forEach(bun => {
            if (bun.label === this.pageNo) {
                bun.disabled = false; // true
            } else {
                bun.disabled = false;
            }

            if (bun.label === "First") {
                bun.disabled = this.pageNo === 1 ? true : false;
            } else if (bun.label === "Previous") {
                bun.disabled = this.pageNo === 1 ? true : false;
            } else if (bun.label === "Next") {
                bun.disabled = this.pageNo === this.totalPages ? true : false;
            } else if (bun.label === "Last") {
                bun.disabled = this.pageNo === this.totalPages ? true : false;
            }
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const rowAction = new CustomEvent('actions', {
            detail: { 
                actionName : actionName,
                data : row
            }
        });
        this.dispatchEvent(rowAction);
    }

    handlePage(button) {
        this.pageNo = button.target.label;
        this.preparePaginationList();
    }  

}