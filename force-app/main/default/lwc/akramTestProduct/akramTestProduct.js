import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getProduct from '@salesforce/apex/AkramOppProduct.getProduct';

import { publish, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/BoatMessageChannel__c';

const COLUMNS=[
    {label: 'Id', fieldName: 'Id'},
    {label: 'Name', fieldName: 'Name'},
    {label:'Price', fieldName:'Price__c'},
    {label: 'Description',fieldName: 'Description__c'},
    {type: "button", typeAttributes: {  
        label: 'View',  
        name: 'View',  
        title: 'View',  
        disabled: false,  
        value: 'view',  
        iconPosition: 'left',
        variant : 'brand' 
    }},
]

export default class AkramTestProduct extends LightningElement {
    @track
    columns = COLUMNS;  
    @api
    recordId;
    products;
    errors;
    openModel = false;
    wiredRecords
    loaded = false

    @wire(MessageContext)
    messageContext

    @wire(getProduct,{oppId : '$recordId'})
    wiredData(results){
        this.wiredRecords = results;
        if(results.data){
            this.products = results.data;
            console.log('pro',this.products)
            this.errors = undefined;
        }
        else if(results.error){
            this.errors = results.error;
            this.products = undefined;
        }
    }

    callRowAction(event){
        const payLoad = {recordId : event.detail.row.Id};
        console.log('row action',payLoad)
        publish(this.messageContext,recordSelected,payLoad)
    }

    createProduct(){
        this.openModel = true;
    }

    handleClicked(event){
        this.openModel = event.detail.bool;
        console.log(this.openModel)
        this.refresh();
        // return refreshApex(this.wiredRecords);
        
    }
    refresh(){
        this.loaded = true;
        refreshApex(this.wiredRecords);
        this.loaded =false
    }
}