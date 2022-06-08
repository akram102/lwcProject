import { LightningElement, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AkramOppProduct.getAccountList';


const COLUMNS = [
    {label : 'AccountId', fieldName : 'AccountId'},
    {label : 'Amount', fieldName : 'total', type:'number'}
]

export default class TestAccountOpportunity extends LightningElement {

    accountList
    errors
    columns = COLUMNS;


    @wire(getAccountList)
    wireAccounts({data,error}){
        if(data){
            this.accountList = data;
            console.log('accountList',this.accountList)
            this.errors = undefined; 
        }else if(error){
            this.accountList = undefined;
            this.errors = error;
            console.log('errors',this.errors)
        }
    }

}