@isTest
public class CaseControllerTest {
    @isTest
    public static void getcasestest() {
        Case c = new Case();
        c.Status = 'New';
        c.Origin = 'Email';
        c.ContactId = '0032w00000G9egTAAR';
        insert c;
        Test.startTest();
        List<Case> allcases = CaseController.getCases();
        Test.stopTest();
    }
}
