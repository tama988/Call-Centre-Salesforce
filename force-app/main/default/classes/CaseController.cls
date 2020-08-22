public with sharing class CaseController 
{
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases() 
    {
        List<Case> allCase= [ SELECT Id, CaseNumber, ContactId, Subject, 
        Reason, Status, Origin, Acc__c, Con__c FROM Case];
        return allCase;
    }


    
}
