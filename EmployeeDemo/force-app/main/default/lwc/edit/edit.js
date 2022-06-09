import { api, LightningElement, track } from 'lwc';
import FirstName from '@salesforce/schema/Employee__c.FirstName__c';
import LastName from '@salesforce/schema/Employee__c.LastName__c';
import Certifications from '@salesforce/schema/Employee__c.Certifications__c';
import Date_of_Birth from '@salesforce/schema/Employee__c.Date_of_Birth__c';
import Email from '@salesforce/schema/Employee__c.Email__c';
import Experience from '@salesforce/schema/Employee__c.Experience__c';
import Phone_number from '@salesforce/schema/Employee__c.Phone_number__c';
import Position from '@salesforce/schema/Employee__c.Position__c';

const fields = [
    FirstName,
    LastName,
  Certifications,
   Date_of_Birth,
   Email,
   Experience,
   Phone_number,
   Position
   
]
export default class Edit extends LightningElement {
    @api modalEdit;
    @api recordId;

    fields = fields;

    closeModalAction(){
        const customEvent = new CustomEvent('close');
        this.dispatchEvent(customEvent);
    }
    
    finish(event){
        const customEvent = new CustomEvent('success');
        this.dispatchEvent(customEvent);
        

    }
}