import * as util from '../../support/constants/utils';
import CourseElements from '../../support/elements/course-elements';
import { CourseFields, CourseOptions } from '../../support/interfaces';
let createdCouse: CourseOptions;
let courseToDelete;

beforeEach(() => {
  cy.Login('admin');
  cy.FixturesCourse().then((course) => {
    cy.APICourseCreate(course).then((response) => {
      createdCouse = response.body;
      courseToDelete = response.body.id;
      createdCouse.category = util.CATEGORY_DEV;
    });
  });
});

it('Should validate all fields on list inside details the course', () => {
  const fieldsToValidate: CourseFields = {
    name: createdCouse.name,
    category: util.CATEGORY_DEV,
    duration: '--:--',
    subscribers: '0',
    usersCompleted: '0',
    courseStatus: util.IN_CREATION_STATUS,
    description: createdCouse.description,
  };
  cy.CourseSearch(createdCouse.name);
  cy.CourseListFieldsValidate(fieldsToValidate);
  cy.CourseOpen();
  cy.CourseDetailFieldsValidate(fieldsToValidate);
});

afterEach(() => {
  if (courseToDelete) {
    cy.APICourseDelete(courseToDelete);
  }
});
