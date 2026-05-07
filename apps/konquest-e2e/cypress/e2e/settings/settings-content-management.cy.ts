import { getRandomName } from '../../support/commands';
import ContentManagementElements from '../../support/elements/content-management-elements';
import * as util from '../../support/constants/utils';

let course;
let courseToDelete;

describe('Internal course', () => {
  beforeEach(() => {
    cy.FixturesMission()
      .then((fixtures) => ({
        ...fixtures,
        name: getRandomName(),
        mission_type: { id: util.OPEN_TYPE_ID },
      }))
      .then((missionDefault) => {
        cy.Login('admin');
        cy.APIMissionCreate(missionDefault).then((response) => {
          course = response.body;
          courseToDelete = response.body.id;
        });
      });
  });
  it('Should see the created mission on "Mission Created by me" list', () => {
    cy.ContentManagementAccess();
    ContentManagementElements.myMissionsSelector();
    cy.ContentManagementSearch(course.name);
    ContentManagementElements.itemNameSelector().should('contain.text', course.name);
  });

  afterEach(() => {
    if (courseToDelete) {
      cy.APICourseDelete(courseToDelete);
    }
  });
});
