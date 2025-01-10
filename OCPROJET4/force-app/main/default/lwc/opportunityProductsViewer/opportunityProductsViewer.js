import { LightningElement, api, wire, track  } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOpportunityLineItems from '@salesforce/apex/OpportunityLineItemController.getOpportunityLineItems';
import deleteOpportunityLineItem from '@salesforce/apex/OpportunityLineItemController.deleteOpportunityLineItem'; // Importer la méthode Apex pour supprimer
import { refreshApex } from '@salesforce/apex';


export default class OpportunityProductsViewer extends NavigationMixin(LightningElement) {
    @api recordId; // ajout de la variabe pour l'ID de l'opportunité actuelle



 
    @track opportunityLineItems; // variable définie dans le fichier HTML portant les data
    showAlert = false; // propriété pour gérer l'affichage de la fenetre

// variables columns pour la construction du datatable dans le HTML
    @track columns = [
        { label: 'Id', fieldName: 'Id' },
        { label: 'Name', fieldName: 'Name' },
        { label: 'Product2Id', fieldName: 'Product2Id' },
        { 
            label: 'Quantity', 
            fieldName: 'Quantity', 
            type: 'number', 
            cellAttributes: {
                style: { fieldName : 'quantityStyle'}
            }
        },
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


    wiredOLIResult; // Variable pour stocker le résultat de la méthode wired et permettre son raffraichissement

    @wire(getOpportunityLineItems, { opportunityId: '$recordId' })
    wiredOpportunityLineItems(result) {
        console.log('recordId:', this.recordId); // Vérifiez que recordId est défini
        console.log('wiredOpportunityLineItems result:', result); // Affichez le résultat
 
        this.wiredOLIResult = result;
        if (result.data) {
    //        this.opportunityLineItems = data;
            this.showAlert = false;
            console.log('passage dans wiredOPP');
            this.opportunityLineItems = result.data.map(item => {
                let quantityStyle = '';
                if (item.Quantity > item.Product2.QuantityInStock__c) {
                    quantityStyle = 'color: red; font-weight: bold;';
                    console.log('quantityStyle : ', quantityStyle);
                    this.showAlert = true;
                    console.log('showAlert : ', this.showAlert);
                }
                return {
                    ...item,
                    Product2Name: item.Product2.Name,
                    Product2QuantityInStock: item.Product2.QuantityInStock__c,
                    quantityStyle : quantityStyle
                };
            });
        } else if (result.error) {
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
        console.log('appel à la suppression de la ligne',row);
        // Appel de la méthode Apex pour supprimer l'enregistrement
        deleteOpportunityLineItem({ recordId: row.Id })
            .then(() => {
                // Rafraîchir les données après suppression
                return refreshApex(this.wiredOLIResult);
            })         
            .catch(error => {
                console.error('Error deleting record:', error);
            });
    }


    handleView(row) {
        console.log('Voir Produit: ', row);
        // Naviguer vers la page d'enregistrement du produit
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Product2Id,
                objectApiName: 'Product2', // Nom de l'objet API
                actionName: 'view'
            }   
            }
        );
    }

 



}