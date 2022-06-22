import { LightningElement, wire } from 'lwc';
import getAirports from '@salesforce/apex/FlightController.getAirports';
import calculateDistance from '@salesforce/apex/FlightController.calculateDistance';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import FLIGHT_OBJECT from '@salesforce/schema/Flight__c';
const ERROR_TITLE = 'ERROR'
const ERROR_VARIANT = 'error';

export default class FlightRecordCreation extends NavigationMixin(LightningElement) {

    wiredAirportData
    distanceCalculated
    options
    selectedDepartureFlight
    departureFlight
    selectedArrivalFlight
    arrivalFlight
    departureLatitude
    departureLongitude
    arrivalLatitude
    arrivalLongitude
    newRecordCreated
    showForms = true;


    @wire(getAirports)
    wiredData({data,error}){
        if(data){
            this.wiredAirportData = data;
            this.options = data.map((airport)=>{
                return {
                    label: airport.IATA__c, value: airport.Id
                }
            })
        }
        else if(error){
            console.log('error---->',error);
        }
    }

    handleDepartureFlightChange(event){
        this.selectedDepartureFlight = event.detail.value;
        let deptLabel = this.options.find((key)=>{
            return key.value === event.detail.value
        });
        this.departureFlight = deptLabel.label;
        this.wiredAirportData.find((airport)=>{
            if(airport.Id === this.selectedDepartureFlight){
                this.departureLatitude = airport.Location__Latitude__s;
                this.departureLongitude = airport.Location__Longitude__s;
            }
        })
    }
    handleArrivaleFlightChange(event){
        this.selectedArrivalFlight = event.detail.value;
        let arrLabel = this.options.find((key)=>{
            return key.value === event.detail.value
        });
        this.arrivalFlight = arrLabel.label
        this.wiredAirportData.find((airport)=>{
            if(airport.Id === this.selectedArrivalFlight){
                this.arrivalLatitude = airport.Location__Latitude__s;
                this.arrivalLongitude = airport.Location__Longitude__s;
            }
        })
    }
    handleSuccess(event){
        this.newRecordCreated = event.detail.id;
        this.showForms = false;
    }
    async handleSubmit(event){
        await calculateDistance({latitude1 : this.departureLatitude, longitude1:this.departureLongitude, latitude2 : this.arrivalLatitude,longitude2 : this.arrivalLongitude})
        .then((result)=>{
            this.distanceCalculated = result;
        }).catch((error)=>{
            console.log('error in dis---->',error);
        })
        if(this.departureFlight === this.arrivalFlight){
            throw new Error("Departure and Arrival airports can't be same")
        }
        event.preventDefault();
        const fields = event.detail.fields;
        console.log('field--->',fields)
        fields.Distance__c = this.distanceCalculated;
        fields.Departure__c = this.departureFlight;
        fields.Arrival__c = this.arrivalFlight;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
        
    }
    handleError(event){
        if(this.departureFlight === this.arrivalFlight){
            const toast = new ShowToastEvent({
                title : ERROR_TITLE,
                message : event.detail.detail,
                variant : ERROR_VARIANT
            })
            this.dispatchEvent(toast);
        }   
    }   
}