// imports
import { api, LightningElement, wire } from "lwc";
// import { getLocationService } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation'

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
    @api
  boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered;
  latitude;
  longitude;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation,{latitude : '$latitude',longitude : '$longitude', boatTypeId: '$boatTypeId'})
  wiredBoatsJSON({error, data}) { 
      console.log('entered herer',data)
      if(data){
          console.log('data---->',data)
          this.createMapMarkers(data);
      }
      else if(error){
          console.log('error is --->',error)
            const toast = new ShowToastEvent({
              title : ERROR_TITLE,
              message : error.body.message,
              variant : ERROR_VARIANT
          });
          this.dispatchEvent(toast);
      }
      this.isLoading = false;
  }
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() { 
      if(!this.isRendered){
          this.getLocationFromBrowser();
      }
      this.isRendered = true;
  }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() { 
    // const myLocationService = getLocationService();
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            console.log('latitude--->',latitude)
        },(error) =>{
            console.log('error here--->',error)
        })
    }
  }
  
  // Creates the map markers
  createMapMarkers(boatData) {
      console.log('boatData',boatData)
     // const newMarkers = boatData.map(boat => {...});
     const newMarkers = JSON.parse(boatData).map(boat=>{
         return {
             title : boat.Name,
             location : {
                 Latitude : boat.Geolocation__Latitude__s,
                 Longitude : boat.Geolocation__Longitude__s
             }
         }
     })
     // newMarkers.unshift({...});
     newMarkers.unshift({
         title : LABEL_YOU_ARE_HERE,
         icon : ICON_STANDARD_USER,
         location : {
             Latitude : this.latitude,
             Longitude : this.longitude
         }
     })
     this.mapMarkers = newMarkers
     console.log('mapMarker---->',this.mapMarkers)
   }
}
