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


    @AuraEnabled
    public static Job_Posting_Site__c edit(Job_Posting_Site__c selJPS)
    {
        if(selJPS!=NULL)
        {
            upsert selJPS;
        }
        return selJPS;
    }
    
    @AuraEnabled
    public static List<Job_Posting_Site__c> delete(Job_Posting_Site__c delJPS)
    {
        system.debug('delAccount'+delJPS);
        if(delJPS!=NULL)
        {
            delete delJPS;
           List<Job_Posting_Site__c> jPSs = new List<Job_Posting_Site__c>();
           jPSs = getJobPostingSiteList();
            return jPSs;
        }
        return null;
    }
}
