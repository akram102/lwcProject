public with sharing class BoatDataService {

    public static final String LENGTH_SELECTED = 'Length';
    public static final String TYPE_SELECTED = 'Type';
    public static final String PRICE_SELECTED = 'Price';

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

    @AuraEnabled
    public static List<BoatReview__c> getAllReviews(Id boatId){
       String queryString = 'select id, Name, Comment__c, Rating__c, Boat__c, CreatedBy.SmallPhotoUrl, CreatedBy.Name, CreatedBy.CompanyName, CreatedDate from BoatReview__c where Boat__c =:boatId ORDER BY CreatedDate DESC';
       return Database.query(queryString);
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getSimilarBoats(Id boatId, String similarBy){
        List<Boat__c> queryResult = new List<Boat__c>();
        List<Boat__c> selectedBoat = [SELECT Id, Name, BoatType__c, Length__c, Picture__c, Price__c, Year_Built__c FROM Boat__c WHERE Id = :boatId];
        String queryString = '';
        if(similarBy == LENGTH_SELECTED){
            queryResult = [SELECT  Id, Contact__r.Name, Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
             FROM   Boat__c 
             WHERE  Id != :selectedBoat.get(0).Id 
             AND   (Length__c >= :selectedBoat.get(0).Length__c / 1.2)
             AND   (Length__c <= :selectedBoat.get(0).Length__c * 1.2)
             ORDER BY Length__c, Price__c, Year_Built__c];
        }
        else if(similarBy == PRICE_SELECTED){
            queryResult = [SELECT  Id, Contact__r.Name, Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c 
             FROM   Boat__c 
             WHERE  Id != :selectedBoat.get(0).Id 
             AND   (Price__c >= :selectedBoat.get(0).Price__c / 1.2)
             AND   (Price__c <= :selectedBoat.get(0).Price__c * 1.2)
             ORDER BY Length__c, Price__c, Year_Built__c];
        }
        else if(similarBy == TYPE_SELECTED){
            queryResult = [SELECT  Id, Contact__r.Name, Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c 
             FROM   Boat__c 
             WHERE  Id != :selectedBoat.get(0).Id 
             AND   (BoatType__c =: selectedBoat.get(0).BoatType__c)
             ORDER BY Length__c, Price__c, Year_Built__c];
        }
        return queryResult;
    }
}
    
