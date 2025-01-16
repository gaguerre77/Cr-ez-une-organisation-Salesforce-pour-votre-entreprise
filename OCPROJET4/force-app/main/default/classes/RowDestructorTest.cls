/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
public class RowDestructorTest {
    @testSetup
    static void setup() {
        // Réutiliser la configuration de ProductSelectorTest
        Pricebook2 TestPriceBook = new Pricebook2(Name='TestPriceBook', IsActive=true);
        insert TestPriceBook;

        Product2 product1 = TestDataFactory.createProduct('Product 1', 50);
        Product2 product2 = TestDataFactory.createProduct('Product 2', 30);

        Id STDPriceBookId = Test.getStandardPricebookId();

        PricebookEntry standardPrice1 = new PricebookEntry(
            Pricebook2Id = STDPriceBookId,
            Product2Id = product1.Id,
            UnitPrice = 10000,
            IsActive = true
        );
        insert standardPrice1;

        PricebookEntry standardPrice2 = new PricebookEntry(
            Pricebook2Id = STDPriceBookId,
            Product2Id = product2.Id,
            UnitPrice = 10000,
            IsActive = true
        );
        insert standardPrice2;

        List<PricebookEntry> pbeList = new List<PricebookEntry>();
        pbeList.add(new PricebookEntry(Pricebook2Id=TestPriceBook.Id, Product2Id=product1.Id, UnitPrice=99990, IsActive=true));
        pbeList.add(new PricebookEntry(Pricebook2Id=TestPriceBook.Id, Product2Id=product2.Id, UnitPrice=69900, IsActive=true));
        insert pbeList;

        Opportunity opp = TestDataFactory.createOpportunity('Test Opportunity', Date.today().addDays(30), 'Prospecting', TestPriceBook.Id);

        TestDataFactory.createOpportunityLineItem(opp.Id, TestPriceBook.Id, product1.Id, 10);
        TestDataFactory.createOpportunityLineItem(opp.Id, TestPriceBook.Id, product2.Id, 5);
    }

    @isTest
    static void testDeleteRowByrecordId() {
        // Récupérer l'OpportunityLineItem créée dans testSetup
        OpportunityLineItem item = [SELECT Id FROM OpportunityLineItem LIMIT 1];

        // Appeler la méthode à tester
        RowDestructor.deleteRowByrecordId(item.Id);

        // Vérifier que l'OpportunityLineItem a été supprimée
        OpportunityLineItem[] itemList = [SELECT Id FROM OpportunityLineItem WHERE Id = :item.Id];
        System.assertEquals(0, itemList.size(), 'L\'OpportunityLineItem aurait dû être supprimée');
    }


}
