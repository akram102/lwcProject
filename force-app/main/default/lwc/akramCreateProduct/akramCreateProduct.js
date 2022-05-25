import { api, LightningElement } from 'lwc';

export default class AkramCreateProduct extends LightningElement {

    openModel
    
    createContact(event){
        const name = event.target.Name
        console.log(name)
    }

    handleCancel(){
        this.openModel = false;
        const passValue = new CustomEvent('clicked',{detail : {
            bool : this.openModel
        }})
        this.dispatchEvent(passValue);
    }
    handleSuccess(event) {
        console.log('onsuccess event recordEditForm',event.detail.id)
    }
    handleSubmit(event) {
        console.log('onsubmit event recordEditForm'+ event.detail.fields);
        
        this.openModel = false;
        const passValue = new CustomEvent('clicked',{detail : {
            bool : this.openModel
        }})
        this.dispatchEvent(passValue);
    }
}