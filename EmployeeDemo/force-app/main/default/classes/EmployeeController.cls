public with sharing class EmployeeController {
    public EmployeeController() {

    }

    // get list employee
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getAllEmployees(){
        return [
            SELECT 
            id,
            Age__c,
            Certifications__c,
            Date_of_Birth__c,
            Email__c,
            Experience__c,
            FirstName__c,
            FullName__c,
            LastName__c,
            Phone_number__c,
            Position__c,
            No__c
            FROM Employee__c
        ];
    }

    @AuraEnabled(cacheable=true)
    public static list<Employee__c> searchEmployee(string searchKey) {
        string searchKeyword = '%' + searchKey + '%';
		
       // create contact list to store search result 
        list<Employee__c> ems = new list<Employee__c>();
     
	   // query contact records
        for(Employee__c emObj : [Select 
        id,
        Age__c,
        Certifications__c,
        Date_of_Birth__c,
        Email__c,
        Experience__c,
        FirstName__c,
        FullName__c,
        LastName__c,
        Phone_number__c,
        Position__c,
        No__c
        From Employee__c
        WHERE FullName__c LIKE : searchKeyword]){
           ems.add(emObj);
        }
        
         if(ems.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return ems;
    }

}
