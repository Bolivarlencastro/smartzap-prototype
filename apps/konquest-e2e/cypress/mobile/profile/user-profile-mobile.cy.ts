import ProfileElements from '../../support/elements/profile-elements';

describe('User Profile', () => {
  it('Should check all fields on user profile', () => {
    cy.Login('user');
    ProfileElements.userMenuButtonMobile().click();
    ProfileElements.buttonProfileMobile().click();

    ProfileElements.nameProfile();
    ProfileElements.nickName();
    ProfileElements.phone();
    ProfileElements.birthday();
    ProfileElements.email();
    ProfileElements.secondaryEmail();
    ProfileElements.country();
    ProfileElements.language();
    ProfileElements.address();
    ProfileElements.submitButton();
  });
});
