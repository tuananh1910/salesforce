public with sharing class Pagination {
    public Pagination() {

    }

    public Integer size{get; set;}
    public final Integer Page_Size = 10;

    public ApexPages.StandardSetController setCon {
        get{
            if(setCon == null){
                size=Page_Size;
                List<Employee__c> ems = [SELECT 
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
                FROM Employee__c];

                setCon = new ApexPages.StandardSetController(Database.getQueryLocator(queryString));
                setCon.setPageSize(size);
                noOfRecords = setCon.getResultSize();
            }
            return setCon;
        }set;
    }

    public Boolean hasNext {
        get {
            return setCon.getHasNext();
        }
        set;
    }
    public Boolean hasPrevious {
        get {
            return setCon.getHasPrevious();
        }
        set;
    }

    public Integer pageNumber {
        get {
            return setCon.getPageNumber();
        }
        set;
    }

    public void first() {
        setCon.first();
        // do you operation here 
    }

    public void last() {
        setCon.last();
            // do you operation here 
    }

    public void previous() {
        setCon.previous();
            // do you operation here 
    }

    public void next() {
        setCon.next();
            // do you operation here 
    }

    public void contactSelection()
    {
        Id id=(Id)ApexPages.currentPage().getParameters().get('cId');
        if(selectedContactIds.contains(id))
            selectedContactIds.remove(id);
            else
            selectedContactIds.add(id);
    }

 public void deleteContacts()
    {
        List<contact> contactToDelete=[select id from contact where id in :selectedContactIds];
        if(contactToDelete.size()!=0)  //   if(!contactToDelete.isEmpty()) // Best Practice 
           { 
                try {  delete contactToDelete; }  // You may get Exception if you try to delete the 
                                                // related contact ,include try block to avoid error.
                catch(exception ex){ System.debug(ex); }
                refresh();
           }
    }   

 public pageReference refresh() {
        setCon = null;
        selectedContactIds=new set<id>();
        getContacts();
        setCon.setPageNumber(1);
        return null;
    }
}
