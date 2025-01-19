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
public class ProductSelectorTest {
    @testSetup
    static void setup() {
        // Create a Test Price Book
        Pricebook2 TestPriceBook = new Pricebook2(Name='TestPriceBook', IsActive=true);
        insert TestPriceBook;

        // Create Products
        Product2 product1 = TestDataFactory.createProduct('Product 1', 50);
        Product2 product2 = TestDataFactory.createProduct('Product 2', 30);

        // Retrieve the Standard Pricebook
        Id STDPriceBookId = Test.getStandardPricebookId();

        // Create Standard Price Book Entries
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

        // Create Test Price Book Entries
        List<PricebookEntry> pbeList = new List<PricebookEntry>();
        pbeList.add(new PricebookEntry(Pricebook2Id=TestPriceBook.Id, Product2Id=product1.Id, UnitPrice=99990, IsActive=true));
        pbeList.add(new PricebookEntry(Pricebook2Id=TestPriceBook.Id, Product2Id=product2.Id, UnitPrice=69900, IsActive=true));
        insert pbeList;

        // Create an Opportunity with the Test Price Book
        Opportunity opp = TestDataFactory.createOpportunity('Test Opportunity', Date.today().addDays(30), 'Prospecting', TestPriceBook.Id);

        // Create Opportunity Line Items
        TestDataFactory.createOpportunityLineItem(opp.Id, TestPriceBook.Id, product1.Id, 10);
        TestDataFactory.createOpportunityLineItem(opp.Id, TestPriceBook.Id, product2.Id, 5);
    }

    @isTest
    static void testGetProductsByOpportunity() {
        // Retrieve the opportunity created in testSetup
        List<Opportunity> oppList = [SELECT Id FROM Opportunity LIMIT 1];
        if (!oppList.isEmpty()) {
            Opportunity opp = oppList[0];

            // Call the method to test
            List<OpportunityLineItem> products = ProductSelector.getProductsByOpportunity(opp.Id);

            // Verify the results
            System.assertEquals(2, products.size(), 'Deux produits devraient être retournés');
            System.assertEquals('Product 1', products[0].Product2.Name, 'Le premier produit devrait être "Product 1"');
            System.assertEquals('Product 2', products[1].Product2.Name, 'Le deuxième produit devrait être "Product 2"');
        } else {
            System.debug('No Opportunities found');
        }
    }
}
