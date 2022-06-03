public with sharing class JobPostingSiteController {
    public JobPostingSiteController() {

    }

    // get list job posting site
    @AuraEnabled(cacheable=true)
    public static List<Job_Posting_Site__c> getJobPostingSiteList(){
        return [
            SELECT 
            Name,
            Description__c,
            Job_Posting_Site_URL__c,
            Status__c,
            Technical_Site__c
            FROM Job_Posting_Site__c
            LIMIT 10
        ];
    }
}