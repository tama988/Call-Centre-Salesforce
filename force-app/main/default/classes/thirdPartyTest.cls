@IsTest
private class thirdPartyTest {
    @isTest static void testGetCaseById() {
        Id recordId = createTestRecord();
        RestRequest request = new RestRequest();
        request.requestUri =
            'https://yourInstance.salesforce.com/services/apexrest/Cases/'
            + recordId;
        request.httpMethod = 'GET';
        RestContext.request = request;
        
        Case thisCase = thirdParty.getCaseById();
        
        System.assert(thisCase != null);
        System.assertEquals('Test record', thisCase.Subject);
    }
    @isTest static void testCreateCase() {
        
        ID thisCaseId = thirdParty.createCase(
            '0032w00000G9egTAAR', 'Btech graduate', 'New', 'Web', 'Equipment Complexity');
       
        System.assert(thisCaseId != null);
        Case thisCase = [SELECT Id,Subject FROM Case WHERE Id=:thisCaseId];
        System.assert(thisCase != null);
        System.assertEquals(thisCase.Subject, 'Btech graduate');
    }

    @isTest static void testUpsertCase() {
        
        ID case1Id = thirdParty.upsertCase(
            '0032w00000G9egTAAR', 'Btech graduate', 'New', 'Web', 'Equipment Complexity', null);
       
        System.assert(Case1Id != null);
        Case case1 = [SELECT Id,Subject FROM Case WHERE Id=:case1Id];
        System.assert(case1 != null);
        System.assertEquals(case1.Subject, 'Btech graduate');
       
        ID case2Id = thirdParty.upsertCase(
            '0032w00000G9egTAAR', 'Btech graduate', 'New', 'Web', 'Equipment Complexity', case1Id);
       
        System.assertEquals(case1Id, case2Id);
        Case case2 = [SELECT Id,Status FROM Case WHERE Id=:case2Id];
        System.assert(case2 != null);
        System.assertEquals(case2.Status, 'New');
    }    
    @isTest static void testUpdateCaseFields() {
        Id recordId = createTestRecord();
        RestRequest request = new RestRequest();
        request.requestUri =
            'https://yourInstance.salesforce.com/services/apexrest/Cases/'
            + recordId;
        request.httpMethod = 'PATCH';
        request.addHeader('Content-Type', 'application/json');
        request.requestBody = Blob.valueOf('{"status": "New"}');
        RestContext.request = request;
        
        ID thisCaseId = thirdParty.updateCaseFields();
        
        System.assert(thisCaseId != null);
        Case thisCase = [SELECT Id,Status FROM Case WHERE Id=:thisCaseId];
        System.assert(thisCase != null);
        System.assertEquals(thisCase.Status, 'New');
    }  

    // Helper method
    static Id createTestRecord() {
       
        Case caseTest = new Case(
            ContactId='0032w00000G9egPAAR',
            Subject='Test record',
            Status='Working',
            Origin='Phone',
            Reason='Feedback');
        insert caseTest;
        return caseTest.Id;
    }          
}