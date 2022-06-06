import { LightningElement } from 'lwc';

export default class Pagination extends LightningElement {
    recordList; // The List of Complete Records
    pageList; // The record List which needs to be displayed in a page
    currentPage = 1;
    // by default will always be 1
    recordPerPage = 10;
    // The no of records needs to be displayed in a single page
    totalPages = 1;   // calculates the total number of pages

    connectedCallback(){
        this.totalPages = Math.ceil(recordList.length / recordPerPage );
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

    preparePaginationList(){
        let begin = (this.pageNo - 1) * parseInt(this.recordsperpage);
        let end = parseInt(begin) + parseInt(this.recordsperpage);
        this.recordsToDisplay = this.records.slice(begin, end);
    }

    

}