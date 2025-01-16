import { LightningElement, api, wire, track  } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOpportunityLineItems from '@salesforce/apex/OpportunityLineItemController.getOpportunityLineItems';
import deleteOpportunityLineItem from '@salesforce/apex/OpportunityLineItemController.deleteOpportunityLineItem'; // Importer la méthode Apex pour supprimer
import getCurrentUserProfile from '@salesforce/apex/UserProfileController.getCurrentUserProfile';
import { refreshApex } from '@salesforce/apex';
//Importe Custom Labels
import ProductName from "@salesforce/label/c.OC4_Product_Name";
import Quantity from "@salesforce/label/c.OC4_Quantity";
import UnitPrice from "@salesforce/label/c.OC4_UnitPrice";
import TotalPrice from "@salesforce/label/c.OC4_TotalPrice";
import QuantityinStock from "@salesforce/label/c.OC4_QuantityinStock";
import Delete from "@salesforce/label/c.OC4_Delete";
import Seeproduct from "@salesforce/label/c.OC4_Seeproduct";



export default class OpportunityProductsViewer extends NavigationMixin(LightningElement) {
    @api recordId; // ajout de la variabe pour l'ID de l'opportunité actuelle
    @track opportunityLineItems; // variable définie dans le fichier HTML portant les data
    showAlert = false; // propriété pour gérer l'affichage de la fenetre
    wiredOLIResult; // Variable pour stocker le résultat de la méthode wired et permettre son raffraichissement
    @track userProfile; // Propriété pour stocker le profil utilisateur
    @track estVide = false; // propriété pour vérifier si les données sont vides
    // variables columns pour la construction du datatable dans le HTML 
    @track columns = [
        { label: ProductName, fieldName: 'Product2Name' },
        { 
            label: Quantity, 
            fieldName: 'Quantity', 
            type: 'number', 
            cellAttributes: {
                style: { fieldName : 'quantityStyle'},
                alignment : 'left'
            }
        },
        { label: UnitPrice, fieldName: 'UnitPrice', type: 'currency',cellAttributes: { alignment: 'left' } },
        { label: TotalPrice, fieldName: 'TotalPrice', type: 'currency',cellAttributes: { alignment: 'left' }  },  
        { label: QuantityinStock, fieldName: 'Product2QuantityInStock', type: 'number',cellAttributes: { alignment: 'left' }  },
        { label: Delete, type: 'button-icon', typeAttributes: 
            { 
            iconName: 'utility:delete', 
            name: 'delete', 
            title: 'Delete', 
            alternativeText: 'Delete', 
            variant: 'border-filled', 
            }
        }


    ];


       // Récupération du profil utilisateur
       @wire(getCurrentUserProfile)
       wiredUserProfile({ error, data }) {
           if (data) {
               this.userProfile = data;
               console.log('User Profile:', this.userProfile); // ajout pour vérifier
   
               // Ajouter la colonne "Voir Produit" conditionnellement au profil admin
               if (this.userProfile === 'System Administrator' || this.userProfile === 'Administrateur système') {
                   this.columns = [
                       ...this.columns,
                       { 
                           label: Seeproduct, 
                           type: 'button', 
                           typeAttributes: {
                               label: Seeproduct, 
                               name: 'view', 
                               iconName: 'utility:preview', 
                               variant: 'brand'
                           }
                       }
                   ];
               }
           } else if (error) {
               console.error('Error retrieving user profile:', error);
           }
       }
   

    @wire(getOpportunityLineItems, { opportunityId: '$recordId' })
    wiredOpportunityLineItems(result) {
        console.log('recordId:', this.recordId); // Vérifiez que recordId est défini
        console.log('wiredOpportunityLineItems result:', result); // Affichez le résultat
 
        this.wiredOLIResult = result;
        if (result.data) {
        this.estVide=(result.data.length ===0);
        if (!this.estVide) {
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
        }    
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