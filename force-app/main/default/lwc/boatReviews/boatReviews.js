import { api, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


// imports
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
export default class BoatReviews extends NavigationMixin(LightningElement ){
    // Private
    boatId;
    error;
    boatReviews;
    isLoading;
    
    // Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { 
      return this.boatId;
    }
    set recordId(value) {
      //sets boatId attribute
      this.setAttribute('boatId',this.boatId);
      //sets boatId assignment
      this.boatId = value;
      //get reviews associated with boatId
      getReviews()
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
      return this.boatReviews !== undefined && this.boatReviews !== null && this.boatReviews.length > 0;
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api
    refresh() { }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() { 
      if(this.boatId){
        this.isLoading = true
      
        getAllReviews({boatId : this.boatId})
        .then((result)=>{
          this.boatReviews = result
          console.log('boat--c',this.boatReviews)
          this.error = undefined
        }).catch((error)=>{
          this.error = error
        }).finally(()=>[
          this.isLoading = false
        ])
      }else{
        return
      }
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  

    }
  }
  