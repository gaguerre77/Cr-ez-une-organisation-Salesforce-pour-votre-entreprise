// controleur permettant de récupérer les produits sur les opportunités


public with sharing class OpportunityLineItemController {
    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityLineItems(Id opportunityId) {
        return [
            SELECT 
                Product2.Name, Quantity, UnitPrice, TotalPrice, Product2.QuantityInStock__c 
            FROM OpportunityLineItem
            WHERE OpportunityId = :opportunityId
        ];
    }

// procédure pour supprimer la ligne

    @AuraEnabled
    public static void deleteOpportunityLineItem(Id recordId) {
        try {
            OpportunityLineItem item = [SELECT Id FROM OpportunityLineItem WHERE Id = :recordId LIMIT 1];
            delete item;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting record: ' + e.getMessage());
        }
    }




}
