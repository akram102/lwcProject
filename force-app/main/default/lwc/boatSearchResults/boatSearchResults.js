import { api, LightningElement,track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { publish, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BOATMC  from '@salesforce/messageChannel/BoatMessageChannel__c';

import getBoats from '@salesforce/apex/BoatDataService.getBoats';


// ...
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [];
  boatTypeId = '';
  boats;
  @track
  isLoading = false;
  wiredResults
  error
  @track
  draftValues = [];
  
  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method 
    @wire(getBoats,{boatTypeId : '$boatTypeId'})
    wiredBoats(result) {
        this.wiredResults = result;
        if(result.data){
            this.boats = result.data;
            this.error = undefined;
        }
        else if(result.error){
            this.error = result.error;
            this.boats = undefined;
        }

    }
    
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
      this.isLoading = true;
      this.notifyLoading(this.isLoading)
      this.boatTypeId = boatTypeId;
   }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    await refreshApex(this.wiredResults)
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
   }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
      this.selectedBoatId = event.detail.boatId;
      this.sendMessageService(this.selectedBoatId);
   }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    const message = {
        recordId : boatId
    }
    publish(this.messageContext,BOATMC,message)
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((result) => {
        const toast = new ShowToastEvent({
            title : SUCCESS_TITLE,
            Message : MESSAGE_SHIP_IT,
            variant : SUCCESS_VARIANT
        })
        this.dispatchEvent(toast);
        this.draftValues = []
        return this.refresh();
    })
    .catch(error => {
        const toast = new ShowToastEvent({
            title : ERROR_TITLE,
            Message : error,
            variant : ERROR_VARIANT
        })
        this.dispatchEvent(toast);
    })
    .finally(() => {});
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
      if(isLoading){
          this.dispatchEvent(new CustomEvent('loading'))
      }else{
          this.dispatchEvent(new CustomEvent('doneloading'))
      }
   }
}
