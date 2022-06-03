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
            DateOfBirth__c,
            Email__c,
            Experience__c,
            FirstName__c,
            FullName__c,
            LastName__c,
            PhoneNumber__c,
            Position__c
            FROM Employee__c
            LIMIT 10
        ];
    }
}
