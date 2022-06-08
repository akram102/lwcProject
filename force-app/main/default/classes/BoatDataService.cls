public with sharing class BoatDataService {

    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes(){
        String Query = 'select Id, Name from BoatType__c';
        List<BoatType__c> boatTypeList = Database.query(Query);
        return boatTypeList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId ){
        String queryString = 'select Id, Description__c, Name, BoatType__r.Name, Picture__c,Price__c,Year_Built__c,Length__c,Geolocation__Latitude__s,Geolocation__Longitude__s,Contact__r.Name,Boat_Image__c from Boat__c';
        if(String.isNotBlank(boatTypeId)){
            queryString = queryString + ' where BoatType__c =:boatTypeId';
        }
        return Database.query(queryString);
    }
    @AuraEnabled(cacheable=true)
    public static String getBoatsByLocation(Decimal latitude, Decimal longitude, String boatTypeId){
        String units = 'mi';
        String queryString = 'SELECT Name, Geolocation__Latitude__s, Geolocation__Longitude__s FROM Boat__c';
        if(String.isNotBlank(boatTypeId)){
            queryString +=  ' WHERE BoatType__c = :boatTypeId';
        }
        queryString +=  ' ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), \'mi\') LIMIT 10';
        return JSON.serialize(Database.query(queryString));
    }

    @AuraEnabled
    public static String updateBoatList(Object data){
        List<Boat__c> boatsToUpdate = (List<Boat__c>)JSON.deserialize(JSON.serialize(data),List<Boat__c>.class);
        try{
            update boatsToUpdate;
            return 'Success: Boats updated successfully';
        }
        catch(Exception e){
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }
}
    
