import { LightningElement, api, track } from 'lwc';
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
    setRecordsPerPage(){
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
        this.setRecordsPerPage();
        this.setRecordsToDisplay();

    }

    // page link : total pages
    // display page link : 5 no page .... 4 5 6 7 8 ....
    // check no page link current : ex : is 8 
    // display slice pageLinks beign: 8-2 and end: 8+2
    // @track 1 variable pageLinksToDisplay store 45678 -> onchange 
    // page no 1 then push 2345
    // pageLinksToDisplay=[];
    // setPageLinksToDisplay(){
        
    // }
    
    
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