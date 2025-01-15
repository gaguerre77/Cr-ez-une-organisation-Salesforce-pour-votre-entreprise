// controleur permettant de récupérer les produits sur les opportunités


public with sharing class OpportunityLineItemController {
    
  
    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunityLineItems(Id opportunityId) {
        return ProductSelector.getProductsByOpportunity(opportunityId);
    }

// procédure pour supprimer la ligne

    @AuraEnabled
    public static void deleteOpportunityLineItem(Id recordId) {
        RowDestructor.deleteRowByrecordId(recordId);       
        }
    }





