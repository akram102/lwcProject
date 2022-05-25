import { api, LightningElement } from 'lwc';

export default class BoatTile extends LightningElement {
    @api
    boat;
    @api
    selectedBoatId;

    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { }

    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() { }

    // Fires event with the Id of the boat that has been selected.
    selectBoat() {
        this.selectedBoatId = this.boat.Id;
        const boatSelected = new CustomEvent('boatselected',{
            detail : {
                boatId : this.selectedBoatId
            }
        })
        this.dispatchEvent(boatSelected);
     }
}