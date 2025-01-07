import { LightningElement, wire, track } from 'lwc';
import getOpportunityLineItems from '@salesforce/apex/OpportunityLineItemController.getOpportunityLineItems';





export default class OpportunityProductsViewer extends LightningElement {
    @track opportunityLineItems;

    columns = [
        { label: 'Id', fieldName: 'Id' },
        { label: 'Name', fieldName: 'Name' },
        { label: 'Product2Id', fieldName: 'Product2Id' },
        { label: 'Quantity', fieldName: 'Quantity', type: 'number' },
        { label: 'Unit Price', fieldName: 'UnitPrice', type: 'currency' },
        { label: 'List Price', fieldName: 'ListPrice', type: 'currency' },
        { label: 'Total Price', fieldName: 'TotalPrice', type: 'currency' },
        { label: 'Product Name', fieldName: 'Product2Name' },
        { label: 'Quantity In Stock', fieldName: 'Product2QuantityInStock', type: 'number' }
    ];


    @wire(getOpportunityLineItems)
    wiredOpportunityLineItems({ error, data }) {
        if (data) {
    //        this.opportunityLineItems = data;
            this.opportunityLineItems = data.map(item => {
                return {
                    ...item,
                    Product2Name: item.Product2.Name,
                    Product2QuantityInStock: item.Product2.QuantityInStock__c
                };
            });
        } else if (error) {
            console.error('Error retrieving opportunity line items:', error);
        }
    }
}
