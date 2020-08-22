@RestResource(urlMapping='/Cases/*')
global with sharing class thirdParty {
    @HttpGet
    global static Case getCaseById() {
        RestRequest request = RestContext.request;
        
        String caseId = request.requestURI.substring(
          request.requestURI.lastIndexOf('/')+1);
        Case result =  [SELECT CaseNumber,ContactId,Subject,Status,Origin,Reason
                        FROM Case
                        WHERE Id = :caseId];
        return result;
    }
    @HttpPost
    global static ID createCase(String contactname, String subject, String status,
        String origin, String reason) {
        Case thisCase = new Case(
            ContactId=contactname,
            Subject=subject,
            Status=status,
            Origin=origin,
            Reason=reason);
        insert thisCase;
        return thisCase.Id;
    }   
   
    @HttpPut
    global static ID upsertCase(String contactname, String subject, String status,
        String origin, String reason, String id) {
        Case thisCase = new Case(
                Id=id,
                ContactId=contactname,
                Subject=subject,
                Status=status,
                Origin=origin,
                Reason=reason);
        
        upsert thisCase;
        return thisCase.Id;
    }
    @HttpPatch
    global static ID updateCaseFields() {
        RestRequest request = RestContext.request;
        String caseId = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1);
        Case thisCase = [SELECT Id FROM Case WHERE Id = :caseId];
        
        Map<String, Object> params = (Map<String, Object>)JSON.deserializeUntyped(request.requestbody.tostring());
        
        for(String fieldName : params.keySet()) {
            
            thisCase.put(fieldName, params.get(fieldName));
        }
        update thisCase;
        return thisCase.Id;
    }    
}