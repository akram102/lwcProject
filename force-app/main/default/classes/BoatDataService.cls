public with sharing class BoatDataService {

    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes(){

        String Query = 'select Id, Name from BoatType__c';
        List<BoatType__c> boatTypeList = Database.query(Query);
        return boatTypeList;
    }

    public static void createNewBoat(){
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId ){
        String key = boatTypeId;
        if(String.isBlank(key)){
            String Query = 'select Id, Name, BoatType__c, Picture__c,Price__c,Year_Built__c,Length__c,Geolocation__c,Contact__c,Boat_Image__c from Boat__c';
        }
        else{
            String Query = 'select Id, Name, BoatType__c, Picture__c,Price__c,Year_Built__c,Length__c,Geolocation__c,Contact__c,Boat_Image__c from Boat__c where BoatType__c = :key';
        }
        List<Boat__c> boatList = Database.query(Query);
        return boatList;
    }

    @AuraEnabled
    public static void updateBoatList(Object data){
        
    }
}
    
