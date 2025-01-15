public with sharing class RowDestructor {
    public static void deleteRowByrecordId(Id recordId) {
        try {
            OpportunityLineItem item = [SELECT Id FROM OpportunityLineItem WHERE Id = :recordId LIMIT 1];
            delete item;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting record: ' + e.getMessage());
        }
}
}