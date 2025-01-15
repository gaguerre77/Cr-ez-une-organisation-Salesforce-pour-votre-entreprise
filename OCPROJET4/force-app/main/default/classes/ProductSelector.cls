public with sharing class ProductSelector {
    public static List<OpportunityLineItem> getProductsByOpportunity(Id opportunityId) {
        return [
            SELECT 
                Product2.Name, Quantity, UnitPrice, TotalPrice, Product2.QuantityInStock__c 
            FROM OpportunityLineItem
            WHERE OpportunityId = :opportunityId
        ];
    }
}