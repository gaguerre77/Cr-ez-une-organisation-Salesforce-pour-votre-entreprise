// a creer
import { LightningElement, wire, track } from 'lwc';
import getCurrentUserProfile from '@salesforce/apex/UserProfileController.getCurrentUserProfile';

export default class UserProfile extends LightningElement {
    @track userProfile;

    @wire(getCurrentUserProfile)
    wiredUserProfile({ error, data }) {
        if (data) {
            this.userProfile = data;
            console.log('User Profile:', this.userProfile); // ajout pour vérifier
        } else if (error) {
            console.error('Error retrieving user profile:', error);
        }
    }
}
