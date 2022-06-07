import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const DELAY = 300;
export default class Pagination extends LightningElement {
    
    @api records;
    @api recordsToDisplay;
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

    connectedCallback() {
        this.isLoading = true;
        this.setRecordsToDisplay();
    }
    setRecordsToDisplay() {
        this.totalRecords = this.records.length;
        this.pageNo = 1;
        this.totalPages = Math.ceil(this.totalRecords / this.recordsperpage);
        this.preparePaginationList();

        for (let i = 1; i <= this.totalPages; i++) {
            this.pagelinks.push(i);
        }
        this.isLoading = false;
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
    preparePaginationList() {
        this.isLoading = true;
        let begin = (this.pageNo - 1) * parseInt(this.recordsperpage);
        let end = parseInt(begin) + parseInt(this.recordsperpage);
        window.console.log(JSON.stringify(this.records))
        this.recordsToDisplay = this.records.slice(begin, end);

        this.startRecord = begin + parseInt(1);
        this.endRecord = end > this.totalRecords ? this.totalRecords : end;
        this.end = end > this.totalRecords ? true : false;

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
                bun.disabled = true;
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