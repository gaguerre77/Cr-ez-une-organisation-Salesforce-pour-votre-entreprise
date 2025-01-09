import { LightningElement, api } from 'lwc';

export default class QuantityCellRenderer extends LightningElement {
    @api value; // La valeur de la quantité
    @api row;  // Les données de la ligne complète

    get quantityClass() {
        // Vérifier si la quantité est inférieure à Product2QuantityInStock
        return this.value < this.row.Product2QuantityInStock ? 'red-bold' : '';
    }
}
