public with sharing class EmployeeController {
    public EmployeeController() {

    }

    // get list employee
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getAllEmployees(){
        return [
            SELECT 
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
            LIMIT 10
        ];
    }
}
