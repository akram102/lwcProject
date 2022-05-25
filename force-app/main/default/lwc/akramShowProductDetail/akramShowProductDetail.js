import { LightningElement, wire } from 'lwc';
import singleProduct from '@salesforce/apex/AkramOppProduct.singleProduct';


import {subscribe,unsubscribe,APPLICATION_SCOPE,MessageContext} from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/BoatMessageChannel__c';

export default class AkramShowProductDetail extends LightningElement{

    subscribtion = null;
    recordId
    product
    error


    @wire(MessageContext)
    messageContext

    @wire(singleProduct,{productId : '$recordId'})
    wiredProduct({data,error}){
        if(data){
            this.product = data;
            this.error = undefined;
        }
        else if(error){
            this.error = error;
            this.product = undefined
        }
    }

    subscribeToMessageChannel(){
        if(!this.subscribtion){
            this.subscribtion = subscribe(this.messageContext,recordSelected,(message)=>
                this.handleMesage(message),{scope : APPLICATION_SCOPE})
        }
    }

    handleMesage(message){
        this.recordId = message.recordId;
        console.log('rec',this.recordId)
    }


    unSubscribeToMessageChannel(){
        unsubscribe(this.subscribtion);
        this.subscribtion = null
    }

    connectedCallback(){
        console.log('connect listen')
        this.subscribeToMessageChannel();
    }
    disconnectedCallback(){
        this.unSubscribeToMessageChannel();
    }
}