public with sharing class BoatDataService {

    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes(){

        String Query = 'select Id, Name from BoatType__c';
        List<BoatType__c> boatTypeList = Database.query(Query);
        return boatTypeList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId ){
        String key = boatTypeId;
        String Query = '';
        if(String.isBlank(key)){
            Query = 'select Id, Description__c, Name, BoatType__c, Picture__c,Price__c,Year_Built__c,Length__c,Geolocation__c,Contact__c,Boat_Image__c from Boat__c';
        }
        else{
            Query = 'select Id, Description__c, Name, BoatType__c, Picture__c,Price__c,Year_Built__c,Length__c,Geolocation__c,Contact__c,Boat_Image__c from Boat__c where BoatType__c = :key';
        }
        List<Boat__c> boatList = Database.query(Query);
        return boatList;
    }
    @AuraEnabled
    public static Void getBoatsByLocation(String boatTypeId){

    }

    @AuraEnabled(cacheable=true)
    public static String updateBoatList(Object data){
        List<Boat__c> boatsToUpdate = (List<Boat__c>)JSON.deserialize(JSON.serialize(data),List<Boat__c>.class);
        update boatsToUpdate;
        return 'Success: Boats updated successfully';
    }
}
    
