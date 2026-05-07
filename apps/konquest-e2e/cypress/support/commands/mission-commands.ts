/// <reference types="cypress" />

import MissionElements from '../elements/mission-elements';
import EnrollsMissionsElements from '../elements/enrolls-missions-elements';
import * as StatusCode from '../constants/status-code';
import { getDateTodayBR } from '../../support/commands';
import {
  InternalMissionOptions,
  CypressResponse,
  MissionContentVideoOptions,
  MissionTypeContentOptions,
  ScormMissionCreate,
  MissionTopicOptions,
} from '../interfaces';
import { Interception } from 'cypress/types/net-stubbing';
import { getDateTomorrowBR } from '../commands';
import { LiveMissionCreate } from '../interfaces/live-mission-options';
import * as util from '../constants/utils';
import SharedCreationElements from '../elements/shared-creation-elements';
import GlobalSearchElements from '../elements/global-search-elements';
import ContentManagementElements from '../elements/content-management-elements';

Cypress.Commands.add('MissionEnrollmentsAccess', () => {
  cy.intercept('GET', '**/mission-enrollments/**').as('listEnrollments');
  EnrollsMissionsElements.buttonEnrollments();
  cy.wait('@listEnrollments');
});

Cypress.Commands.add('MissionOpenCard', (nameMission) => {
  return MissionElements.Card(nameMission).click();
});

Cypress.Commands.add('MissionStartEnroll', () => {
  cy.intercept('POST', 'mission-enrollments**').as('userEnrolled');

  cy.window().then((win) => {
    cy.stub(win, 'open').callsFake(() => {});
  });

  return MissionElements.enrollMissionButton()
    .click()
    .wait('@userEnrolled')
    .its('response.statusCode')
    .should('eq', StatusCode.Created);
});

Cypress.Commands.add('MissionSelectFirstOptionListCategoryMission', () => {
  return MissionElements.OptionListCategoryMission().first().click();
});

Cypress.Commands.add('MissionButtonFloatCreate', () => {
  return SharedCreationElements.sharedCreateButton().click();
});

Cypress.Commands.add('MissionNew', (typeMission) => {
  return MissionElements.ButtonMissionSelect().contains(typeMission).should('be.visible').click();
});

Cypress.Commands.add('MissionStepInputInfoNameMission', (nameMission) => {
  return MissionElements.InputInfoNameMission().should('be.visible').click().clear().type(`${nameMission}`);
});

Cypress.Commands.add('MissionStepInputInfoCategory', (name = 'automacao cy') => {
  MissionElements.inputInfoCategory().click();
  return MissionElements.selectorCategory(name).click();
});

Cypress.Commands.add('MissionStepOptionTextInCategory', () => {
  return MissionElements.OptionListCategoryMission().contains(util.DEFAULT_MISSION_CATEGORY).click();
});

Cypress.Commands.add('MissionStepOptionTextInType', (textType) => {
  return MissionElements.OptionListTypeMission().contains(`${textType}`).click({ force: true });
});

Cypress.Commands.add('MissionOptionTextInLanguage', (language) => {
  return MissionElements.OptionTextInLanguage().contains(`${language}`).click();
});

Cypress.Commands.add('MissionStatusComponent', (status) => {
  return MissionElements.AllMissionsComponent().contains(`${status}`).should('be.visible');
});

Cypress.Commands.add('MissionStepInputInfoType', () => {
  return MissionElements.InputInfoTypeCategory().click({ force: true });
});

Cypress.Commands.add('MissionStepSelectInfoLanguage', () => {
  return MissionElements.SelectInfoLanguage().click({ force: true });
});

Cypress.Commands.add('MissionStepInputInfoDescription', (description) => {
  return MissionElements.InputInfoDescription().click({ force: true }).type(`${description}`);
});

Cypress.Commands.add('MissionClickButtonInfoNext', () => {
  cy.intercept('**konquest/missions/**').as('Mission');
  MissionElements.ButtonInfoNext()
    .click({ force: true })
    .wait('@Mission')
    .then((request) => {
      const createdMission = request.response.body;
      expect(request.response.statusCode).equal(200);
      return createdMission;
    });
});

Cypress.Commands.add('MissionVerifyIconNumberLessons', (nameMission, countContents) => {
  return MissionElements.IconNumberLessons(nameMission).should('contain.text', countContents);
});

Cypress.Commands.add('MissionButtonEdit', () => {
  return MissionElements.ButtonEditMission().click();
});

Cypress.Commands.add('MissionAccessInputTopicMission', (topic) => {
  return MissionElements.InputTopicMission().type(`${topic}`);
});

Cypress.Commands.add('MissionClickButtonConfirmNewTopic', () => {
  return MissionElements.ButtonConfirmNewTopic().click();
});

Cypress.Commands.add('MissionClickFirstButtonNewContent', () => {
  return MissionElements.ButtonNewContent().last().click({ force: true });
});

Cypress.Commands.add('MissionClickButtonInsertLink', () => {
  return MissionElements.ButtonInsertLink().click();
});

Cypress.Commands.add('MissionClickButtonYoutube', () => {
  return MissionElements.ButtonYoutube().click();
});

Cypress.Commands.add('MissionAccessFieldExternalLinkYT', (link) => {
  return MissionElements.FieldExternalLinkYT().type(`${link}`, { force: true });
});

Cypress.Commands.add('MissionAccessFieldTitleLinkYT', (link) => {
  return MissionElements.FieldTitleLinkYT().type(`${link}`, { force: true });
});

Cypress.Commands.add('MissionButtonSaveContent', () => {
  cy.intercept('**/learn-content').as('saveContent');
  MissionElements.ButtonSaveContent().click();
  return cy.wait('@saveContent');
});

Cypress.Commands.add('MissionClickButtonInfoContentNext', () => {
  MissionElements.ButtonInfoContentNext().click({ force: true });
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  return cy.wait(2000);
});

Cypress.Commands.add('MissionClickButtonInfoContentFinish', () => {
  cy.intercept('**publish').as('missionPublish');
  cy.APINotificationsDeleteAll(); //não é typescript ainda
  return MissionElements.ButtonInfoContentFinish()
    .click({ force: true })
    .wait('@missionPublish')
    .its('response.statusCode')
    .should('eq', 200);
});

Cypress.Commands.add('MissionStatusCard', (message) => {
  // cy.intercept('missions?search**').as('oneMissionStatusSearch').wait('@oneMissionStatusSearch');
  return MissionElements.StatusCard().contains(`${message}`).should('have.text', ` ${message} `);
});

Cypress.Commands.add('MissionPopupPublish', () => {
  cy.intercept('**/missions/**').as('mission');
  MissionElements.ButtonPublishMission().click();
  return cy.wait('@mission').its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add('MissionOptionDropdownList', (buttonMenu) => {
  if (buttonMenu == ' Matrículas em Lote ') {
    return cy.MissionBatchEnrrolments();
  }
});

Cypress.Commands.add('MissionFieldInputUserEnrol', (user) => {
  return MissionElements.fieldInputUserEnroll().type(`${user}`).wait(3000);
});

Cypress.Commands.add('MissionFieldInvisibleSelectUser', () => {
  return MissionElements.fieldInvisibleSelectUser().click();
});

Cypress.Commands.add('MissionConfirmBatchEnrollments', () => {
  cy.intercept('**/mission-enrollments/batch**').as('batchEnroll');
  return MissionElements.ButtonConfirmBatchEnrollments()
    .click()
    .wait('@batchEnroll')
    .its('response.statusCode')
    .should('eq', 200);
});

Cypress.Commands.add('MissionContentType', () => {
  return MissionElements.newContentButton('Arquivo').click();
});

Cypress.Commands.add('MissionSelectType', (options) => {
  expect(options).to.not.empty;
  let type;
  if (options.contentType) {
    cy.MissionContentType();

    if (options.video) type = 'Vídeo';

    if (options.image) type = 'Imagem';

    if (options.poadcast) type = 'Podcast';

    if (options.PDF) type = 'PDF';

    if (options.doc) type = 'Word';

    if (options.ppt) type = 'PowerPoint';

    if (options.sheet) type = 'Excel';
  }

  return MissionElements.contentFileType(type).click();
});

Cypress.Commands.add('MissionSelectFileVideo', (file) => {
  return MissionElements.dialogTypeContent()
    .contains('Vídeo')
    .click({ force: true })
    .then(() => {
      cy.get('[data-cy="file-upload"]').selectFile(file, { force: true });
    });
});

Cypress.Commands.add('MissionSelectThumbnailNewFileContent', (file) => {
  cy.intercept('**learn-contents/cover-images-by-size').as('cover-images');
  return MissionElements.inputThumbnailNewFileContent()
    .selectFile(file, { force: true })
    .wait('@cover-images')
    .its('response.statusCode')
    .should('eq', 200);
});

Cypress.Commands.add('MissionTypeNameNewFileContent', (name) => {
  return MissionElements.inputTextNewFileContent().type('{selectall}{backspace}').type(`${name}`);
});

Cypress.Commands.add('MissionFillContentVideo', (options) => {
  expect(options).not.to.empty;
  if (options.file) cy.MissionSelectFileVideo(options.file);
  // if (options.thumbnail) cy.MissionSelectThumbnailNewFileContent(options.thumbnail); //todo: mission error thumbnail
  if (options.name) cy.MissionTypeNameNewFileContent(options.name);
});

Cypress.Commands.add('MissionSaveUploadContent', (options = { checkResponse: true, getErrorResponse: false }) => {
  if (options.checkResponse) cy.intercept('POST', '**/learn-content*').as('missionSave');
  if (options.getErrorResponse) cy.intercept('learn-content').as('missionError');

  MissionElements.saveNewMissionButton().click();

  if (options.checkResponse) {
    cy.wait('@missionSave', { timeout: 30000 }).then((request) => {
      expect(request.response.statusCode).equal(201);
      cy.log('Mission Created');
      const createdMission = request.response.body;
      return cy.wrap(createdMission);
    });
  } else if (options.getErrorResponse) {
    cy.wait('@missionError').then((request) => {
      return cy.wrap(request.response);
    });
  }
});

Cypress.Commands.add('MissionIconContent', (type) => {
  if (type == 'Vídeo') {
    return MissionElements.iconVideoContent().should('be.visible');
  }

  if (type == 'Scorm') {
    return MissionElements.iconScormContent().should('be.visible');
  }
});

Cypress.Commands.add('MissionContentFileInTopic', (fileTopic) => {
  return MissionElements.contentFileInTopic().should('contain.text', fileTopic);
});

Cypress.Commands.add('RecursiveVerificationNotify', (maxTry = 60, numberTry = 0, wk = util.WORKSPACE_DEFAULT) => {
  cy.visit(`/${wk}/missions/`);
  cy.intercept('**/my-recommendations**').as('loadRecommendations');
  cy.intercept('GET', `${Cypress.env('url_api')}/notifications?ordering=-updated_date&read=false`).as('notifications');
  cy.wait('@loadRecommendations');
  cy.wait('@notifications', { timeout: 60000 }).then((interception) => {
    const bodyIntercept = interception.response.body;

    const action = bodyIntercept.results[0]?.notification_type.action;
    const objectType = bodyIntercept.results[0]?.notification_type.object_type;
    const statusCode = interception.response.statusCode;
    const count = bodyIntercept.count;
    numberTry++;

    if (statusCode == 200 && action == 'REVIEW' && objectType == 'MISSION' && count >= 1) {
      return;
    } else if (numberTry > maxTry) {
      return 'Erro, numero maximo de tentativas';
    } else {
      cy.RecursiveVerificationNotify(maxTry, numberTry, wk);
    }
  });
});

Cypress.Commands.add('MissionButtonConfirmDelete', () => {
  cy.intercept('DELETE', '**/konquest/missions/**').as('waitDelete');
  MissionElements.ButtonConfirm().click();
  cy.wait('@waitDelete').should((request) => {
    expect(request.response.statusCode).eq(204);
  });
});

Cypress.Commands.add('MissionSearch', (nameMission) => {
  cy.intercept('**/search/v1/courses?**').as('missionSearch');
  return MissionElements.inputSearch()
    .clear()
    .type(nameMission, { delay: 1000, force: true })
    .wait('@missionSearch')
    .its('response.statusCode')
    .should('eq', StatusCode.OK);
});

Cypress.Commands.add('MissionSearchNotFound', (missionName) => {
  cy.intercept('**/search/v1/courses?**').as('missionSearch');
  MissionElements.inputSearch().clear().type(missionName, { delay: 500, force: true }).type('{enter}');
  return cy.wait('@missionSearch', { timeout: 3000 });
});

Cypress.Commands.add('SearchInMissionCreatedByMe', (nameMission) => {
  cy.MissionCreatedByMe();
  cy.intercept('**/search/v1/courses?page**').as('missionSearch');
  return MissionElements.inputSearch()
    .clear()
    .type(nameMission, { delay: 500, force: true })
    .type('{enter}')
    .wait('@missionSearch', { timeout: 3000 })
    .its('response.statusCode')
    .should('eq', 200);
});

Cypress.Commands.add('MissionStepInfo', (mission) => {
  cy.intercept('**konquest/missions').as('missionCreate');
  cy.intercept('**/konquest/missions/types').as('loadMissionTypes');
  cy.MissionButtonFloatCreate({ timeout: 100000 });
  cy.MissionNew(util.MISSION_CLASS);
  cy.wait('@loadMissionTypes');
  cy.MissionStepInputInfoNameMission(mission.name);
  cy.MissionStepInputInfoCategory();
  cy.MissionStepInputInfoType();
  cy.MissionStepOptionTextInType(mission.mission_type.name);
  cy.MissionStepSelectInfoLanguage();
  cy.MissionOptionTextInLanguage(mission.language);
  cy.MissionAssessmentSelectType(mission.assessment_type);
  cy.MissionStepInputInfoDescription(mission.description);
  MissionElements.ButtonInfoNext()
    .scrollIntoView()
    .click()
    .wait('@missionCreate')
    .then((response) => {
      expect(response.response.statusCode).equal(201);
      cy.wrap(response.response.body);
    });
});

Cypress.Commands.add('MissionStepImage', () => {
  MissionElements.buttonMissionUploadImage().click();
});

Cypress.Commands.add('MissionStepSettings', (option) => {
  switch (option) {
    case 'satisfaction_survey':
      return MissionElements.satisfactionSurveySelector().click();

    case 'mission_temporary':
      MissionElements.missionTemporaryCheckBox().click();
      return MissionElements.inputExpirationDate().type(getDateTodayBR());

    case 'Inactive':
      return MissionElements.checkboxInactive().find('button').click();
  }
});

Cypress.Commands.add('MissionStepFinish', () => {
  cy.GetMetaDataSelectorAndClick('publish-mission-button');
});

Cypress.Commands.add('MissionStepAccess', (step) => {
  MissionElements.missionStepTitleSelector().contains(step).should('be.visible').click();
});

Cypress.Commands.add('MissionStepLive', (vacancies) => {
  MissionElements.inputLiveLink().type(util.ONLINE_EVENT_URL_MOCK);
  MissionElements.inputVacancies().clear().type(vacancies);
  MissionElements.inputDate().clear().type(getDateTomorrowBR());
  return MissionElements.ButtonInfoNext().click();
});

Cypress.Commands.add('MissionStepPresential', (mission) => {
  MissionElements.inputPresentialAdress().type(mission.presential_address);
  MissionElements.inputVacancies().clear().type(mission.vacancies);
  MissionElements.inputDate().clear().type(getDateTomorrowBR());
  return MissionElements.ButtonInfoNext().click();
});

Cypress.Commands.add('MissionAssessmentSelectType', (type) => {
  MissionElements.buttonAssessmentType().click({ force: true });
  return MissionElements.selectorAssessmentType(type).click();
});

Cypress.Commands.add('MissionSatisfactionSurvey', (satisfactionSurvey) => {
  if (satisfactionSurvey == true) {
    return;
  } else if (satisfactionSurvey == false) {
    return MissionElements.buttonSurveySatisfaction().should('be.visible').click({ force: true });
  }
});

Cypress.Commands.add('MissionDelete', (mission) => {
  cy.MissionCreatedByMe();
  cy.MissionSearch(mission.name);
  cy.MissionOpenCard(mission.name);
  MissionElements.ButtonDropdownMission().click();
  MissionElements.missionButtonDelete().click();
  cy.MissionButtonConfirmDelete();
});

Cypress.Commands.add('MissionMessageError', (errorInvalidField) => {
  return MissionElements.messageInfo().should('contain.text', errorInvalidField);
});

Cypress.Commands.add('MissionMsgNoCreated', () => {
  return MissionElements.missionPageSelector().contains(util.MISSION_MESSAGE_NO_CREATED);
});

Cypress.Commands.add('MissionVerifyCard', (message) => {
  return MissionElements.Card(message);
});

Cypress.Commands.add('MissionStepPlatform', () => {
  return MissionElements.buttonExternalPlatform().should('be.visible');
});

Cypress.Commands.add('MissionStepIconPlatform', () => {
  MissionElements.iconExternalPlatform().click();
  MissionElements.OptionListTypeMission().should('be.visible');
  return MissionElements.optionSelector().first().click();
});

Cypress.Commands.add('MissionStepExternalLink', (mission) => {
  return MissionElements.buttonExternalPlataformLink().type(mission);
});

Cypress.Commands.add('MissionSaveAndPublish', () => {
  cy.intercept('POST', '**/missions/external*').as('externalMissionPublish');
  MissionElements.buttonSaveAndPublish()
    .click()
    .wait('@externalMissionPublish')
    .then((response) => {
      const missionExternalCreated = response;
      return cy.wrap(missionExternalCreated);
    });
});

Cypress.Commands.add('MissionExternalLogo', () => {
  return MissionElements.logoExternalPlatform().should('be.visible');
});

Cypress.Commands.add('MissionExternalStepInfo', (mission) => {
  cy.intercept('**/missions/external').as('missionCreate');
  cy.intercept('**/konquest/missions/types').as('loadMissionTypes');
  cy.MissionButtonFloatCreate({ timeout: 100000 });
  cy.MissionNew(util.EXTERNAL_CLASS);
  cy.wait('@loadMissionTypes');
  cy.MissionStepInputInfoNameMission(mission.name);
  cy.MissionStepInputInfoCategory();
  cy.MissionStepInputInfoType();
  cy.MissionStepOptionTextInType(mission.mission_type.name);
  cy.MissionStepSelectInfoLanguage();
  cy.MissionOptionTextInLanguage(mission.language);
  cy.MissionStepInputInfoDescription(mission.description);
  MissionElements.ButtonInfoNext()
    .scrollIntoView()
    .click()
    .wait('@missionCreate')
    .then((response) => {
      expect(response.response.statusCode).equal(201);
      cy.wrap(response.response.body);
    });
});

Cypress.Commands.add('MissionLivePresentialStepInfo', (mission) => {
  cy.intercept('POST', '**/missions/**').as('missionCreate');
  cy.intercept('**/konquest/missions/types').as('loadMissionTypes');
  cy.MissionButtonFloatCreate({ timeout: 100000 });
  if (mission.mission_model == util.PRESENTIAL_EVENT) {
    cy.MissionNew(util.PRESENTIAL_EVENT);
  } else {
    cy.MissionNew(util.ONLINE_EVENT);
  }
  cy.wait('@loadMissionTypes');
  cy.MissionStepInputInfoNameMission(mission.name);
  cy.MissionStepInputInfoCategory();
  cy.MissionStepInputInfoType();
  cy.MissionStepOptionTextInType(mission.mission_type.name);
  cy.MissionStepSelectInfoLanguage();
  cy.MissionOptionTextInLanguage(mission.language);
  cy.MissionStepInputInfoDescription(mission.description);
  MissionElements.ButtonInfoNext()
    .scrollIntoView()
    .click()
    .wait('@missionCreate')
    .then((response) => {
      expect(response.response.statusCode).equal(StatusCode.Created);
      cy.wrap(response.response.body);
    });
});

Cypress.Commands.add('MissionBatchEnrrolments', () => {
  return MissionElements.ButtonBatchEnrollments().click();
});

Cypress.Commands.add('MissionFavorite', () => {
  cy.intercept('**/missions/bookmarks').as('favoriteMission');
  MissionElements.missionListOptionsHover().click();
  MissionElements.missionButtonFavorite().click({ force: true });
  return cy.wait('@favoriteMission');
});

Cypress.Commands.add('MissionMyList', () => {
  cy.intercept('**/search/v1/courses**').as('listFavoriteMissions');
  MissionElements.missionButtonMyList().click();
  return cy.wait('@listFavoriteMissions');
});

Cypress.Commands.add('MissionStatusType', (typeMission) => {
  return MissionElements.missionFlagStatusType(typeMission);
});

Cypress.Commands.add('MissionClosedVerified', (mission) => {
  cy.HomeAccess(util.COURSES);
  cy.MissionCreatedByMe();
  cy.SearchInMissionCreatedByMe(mission.name);
  cy.MissionOpenCard(mission.name);
  return cy.MissionStatusType(mission.statusType);
});

Cypress.Commands.add('MissionNotFound', (missionName) => {
  cy.MissionSearch(missionName);
  return cy.MissionMsgNoCreated();
});

Cypress.Commands.add('MissionUploadScorm', (fileScorm) => {
  return MissionElements.buttonUploadScorm().selectFile(fileScorm, { force: true });
});

Cypress.Commands.add('MissionImportScorm', () => {
  cy.intercept('POST', '**/learn-content/scorm').as('importScorm');
  cy.intercept('**/missions/types').as('loadTypes');
  MissionElements.buttonImportScorm().click();
  cy.wait('@importScorm').its('response.statusCode').should('eq', 201);
  return cy.wait('@loadTypes');
});

Cypress.Commands.add('MissionScormScroll', (destination) => {
  if (destination == 'type') {
    cy.log('scroll until element type');
    return MissionElements.InputInfoTypeCategory().scrollIntoView({ easing: 'linear', duration: 2000 });
  }
});

Cypress.Commands.add('MissionScormSaveAndPublish', () => {
  cy.intercept('POST', '**/missions/scorm').as('saveScorm');
  MissionElements.buttonSaveScorm().click();
  cy.wait('@saveScorm').then((request) => {
    const createdMission = request.response.body;
    cy.log(createdMission.name, createdMission.id);
    expect(request.response.statusCode).equal(201);
    cy.log('Mission scorm created');
    return cy.wrap(createdMission);
  });
});

Cypress.Commands.add('MissionVerifyContent', (nameMission, content) => {
  return cy.MissionSearch(nameMission).MissionOpenCard(nameMission).MissionIconContent(content);
});

Cypress.Commands.add('MissionScormCreate', (fileScorm, mission) => {
  cy.intercept('**/missions/scorm').as('missionScormCreate');
  cy.MissionButtonFloatCreate({ timeout: 100000 });
  cy.MissionNew(util.SCORM_CLASS);
  cy.MissionScormTime(mission.duration_time);
  cy.MissionUploadScorm(fileScorm);
  cy.MissionImportScorm();
  cy.MissionStepInputInfoNameMission(mission.name);
  cy.MissionStepInputInfoCategory();
  cy.MissionStepInputInfoType();
  cy.MissionStepOptionTextInType(mission.mission_type.name);
  cy.MissionStepSelectInfoLanguage();
  cy.MissionOptionTextInLanguage(mission.language);
  cy.MissionAssessmentSelectType(mission.assessment_type);
  cy.MissionStepInputInfoDescription(mission.description);
  MissionElements.ButtonInfoNext()
    .scrollIntoView()
    .click()
    .wait('@missionScormCreate')
    .then((response) => {
      const payload: InternalMissionOptions = {
        missionUUID: response.response.body.id,
        development_status: 'DONE',
      };
      expect(response.response.statusCode).equal(StatusCode.Created);
      cy.APIMissionUpdate(payload);
      cy.wrap(response.response.body);
    });
});

Cypress.Commands.add(
  'MissionCreateMultipleWithContent',
  (quantity, specificContent, recursive = { time: 0, listMissionsCreated: [] }) => {
    cy.FixturesMissionStageContent()
      .then((response) => {
        return cy.UpdateFixtToRandom(response);
      })
      .then((fixtures) => {
        cy.APIMissionCreateWithContentFile(fixtures, specificContent);
      })
      .then((mission) => {
        recursive.listMissionsCreated.push(mission);
        recursive.time++;
      });
    if (recursive.time < quantity - 1) {
      cy.MissionCreateMultipleWithContent(quantity, specificContent, recursive);
    } else {
      return cy.wrap(recursive.listMissionsCreated);
    }
  },
);

Cypress.Commands.add('MissionTemporary', (temporary) => {
  if (temporary == true) {
    return cy.MissionStepFieldTemporary().MissionTemporaryGoalDate();
  } else {
    return null;
  }
});

Cypress.Commands.add('MissionStepFieldTemporary', () => {
  return MissionElements.buttonMissionTemporary().click();
});

Cypress.Commands.add('MissionTemporaryGoalDate', () => {
  const todayDate = new Date().getUTCDate().toString();
  return MissionElements.fieldGoalDate().type(todayDate);
});

Cypress.Commands.add('MissionEdit', (missionUUID, wk = util.WORKSPACE_DEFAULT) => {
  cy.intercept(`**/missions/create/${missionUUID}/info`).as('loadMission');
  cy.intercept(`**/missions/${missionUUID}/contributors`).as('contributors');
  return cy.visit(`/${wk}/missions/create/${missionUUID}/info`).wait('@loadMission').wait('@contributors');
});

Cypress.Commands.add('MissionScrollDown', () => {
  return MissionElements.BarScroll().click('bottom', { force: true });
});

Cypress.Commands.add('MissionFieldsVerify', () => {
  MissionElements.fieldGoalDate();
});

Cypress.Commands.add('MissionScormTime', (timeScorm) => {
  return MissionElements.missionScormTime().type(timeScorm);
});

Cypress.Commands.add('MissionBathEnroll', (missionDefault, enrollmentType) => {
  cy.MissionWaitLoad();
  cy.MissionCreatedByMe();
  cy.MissionSearch(missionDefault.name);
  MissionElements.Card(missionDefault.name);
  cy.MissionOpenCard(missionDefault.name);
  MissionElements.ButtonDropdownMission().click();
  cy.MissionOptionDropdownList(util.BATCH_ENROLLMENTS);
  cy.MissionFieldInputUserEnrol(Cypress.env('user_cy'));
  cy.MissionFieldInvisibleSelectUser();
  cy.BatchEnrollmentSetting(enrollmentType);
  cy.MissionConfirmBatchEnrollments();
  return cy.PressEsc();
});

Cypress.Commands.add('MissionFlagStatus', (status) => {
  return MissionElements.missionStatusPopup().contains(status);
});

Cypress.Commands.add('MissionInactivatedVerified', (missionName) => {
  cy.ContentManagementAccess();
  cy.ContentManagementSearch(missionName);
  return cy.MissionCardInactive();
});

Cypress.Commands.add('MissionCardInactive', () => {
  return ContentManagementElements.flagSelector();
});

Cypress.Commands.add('MissionEnroll', (missionName) => {
  cy.HomeAccess();
  cy.GlobalSearchAccess();
  cy.GlobalSearch(missionName);
  GlobalSearchElements.buttonOpenItem(missionName).click({ force: true });
  cy.MissionStartEnroll();
});

Cypress.Commands.add('MissionLiveOrPresencialEnroll', () => {
  cy.intercept('**/mission-enrollments/sync').as('enrollMission');
  MissionElements.enrollLiveMission().click();
  return cy.wait('@enrollMission');
});

Cypress.Commands.add('MissionScormEvaluation', (missionDefault) => {
  if (missionDefault.required_evaluation == false) {
    return MissionElements.buttonSurveySatisfaction().click({ force: true });
  }
});

Cypress.Commands.add('MissionTopic', (topic) => {
  cy.MissionAccessInputTopicMission(util.MISSION_TOPIC);
  cy.MissionClickButtonConfirmNewTopic();
  cy.MissionClickFirstButtonNewContent();
  cy.MissionClickButtonInsertLink();
  cy.MissionClickButtonYoutube();
  cy.MissionAccessFieldExternalLinkYT(topic.link);
  cy.MissionAccessFieldTitleLinkYT(topic.title);
  cy.MissionButtonSaveContent();
  return MissionElements.missionContetUploadIcon().should('be.visible');
});

Cypress.Commands.add('MissionDuplicateSameWorkspace', (owner, missionName) => {
  cy.intercept('GET', '**/workspaces**').as('loadWorkspaces');
  cy.intercept('**/duplicate').as('duplicate');
  ContentManagementElements.itemDuplicateCourse().click();
  cy.wait('@loadWorkspaces');
  MissionElements.listboxDuplicateMission().click();
  MissionElements.optionSameWorkspace().click();
  MissionElements.fieldOwnerMissionDuplicated().focus();
  MissionElements.fieldOwnerMissionDuplicated().type(owner);
  MissionElements.listOptions().first().should('be.visible').click();
  MissionElements.buttonOptionConfirm().contains('Duplicar').should('be.visible').click();
  MissionElements.detailContainerDuplicateMission().should('contain.text', missionName);
  MissionElements.buttonOptionConfirm().contains('Confirmar').should('be.visible').click();
  return cy.wait('@duplicate').should((request) => expect(request.response.statusCode).equal(StatusCode.NoContent));
});

Cypress.Commands.add('MissionDuplicateAnotherWorkspace', (owner, missionName, workspace) => {
  cy.intercept('GET', '**/workspaces**').as('loadWorkspaces');
  cy.intercept('**/duplicate').as('duplicate');
  ContentManagementElements.itemDuplicateCourse().click();
  cy.wait('@loadWorkspaces');
  MissionElements.listboxDuplicateMission().click();
  MissionElements.optionAnotherWorkspace().click();
  cy.MissionSelectWorkspaceToTransfer(workspace);
  MissionElements.fieldOwnerMissionDuplicated().scrollIntoView();
  MissionElements.fieldOwnerMissionDuplicated().type(owner);
  MissionElements.listOptions().first().should('be.visible').click();
  MissionElements.buttonOptionConfirm().contains('Duplicar').should('be.visible').click();
  MissionElements.detailContainerDuplicateMission().should('contain.text', missionName);
  MissionElements.buttonOptionConfirm().contains('Confirmar').should('be.visible').click();
  return cy.wait('@duplicate').should((request) => expect(request.response.statusCode).equal(StatusCode.NoContent));
});

Cypress.Commands.add('MissionMenuSelectOptionTransfer', () => {
  MissionElements.ButtonDropdownMission().click();
  return MissionElements.missionMenuOptionTransfer().click();
});

Cypress.Commands.add('MissionSelectOptionToTransfer', (transferOption) => {
  MissionElements.transferTabDropdownButton().click();
  return MissionElements.optionSelector().contains(transferOption).click();
});

Cypress.Commands.add('MissionConfirmTransfer', () => {
  cy.GetMetaDataSelectorAndClick('transfer-dialog-confirm-button');
  return cy.GetMetaDataSelectorAndClick('transfer-dialog-confirm-button');
});

Cypress.Commands.add('MissionSelectWorkspaceToTransfer', (workspace) => {
  MissionElements.fieldWorkspaceToTransfer().scrollIntoView();
  MissionElements.fieldWorkspaceToTransfer().should('be.visible').click();
  return MissionElements.listOptions().contains(workspace).click();
});

Cypress.Commands.add('MissionMenuSelectOptionShare', (workspace) => {
  cy.intercept('**/users/**/workspaces?roles**').as('loadRoles');
  MissionElements.ButtonDropdownMission().click();
  MissionElements.missionMenuOptionShare().click();
  cy.wait('@loadRoles');
  MissionElements.selectShareMission().click();
  return MissionElements.listOptions().contains(workspace).should('be.visible').click();
});

Cypress.Commands.add('MissionClosePopup', () => {
  return MissionElements.closePopupMission().should('be.visible').click();
});

Cypress.Commands.add('MissionVerifyPopup', (missionName) => {
  return MissionElements.missionDetailsPopup().should('be.visible').contains(missionName);
});

Cypress.Commands.add('MissionLivePresentialPopupVerify', (missionName) => {
  return MissionElements.livePresentialDetailsPopup().should('be.visible').contains(missionName);
});

Cypress.Commands.add('MissionPublish', () => {
  cy.MissionStepAccess('Finalizar');
  return cy.MissionStepFinish();
});

Cypress.Commands.add('MissionStepProviders', (mission) => {
  cy.MissionStepIconPlatform();
  cy.MissionStepExternalLink(mission.external.course_url);
  cy.MissionScormInputTime(mission.external.duration_time);
  return MissionElements.ButtonInfoNext().click();
});

Cypress.Commands.add('MissionScormInputTime', (missionTime) => {
  return MissionElements.missionScormInputTime().type(missionTime);
});

Cypress.Commands.add('MissionPresentialLiveBatchEnroll', () => {
  cy.intercept('**search=**').as('batchEnrollSearchUser');
  MissionElements.ButtonDropdownMission().click();
  MissionElements.missionPresentialLiveBatchEnrollments().click();
  cy.wait('@batchEnrollSearchUser');
  MissionElements.fieldInputUserPresentialLiveEnrol().type(Cypress.env('user_cy'));
  cy.wait('@batchEnrollSearchUser');
  MissionElements.checkboxBatchEnrollInMission().last().click();
  MissionElements.buttonBatchEnrollUser().click();
});

Cypress.Commands.add('MissionPresentialLiveBatchEnrollWithSheet', (missionDefault, sheet) => {
  cy.intercept('**/parser').as('batchEnrollUploadSheet');
  cy.MissionWaitLoad();
  cy.MissionEventsAccess();
  cy.MissionCreatedByMe();
  cy.MissionSearch(missionDefault.name);
  MissionElements.Card(missionDefault.name);
  cy.MissionOpenCard(missionDefault.name);
  MissionElements.ButtonDropdownMission().click();
  MissionElements.missionPresentialLiveBatchEnrollments().click();
  MissionElements.batchEnrollInputSheet().click();
  cy.get('input[type="file"]').selectFile(sheet, { force: true });
  cy.wait('@batchEnrollUploadSheet').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.OK);
  });
  return MissionElements.batchEnrollmentsPopup().contains('Matricular').should('be.visible').click();
});

Cypress.Commands.add('MissionPresentialLiveFinish', () => {
  cy.intercept('**/presential/**/complete').as('finishMission');
  MissionElements.ButtonDropdownMission().click();
  MissionElements.finishPresentialLiveMission().click();
  return cy.wait('@finishMission').should((response) => {
    expect(response.response.statusCode).equal(StatusCode.NoContent);
  });
});

Cypress.Commands.add('MissionTypeVerifyPopup', (type) => {
  const formattedType = type[0].toUpperCase() + type.substring(1);
  return MissionElements.missionTypePopupSelector(type).contains(formattedType);
});

Cypress.Commands.add('MissionEventDataVerify', (data) => {
  return MissionElements.livePresencialDataPopupSelector().contains(data);
});

Cypress.Commands.add('MissionVacanciesVerify', (vacancies) => {
  return MissionElements.livePresencialVacanciesPopupSelector().scrollIntoView().contains(vacancies);
});

Cypress.Commands.add('MissionAddInternalInstructor', (instructor) => {
  cy.intercept('**/instructors?search=**').as('instructorSearch');
  cy.intercept('POST', '**/instructor').as('addInstructor');
  MissionElements.inputInstructor().type(instructor);
  cy.wait('@instructorSearch');
  MissionElements.optionSelector().first().click();
  return cy.wait('@addInstructor').then((response) => {
    expect(response.response.statusCode).eq(StatusCode.NoContent);
  });
});

Cypress.Commands.add('MissionAddExternalInstructor', (instructor) => {
  cy.intercept('POST', '**/instructor').as('addInstructor');
  MissionElements.addExternalInstructor().click();
  MissionElements.inputExternalInstructorName().type(instructor.name);
  MissionElements.inputExternalInstructorEmail().type(instructor.email);
  MissionElements.buttonConfirmExternalInstructor().click();
  return cy.wait('@addInstructor').then((response) => {
    expect(response.response.statusCode).eq(StatusCode.NoContent);
  });
});

Cypress.Commands.add('MissionRemoveFirstInstructor', () => {
  cy.intercept('DELETE', '**/instructor/**').as('removeInstructor');
  MissionElements.missionRemoveInstructor().first().click();
  return cy.wait('@removeInstructor').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.NoContent);
  });
});

Cypress.Commands.add('MissionDetailAccessDirectly', (missionID) => {
  cy.intercept(`**/${util.WORKSPACE_DEFAULT}/C/${missionID}`).as('loadDetailMission');
  cy.visit(`/${util.WORKSPACE_DEFAULT}/C/${missionID}`);
  return cy.wait('@loadDetailMission').then(() => {
    MissionElements.popUpMission();
  });
});

Cypress.Commands.add('MissionLiveAccessDirectly', (missionID) => {
  cy.intercept(`**/${util.WORKSPACE_DEFAULT}/E/${missionID}`).as('loadDetailMission');
  cy.visit(`/${util.WORKSPACE_DEFAULT}/E/${missionID}`);
  return cy.wait('@loadDetailMission').then(() => {
    MissionElements.popUpMission();
  });
});

Cypress.Commands.add('MissionPresentialLiveEnrollmentSearch', (user) => {
  cy.intercept('**/mission-enrollments/**search**').as('searchUser');
  MissionElements.fieldSearchListEnrollmentsPresentialLive().type(user);
  cy.wait('@searchUser');
  MissionElements.rowsListOfEnrollmentsPresentialLive().and('have.length', 2);
});

Cypress.Commands.add('MissionLiveCreateWithDate', (payload: LiveMissionCreate) => {
  return cy.APIMissionLiveCreate(payload).then((response: any) => {
    const createdMission: LiveMissionCreate = response.body;
    payload.id = createdMission.id;
    payload.live.id = createdMission.id;
    return cy
      .APIMissionLiveCreateDate(payload.live)
      .then(() => {
        cy.APIMissionLiveUpdate(payload);
      })
      .then(() => {
        cy.APIMissionPublish(createdMission.id);
      })
      .then(() => {
        cy.wrap(createdMission);
      });
  });
});

Cypress.Commands.add('MissionCreatedByMe', () => {
  MissionElements.missionMenuMissionCreatedByMe().click();
});

Cypress.Commands.add('MissionPresentialCreateWithDate', (payload: LiveMissionCreate) => {
  payload.mission_model = 'PRESENTIAL';
  payload.language = 'pt-BR';

  delete payload.development_status;
  delete payload.required_evaluation;

  return cy.APIMissionPresentialCreate(payload).then((response: CypressResponse) => {
    const createdMission: LiveMissionCreate = response.body;
    payload.id = createdMission.id;
    payload.presential.id = createdMission.id;

    return cy
      .APIMissionPresentialCreateDate(payload.presential)
      .then(() => {
        cy.APIMissionPresentialUpdate(payload);
      })
      .then(() => {
        cy.APIMissionPublish(createdMission.id);
      })
      .then(() => {
        cy.wrap(createdMission);
      });
  });
});

Cypress.Commands.add('MissionSearchMobile', (nameMission) => {
  cy.intercept('**/search/v1/courses?**').as('missionSearch');
  MissionElements.inputSearchMobile().clear().type(nameMission, { delay: 500 });
  return cy.wait('@missionSearch', { timeout: 3000 }).its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add('MissionEnrollMobile', () => {
  cy.intercept('POST', 'mission-enrollments**').as('userEnrolled');
  cy.GetMetaDataSelectorAndClick('button-start-mission-mobile');
  return cy.wait('@userEnrolled').its('response.statusCode').should('eq', StatusCode.Created);
});

Cypress.Commands.add('MissionLiveVerifyAbleToEdit', (missionID) => {
  cy.MissionLiveAccessDirectly(missionID);
  MissionElements.ButtonEditMission().click();
  return MissionElements.missionEditPage().should('be.visible');
});

Cypress.Commands.add('MissionLiveManageAttendancesList', (option) => {
  cy.intercept('**/check').as('manageAttendance');
  if (option === true) {
    MissionElements.manageLiveAttendanceListButton().should('be.visible').click();
    MissionElements.confirmAttendanceButton().should('be.visible').click();
    cy.wait('@manageAttendance');
    MissionElements.liveAttendanceListSelector().should('be.visible').contains('1 matrícula confirmada');
    return MissionElements.saveAttendanceListButton().click();
  }
});

Cypress.Commands.add('MissionLiveManageEnrollList', (option) => {
  cy.intercept('**/approval').as('manageEnrollAPI');
  if (option === false) {
    MissionElements.manageLiveEnrollButton().should('be.visible').click();
    cy.GetMetaDataSelectorAndClick('mission-live-presential-cancel-enroll-button');
    cy.wait('@manageEnrollAPI');
    MissionElements.enrollSelectorOnLive().contains('Recusado');
    return MissionElements.saveLiveEnrollListButton().click();
  }
});

Cypress.Commands.add('MissionContentEditAccessDirectly', (missionID) => {
  cy.intercept('**/stages').as('loadContentMission');
  cy.visit(`/${util.WORKSPACE_DEFAULT}/missions/create/${missionID}/content`);
  cy.wait('@loadContentMission');
});

Cypress.Commands.add('MissionFillContentQuiz', (fixtureQuiz) => {
  MissionElements.fieldQuestionTextQuiz(fixtureQuiz.question.position)
    .should('be.visible')
    .type(fixtureQuiz.question.text);
  MissionElements.fieldAwnserTextQuiz(fixtureQuiz.option1.position).type(fixtureQuiz.option1.text);
  MissionElements.buttonCorrectAwnserQuiz(0).click();
  MissionElements.buttonAddNewAwnserQuiz().click();
  MissionElements.fieldAwnserTextQuiz(fixtureQuiz.option2.position).type(fixtureQuiz.option2.text);
  MissionElements.buttonAddNewAwnserQuiz().click();
  MissionElements.fieldAwnserTextQuiz(fixtureQuiz.option3.position).type(fixtureQuiz.option3.text);
});

Cypress.Commands.add('MissionSaveQuiz', () => {
  cy.intercept('POST', '**/konquest/exams/**').as('createExamQuiz');
  cy.intercept('POST', '**/missions/stages/contents').as('createContentQuiz');
  cy.intercept('POST', '**/exams/**/questions').as('createQuestion');
  MissionElements.buttonSaveContentQuiz().click();
  cy.wait('@createExamQuiz').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.Created);
  });
  cy.wait('@createContentQuiz').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.Created);
  });
  cy.wait('@createQuestion').should((response) => {
    expect(response.response.statusCode).eq(StatusCode.Created);
  });
});

Cypress.Commands.add('MissionEventsAccess', () => {
  cy.intercept('**/search/v1/courses?**').as('loadLiveEnrollments');
  MissionElements.buttonEventsNavBar().click();
  cy.wait('@loadLiveEnrollments');
});

Cypress.Commands.add('MissionUpdateCategory', (id, categoryName) => {
  cy.MissionEdit(id);
  cy.MissionStepInputInfoCategory(categoryName);
  return cy.MissionClickButtonInfoNext();
});
declare global {
  namespace Cypress {
    interface Chainable {
      MissionEnrollmentsAccess(): Chainable<JQuery<HTMLElement>>;
      MissionOpenCard(nameMission: string): Chainable<JQuery<HTMLElement>>;
      MissionStartEnroll(): Chainable<JQuery<HTMLElement>>;
      MissionSelectFirstOptionListCategoryMission(): Chainable<JQuery<HTMLElement>>;
      MissionButtonFloatCreate(options?: { timeout: number }): Chainable<JQuery<HTMLElement>>;
      MissionNew(typeMission: string): any;
      MissionStepInputInfoNameMission(nameMission?: string): Chainable<JQuery<HTMLElement>>;
      MissionStepInputInfoCategory(name?: string): Chainable<JQuery<HTMLElement>>;
      MissionStepOptionTextInCategory(): Chainable<JQuery<HTMLElement>>;
      MissionStepOptionTextInType(textCategory: string): Chainable<JQuery<HTMLElement>>;
      MissionOptionTextInLanguage(language: string): Chainable<JQuery<HTMLElement>>;
      MissionStatusComponent(status: string): Chainable<JQuery<HTMLElement>>;
      MissionStepInputInfoType(): Chainable<JQuery<HTMLElement>>;
      MissionStepSelectInfoLanguage(): Chainable<JQuery<HTMLElement>>;
      MissionStepInputInfoDescription(description: string): Chainable<JQuery<HTMLElement>>;
      MissionClickButtonInfoNext(): Chainable<JQuery<HTMLElement>>;
      MissionVerifyIconNumberLessons(nameMission: string, countContents: number): Chainable<JQuery<HTMLElement>>;
      MissionButtonEdit(): Chainable<JQuery<HTMLElement>>;
      MissionAccessInputTopicMission(topic: string): Chainable<JQuery<HTMLElement>>;
      MissionClickButtonConfirmNewTopic(): Chainable<JQuery<HTMLElement>>;
      MissionClickFirstButtonNewContent(): Chainable<JQuery<HTMLElement>>;
      MissionClickButtonInsertLink(): Chainable<JQuery<HTMLElement>>;
      MissionClickButtonYoutube(): Chainable<JQuery<HTMLElement>>;
      MissionAccessFieldExternalLinkYT(link: string): Chainable<JQuery<HTMLElement>>;
      MissionAccessFieldTitleLinkYT(link: string): Chainable<JQuery<HTMLElement>>;
      MissionButtonSaveContent(): Chainable<Interception>;
      MissionClickButtonInfoContentNext(): Chainable<Interception>;
      MissionClickButtonInfoContentFinish(): Chainable<JQuery<HTMLElement>>;
      MissionStatusCard(message: string): Chainable<JQuery<HTMLElement>>;
      MissionPopupPublish(): Chainable<Interception>;
      MissionOptionDropdownList(buttonMenu: string): Chainable<JQuery<HTMLElement>>;
      MissionFieldInputUserEnrol(user: string): Chainable<JQuery<HTMLElement>>;
      MissionFieldInvisibleSelectUser(): Chainable<JQuery<HTMLElement>>;
      MissionConfirmBatchEnrollments(): Chainable<JQuery<HTMLElement>>;
      MissionContentType(): Chainable<JQuery<HTMLElement>>;
      MissionSelectType(options: MissionTypeContentOptions): Chainable<JQuery<HTMLElement>>;
      MissionSelectFileVideo(file: string): Chainable<JQuery<HTMLElement>>;
      MissionSelectThumbnailNewFileContent(file: string): Chainable<JQuery<HTMLElement>>;
      MissionTypeNameNewFileContent(name: string): Chainable<JQuery<HTMLElement>>;
      MissionFillContentVideo(options: MissionContentVideoOptions): Chainable<JQuery<HTMLElement>>;
      MissionSaveUploadContent(options?: any): Chainable<JQuery<HTMLElement>>;
      MissionIconContent(type: string): Chainable<JQuery<HTMLElement>>;
      MissionContentFileInTopic(fileTopic: string): Chainable<JQuery<HTMLElement>>;
      RecursiveVerificationNotify(maxTry: number, numberTry?: number, wk?: string);
      MissionButtonConfirmDelete(): Chainable<Interception>;
      MissionSearch(nameMission: string): Chainable<JQuery<HTMLElement>>;
      MissionSatisfactionSurvey(satisfactionSurvey: boolean): Chainable<JQuery<HTMLElement>>;
      MissionDelete(mission: InternalMissionOptions): Chainable<JQuery<HTMLElement>>;
      MissionMessageError(errorInvalidField: string): Chainable<JQuery<HTMLElement>>;
      MissionMsgNoCreated(): Chainable<JQuery<HTMLElement>>;
      MissionVerifyCard(message: string): Chainable<JQuery<HTMLElement>>;
      MissionStepPlatform(): Chainable<JQuery<HTMLElement>>;
      MissionStepIconPlatform(): Chainable<JQuery<HTMLElement>>;
      MissionStepExternalLink(mission: string): Chainable<JQuery<HTMLElement>>;
      MissionSaveAndPublish(): Chainable<JQuery<HTMLElement>>;
      MissionExternalLogo(): Chainable<JQuery<HTMLElement>>;
      MissionExternalStepInfo(mission: InternalMissionOptions): Chainable<Interception>;
      MissionLivePresentialStepInfo(mission: LiveMissionCreate): Chainable<Interception>;
      MissionBatchEnrrolments(): Chainable<JQuery<HTMLElement>>;
      MissionFavorite(): Chainable<Interception>;
      MissionMyList(): Chainable<Interception>;
      MissionFavoriteAndVerify(nameMission: string): Chainable<JQuery<HTMLElement>>;
      MissionStatusType(typeMission: string): Chainable<JQuery<HTMLElement>>;
      MissionClosedVerified(mission): Chainable<JQuery<HTMLElement>>;
      MissionNotFound(nameMission: string): Chainable<JQuery<HTMLElement>>;
      MissionUploadScorm(fileScorm: FileReference): Chainable<JQuery<HTMLElement>>;
      MissionImportScorm(): Chainable<Interception>;
      MissionScormScroll(destination: string): Chainable<JQuery<HTMLElement>>;
      MissionScormSaveAndPublish(): Chainable<JQuery<HTMLElement>>;
      MissionVerifyContent(nameMission: string, content: string): Chainable<JQuery<HTMLElement>>;
      MissionScormCreate(file: FileReference, mission: ScormMissionCreate): Chainable<Interception>;
      MissionCreateMultipleWithContent(quantity: any, specificContent, recursive?: any): any;
      MissionTemporary(mission: boolean): Chainable<JQuery<HTMLElement>>;
      MissionStepFieldTemporary(): Chainable<JQuery<HTMLElement>>;
      MissionTemporaryGoalDate(): Chainable<JQuery<HTMLElement>>;
      MissionEdit(missionUUID: string, wk?: string): Chainable<Interception>;
      MissionScrollDown(): Chainable<JQuery<HTMLElement>>;
      MissionFieldsVerify(): Chainable<JQuery<HTMLElement>>;
      MissionScormTime(timeScorm: string): Chainable<JQuery<HTMLElement>>;
      MissionBathEnroll(mission, enrollmentType: string): Chainable<JQuery<HTMLElement>>;
      MissionFlagStatus(status: string): Chainable<JQuery<HTMLElement>>;
      MissionInactivatedVerified(missionName: string): Chainable<JQuery<HTMLElement>>;
      MissionCardInactive(): Chainable<JQuery<HTMLElement>>;
      MissionEnroll(missionName: string): Chainable<JQuery<HTMLElement>>;
      MissionScormEvaluation(missionDefault: InternalMissionOptions): Chainable<JQuery<HTMLElement>>;
      MissionTopic(topic: MissionTopicOptions): Chainable<JQuery<HTMLElement>>;
      MissionDuplicateSameWorkspace(owner: string, missionName: string): Chainable<Interception>;
      MissionMenuSelectOptionTransfer(): Chainable<JQuery<HTMLElement>>;
      MissionSelectOptionToTransfer(transferOption: string): Chainable<JQuery<HTMLElement>>;
      MissionConfirmTransfer(): Chainable<JQuery<HTMLElement>>;
      MissionMenuSelectOptionShare(workspace: string): Chainable<JQuery<HTMLElement>>;
      MissionSelectWorkspaceToTransfer(workspace: string): Chainable<JQuery<HTMLElement>>;
      MissionDuplicateAnotherWorkspace(owner: string, missionName: string, workspace: string): Chainable<Interception>;
      SearchInMissionCreatedByMe(nameMission: string): Chainable<JQuery<HTMLElement>>;
      MissionClosePopup(): Chainable<JQuery<HTMLElement>>;
      MissionStepInfo(mission: InternalMissionOptions): any;
      MissionStepImage(): Chainable<JQuery<HTMLElement>>;
      MissionStepSettings(option: string): any;
      MissionStepContent(): Chainable<JQuery<HTMLElement>>;
      MissionStepFinish(): Chainable<JQuery<HTMLElement>>;
      MissionAssessmentSelectType(type: string): Chainable<JQuery<HTMLElement>>;
      MissionStepAccess(step: string): Chainable<JQuery<HTMLElement>>;
      MissionVerifyPopup(missionName: string): Chainable<JQuery<HTMLElement>>;
      MissionLivePresentialPopupVerify(missionName: string): Chainable<JQuery<HTMLElement>>;
      MissionTypeVerifyPopup(type: string): Chainable<JQuery<HTMLElement>>;
      MissionEventDataVerify(data: string): Chainable<JQuery<HTMLElement>>;
      MissionVacanciesVerify(vacancies: number): any;
      MissionPublish(): Chainable<JQuery<HTMLElement>>;
      MissionStepProviders(mission: InternalMissionOptions): Chainable<JQuery<HTMLElement>>;
      MissionStepLive(vacancies): Chainable<JQuery<HTMLElement>>;
      MissionStepPresential(mission: { presential_address: string; vacancies }): Chainable<JQuery<HTMLElement>>;
      MissionScormInputTime(missionTime: string): Chainable<JQuery<HTMLElement>>;
      MissionLiveOrPresencialEnroll(): Chainable<Interception>;
      MissionPresentialLiveBatchEnroll(): Chainable<JQuery<HTMLElement>>;
      MissionPresentialLiveBatchEnrollWithSheet(missionDefault, sheet): Chainable<JQuery<HTMLElement>>;
      MissionPresentialLiveFinish(): Chainable<Interception>;
      MissionAddInternalInstructor(instructor: string): Chainable<Interception>;
      MissionAddExternalInstructor(instructor: { name: string; email: string }): Chainable<Interception>;
      MissionRemoveFirstInstructor(): Chainable<Interception>;
      MissionDetailAccessDirectly(missionID: string): Chainable<Interception>;
      MissionLiveAccessDirectly(missionID: string): Chainable<Interception>;
      MissionPresentialLiveEnrollmentSearch(user: string): Chainable<Interception>;
      MissionLiveCreateWithDate(payload: LiveMissionCreate): Chainable<LiveMissionCreate>;
      MissionCreatedByMe(): Chainable<LiveMissionCreate>;
      MissionPresentialCreateWithDate(payload: LiveMissionCreate): Chainable<LiveMissionCreate>;
      MissionSearchMobile(nameMission: string): Chainable<JQuery<HTMLElement>>;
      MissionEnrollMobile(): Chainable<JQuery<HTMLElement>>;
      MissionSearchNotFound(missionName): Chainable<Interception>;
      MissionLiveVerifyAbleToEdit(missionID: string): Chainable<JQuery<HTMLElement>>;
      MissionLiveManageAttendancesList(option: boolean): Chainable<JQuery<HTMLElement>>;
      MissionLiveManageEnrollList(option: boolean): Chainable<JQuery<HTMLElement>>;
      MissionContentEditAccessDirectly(missionID: string): Chainable<JQuery<HTMLElement>>;
      MissionFillContentQuiz(fixtureQuiz): Chainable<JQuery<HTMLElement>>;
      MissionSaveQuiz(): Chainable<JQuery<HTMLElement>>;
      MissionEventsAccess(): Chainable<JQuery<HTMLElement>>;
      MissionUpdateCategory(id: string, categoryName: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
