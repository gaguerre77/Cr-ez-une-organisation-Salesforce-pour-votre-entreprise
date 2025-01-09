import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOpportunityLineItems from '@salesforce/apex/OpportunityLineItemController.getOpportunityLineItems';





export default class OpportunityProductsViewer extends NavigationMixin(LightningElement) {
    @track opportunityLineItems;

    @track columns = [
        { label: 'Id', fieldName: 'Id' },
        { label: 'Name', fieldName: 'Name' },
        { label: 'Product2Id', fieldName: 'Product2Id' },
        { label: 'Quantity', fieldName: 'Quantity', type: 'number' },
        { label: 'Unit Price', fieldName: 'UnitPrice', type: 'currency' },
        { label: 'List Price', fieldName: 'ListPrice', type: 'currency' },
        { label: 'Total Price', fieldName: 'TotalPrice', type: 'currency' },
        { label: 'Product Name', fieldName: 'Product2Name' },
        { label: 'Quantity In Stock', fieldName: 'Product2QuantityInStock', type: 'number' },
        { label: 'Supprimer', type: 'button-icon', typeAttributes: 
            { 
            iconName: 'utility:delete', 
            name: 'delete', 
            title: 'Delete', 
            alternativeText: 'Delete', 
            variant: 'border-filled', 
            }
        },
        { label: 'Voir Produit', type: 'button', typeAttributes: 
            {
                label: 'Voir Produit', 
                name: 'view', 
                iconName: 'utility:preview', 
                variant: 'brand',
            }
        }


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

    handleRowAction(event) {
        console.log('Row action déclenché');
        const actionName = event.detail.action.name;
        console.log('action name', actionName);
        const row = event.detail.row;
        if (actionName === 'delete') {
            this.handleDelete(row);
        }
        if (actionName === 'view') {
            this.handleView(row);
        }
    }

    handleDelete(row) {
        // Implémentation ici de la logique de suppression
        console.log('suppression de la ligne: ', row);
        // Exemples de suppression : appeler une méthode Apex pour supprimer l'enregistrement, etc.
    }

    handleView(row) {
        console.log('Voir Produit: ', row);
        // Naviguer vers la page d'enregistrement du produit
        this[NavigationMixin.Navigate]({
            //type: 'standard__recordPage',
            //attributes: {
            //    recordId: row.Product2Id,
            //    objectApiName: 'Product2', // Nom de l'objet API
            //    actionName: 'view'
            type: 'standard__webPage',
            attributes: {
            url: 'http://www.google.com'
            }   
            }
        );
    }


}
