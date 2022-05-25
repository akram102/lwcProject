public with sharing class AkramOppProduct {
    
    @AuraEnabled(cacheable=true)
    public static List<Opp_Product__c> getProduct(Id oppId){
        String Query = 'select Id, Name, Description__c, Opportunity__c, Price__c, Quantity__c from Opp_Product__c where Opportunity__c = :oppId';
        return Database.query(Query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Opp_Product__c> singleProduct(Id productId){
        String Query = 'select Id, Name, Description__c, Opportunity__c, Price__c, Quantity__c from Opp_Product__c where Id = :productId';
        return Database.query(Query);
    }
}
