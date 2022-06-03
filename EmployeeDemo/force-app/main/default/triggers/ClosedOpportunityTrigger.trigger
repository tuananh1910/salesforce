trigger ClosedOpportunityTrigger on Opportunity (after insert, after update) {
    List<Task> tasks = new List<Task>();
    for(OpporTunity opp : Trigger.New){
        if(opp.StageName == 'Closed Won' ){
        tasks .add(new Task(subject = 'Follow Up Test Task', WhatId = opp.Id));
        }
    }
    
    if(tasks.size()>0){
        insert tasks;
    }
}