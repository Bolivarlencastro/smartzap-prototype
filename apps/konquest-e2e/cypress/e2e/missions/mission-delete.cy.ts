/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import ContentManagementElements from '../../support/elements/content-management-elements';
import GlobalSearchElements from '../../support/elements/global-search-elements';
import { InternalMissionOptions } from '../../support/interfaces';
let courseCreated: InternalMissionOptions;

describe('Tests for delete mission', () => {
  beforeEach(() => {
    cy.FixturesMission().then((missionDefault) => {
      missionDefault.name = getRandomName();
      cy.Login('admin');
      cy.APIMissionCreate(missionDefault).then((response) => {
        courseCreated = response.body;
      });
    });
  });
  it('Admin delete mission by API', () => {
    cy.APICourseDelete(courseCreated.id);
    cy.HomeAccess();
    cy.GlobalSearch(courseCreated.name);
    GlobalSearchElements.textContentNotFound();
  });
  it('Admin delete mission by GUI', () => {
    cy.ContentManagementAccess();
    cy.ContentManagementSearch(courseCreated.name);
    ContentManagementElements.buttonOpenCourseMenu().click();
    cy.ContentManagementDelete();
    cy.GlobalSearch(courseCreated.name);
    GlobalSearchElements.textContentNotFound();
  });
});
