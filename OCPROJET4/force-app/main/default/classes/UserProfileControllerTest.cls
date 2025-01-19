@isTest
private class UserProfileControllerTest {
    // Méthode de test pour la méthode getCurrentUserProfile
    @isTest static void testGetCurrentUserProfile() {
        // Créer un utilisateur de test
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        String uniqueUsername = 'testUser' + DateTime.now().getTime() + '@domain.com';
        User testUser = new User(
            Username = uniqueUsername,
            LastName = 'Test',
            Email = uniqueUsername,
            Alias = 'tuser',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = p.Id,
            LanguageLocaleKey = 'en_US'
        );
        insert testUser;

        // Définir le contexte d'exécution de l'utilisateur
        System.runAs(testUser) {
            // Appeler la méthode getCurrentUserProfile
            String profileName = UserProfileController.getCurrentUserProfile();

            // Vérifier que le profil de l'utilisateur est correct
            System.assertEquals('Standard User', profileName, 'Le nom du profil devrait être Standard User');
        }
    }
}
