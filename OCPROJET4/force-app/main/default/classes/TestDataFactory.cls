public class TestDataFactory {
    public static Product2 createProduct(String name, Decimal price) {
        Product2 product = new Product2(Name=name, IsActive=true);
        insert product;
        return product;
    }

    public static Opportunity createOpportunity(String name, Date closeDate, String stage, Id pricebook2Id) {
        Opportunity opp = new Opportunity(Name=name, CloseDate=closeDate, StageName=stage, Pricebook2Id=pricebook2Id);
        insert opp;
        return opp;
    }

    public static void createOpportunityLineItem(Id oppId, Id pricebook2Id, Id product2Id, Integer quantity) {
        // Ensure the correct PricebookEntryId is used
        List<PricebookEntry> pbeList = [SELECT Id FROM PricebookEntry WHERE Product2Id = :product2Id AND Pricebook2Id = :pricebook2Id];
        if (!pbeList.isEmpty()) {
            OpportunityLineItem oli = new OpportunityLineItem(
                OpportunityId=oppId,
                PricebookEntryId=pbeList[0].Id,
                Quantity=quantity,
                UnitPrice=25000
            );
            insert oli;
        } else {
            System.debug('No PricebookEntry found for Product2Id: ' + product2Id + ' and Pricebook2Id: ' + pricebook2Id);
        }
    }
}
