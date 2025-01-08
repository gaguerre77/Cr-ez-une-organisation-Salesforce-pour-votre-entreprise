public with sharing class UserProfileController {
    @AuraEnabled(cacheable=true)
    public static String getCurrentUserProfile() {
        Id userId = UserInfo.getUserId();
        User user = [SELECT Profile.Name FROM User WHERE Id = :userId LIMIT 1];
        return user.Profile.Name;
    }
}
