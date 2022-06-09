import { LightningElement, api, track } from 'lwc';
import searchEmployee from '@salesforce/apex/EmployeeController.searchEmployee'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class Search extends LightningElement {
    searchValue = '';

    searchKeyword(event) {
        this.searchValue = event.target.value;
    }
 
    handleSearchKeyword() {
        
        if (this.searchValue !== '') {
            searchEmployee({
                    searchKey: this.searchValue
                })
                .then(result => {
                    const event = new CustomEvent('search',{
                        detail: {
                            records : result
                        }
                    });
                    this.dispatchEvent(event);
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Not Found',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);

                    const search = new CustomEvent('search',{
                        detail: {
                            errors : error.body.message
                        }
                    });
                    this.dispatchEvent(search);   
                    
                });
        } else {
            // fire toast event if input field is blank
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search text missing..',
            });
            this.dispatchEvent(event);
        }
    }
}