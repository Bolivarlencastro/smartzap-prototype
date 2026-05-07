import * as util from '../constants/utils';

export default class MissionElements {
  static MenuNavegation() {
    return cy.get('.flex > a');
  }
  static FieldNumberEnrolled() {
    return cy.get('mat-row');
  }

  static EnrollmentEmptyField() {
    return cy.get('[role="row"]');
  }

  static ButtonOpenCardMission(nameMission) {
    return MissionElements.Card(nameMission);
  }

  static enrollMissionButton() {
    return cy.get('[data-test="enroll-into-mission"]').should('be.visible');
  }

  static MissionNameListEnrollments() {
    return cy.get('[data-test="mission-name"]');
  }

  static ButtonDropdownMission() {
    return cy.get('[data-test="secondary-actions-dropdown"]').should('be.visible');
  }

  static ButtonBatchEnrollments() {
    return cy.get('[data-test="open-batch-enrollments"]').should('be.visible');
  }

  static fieldInputUserEnroll() {
    return cy.get('[id="filter-input"]').last().should('be.visible');
  }

  static fieldInputUserPresentialLiveEnrol() {
    return cy.get('input[id="filter-input"]').last().should('be.visible');
  }

  static OptionListCategoryMission() {
    return cy.get('#list-mission-step-info-category-panel', { timeout: 10000 });
  }

  static fieldInvisibleSelectUser() {
    return cy.get('mat-row').find('input');
  }

  static FieldTargetDate() {
    return cy.get('[formcontrolname="date"]');
  }

  static ButtonConfirmBatchEnrollments() {
    return cy.get('#mission-batch-enrollments-positive-button');
  }

  static ButtonDelete() {
    return cy.get('button').contains('Apagar');
  }

  static ButtonConfirm() {
    return cy.get('#button-confirm-ok').should('be.visible');
  }

  static ButtonFloatCreateMission() {
    return cy.get('app-create-learn-content-button > button');
  }

  static ButtonMissionSelect() {
    return cy.get('[role="menuitem"]');
  }

  static InputInfoNameMission() {
    return cy.get('#input-mission-step-info-name');
  }

  static inputInfoCategory() {
    return cy.get('[data-test="mission-info-category-selector"]').should('be.visible');
  }

  static selectorCategory(category) {
    return cy.get(`[data-test="mission-category-${category}"]`).should('be.visible');
  }

  static inputInfoCategoryArrowWrapper() {
    return cy.get('[ng-reflect-name="mission_category"] .mat-mdc-select-arrow-wrapper');
  }

  static OptionListTypeMission() {
    return cy.get('[role="listbox"]', { timeout: 5000 });
  }

  static OptionTextInLanguage() {
    return cy.get('[role="listbox" ] > mat-option');
  }

  static AllMissionsComponent() {
    return cy.get('kp-all-missions');
  }

  static InputInfoTypeCategory() {
    return cy.get('label mat-label').contains('Tipo');
  }

  static SelectInfoLanguage() {
    return cy.get('[data-test="language"]');
  }

  static InputInfoDescription() {
    return cy.get('#input-mission-step-info-description');
  }

  static ButtonInfoNext() {
    return cy.get('[data-test="mission-creation-button-next-step"]');
  }

  static Card(nameMission) {
    return cy.get('kp-learn-content-card').contains(`${nameMission}`);
  }

  static missionPageSelector() {
    return cy.get('[data-test="mission-page-selector"]').should('be.visible');
  }

  static IconNumberLessons(nameMission) {
    return MissionElements.Card(nameMission).find('[ng-reflect-message="Lições"] > span');
  }

  static ButtonEditMission() {
    return cy.get('[data-test="edit-mission"]').should('be.visible');
  }

  static InputTopicMission() {
    return cy.get('#input-mission-step-name');
  }

  static ButtonConfirmNewTopic() {
    return cy.get('#button-mission-step-new');
  }

  static ButtonNewContent() {
    return cy.get('#button-mission-step-new-content-button');
  }

  static ButtonInsertLink() {
    return cy.get('[ng-reflect-message="Copie e cole links de outras p"]');
  }

  static ButtonYoutube() {
    return cy.get('[aria-label="YouTube"]');
  }

  static FieldExternalLinkYT() {
    return cy.get('[data-test="input-external-link"]');
  }

  static FieldTitleLinkYT() {
    return cy.get('[data-test="field-content-yt"]');
  }

  static ButtonSaveContent() {
    return cy.get('[data-test="button-save"]');
  }

  static ButtonInfoContentNext() {
    return cy.get('#button-mission-step-next', { timeout: 10000 });
  }

  static ButtonInfoContentFinish() {
    return cy.get('#button-mission-step-finish');
  }

  static StatusCard() {
    return cy.get('kp-learn-content-card kp-card-tag');
  }

  static ButtonPublishMission() {
    return cy.get('kp-action-menu div button span').contains('Publicar').should('be.visible');
  }

  static ComponentNameCard() {
    return cy.get('kp-learn-content-card');
  }

  static newContentButton(type) {
    return cy.get(`button[aria-label="${type}"]`);
  }

  static contentFileType(type) {
    return cy.get(`button[aria-label="${type}"]`);
  }

  static dialogTypeContent() {
    return cy.get('kp-content-dialog-buttons button');
  }

  static inputThumbnailNewFileContent() {
    return cy.get('.card-cover');
    // return cy.get('kp-file-upload input').first();
  }

  static inputTextNewFileContent() {
    return cy.get('[data-test="inputTextNewFileContent"]');
  }

  static saveNewMissionButton() {
    return cy.get('[data-test="button-save"]');
  }

  static iconVideoContent() {
    return cy.get('.mat-badge > [ng-reflect-message="Vídeo"]');
  }

  static iconScormContent() {
    return cy.get('.mat-badge > [ng-reflect-message="Scorm"]');
  }

  static contentFileInTopic() {
    return cy.get('.cdk-drag > .cdk-drag-handle > .content-list-item-container > span');
  }

  static inputSearch() {
    return cy.get('[data-test="input-content-name"]');
  }

  static messageInfo() {
    return cy.get('mat-error');
  }

  static checkboxInactive() {
    return cy.get('[data-test="checkbox-mission-inactive"]').should('be.visible');
  }

  static buttonExternalPlatform() {
    return cy.get('[data-test="external-mission"]');
  }

  static iconExternalPlatform() {
    return cy.get('[data-test="provider-input"]').should('be.visible');
  }

  static buttonExternalPlataformLink() {
    return cy.get('[formcontrolname="external_course_url"]').should('be.visible');
  }

  static buttonSaveAndPublish() {
    return cy.get('[data-test="button-save-publish"]').should('be.visible');
  }

  static logoExternalPlatform() {
    return cy.get('.provider-logo');
  }

  static missionButtonDelete() {
    return cy.get('[data-test="delete-mission"]').should('be.visible');
  }

  static missionButtonFavorite() {
    return cy.get('kp-speed-dial mat-icon').last().should('be.visible');
  }

  static missionListOptionsHover() {
    return cy.get('kp-speed-dial mat-icon');
  }
  static missionButtonMyList() {
    return cy.get('button mat-icon').contains('bookmark').should('be.visible');
  }

  static missionFlagStatusType(typeMission) {
    return cy.get('.ng-star-inserted .text-xs .flex span').contains(typeMission).should('be.visible');
  }

  static buttonUploadScorm() {
    return cy.get('[data-test="upload-scorm"]');
  }

  static buttonImportScorm() {
    return cy.get('[data-test="scorm-upload_import_button"]').should('be.visible');
  }

  static buttonSaveScorm() {
    return cy.get('[data-test="test-save-scorm"]').should('be.visible');
  }

  static buttonSurveySatisfaction() {
    return cy.get('[formcontrolname="required_evaluation"] > .mdc-form-field > button');
  }

  static buttonAssessmentType() {
    return cy.get('[data-test="mission-assessment-type-selector"]').should('be.visible');
  }

  static selectorAssessmentType(type) {
    return cy.get(`[ng-reflect-value="${type}"]`).should('be.visible');
  }

  static statusCardInactive() {
    return cy.get('kp-card-tag[ng-reflect-type="development-inactive"]').should('be.visible');
  }

  static buttonMissionTemporary() {
    return cy.get('[ng-reflect-name="is_temporary"] > .mdc-form-field > button').should('be.visible');
  }

  static fieldGoalDate() {
    return cy.get('[formcontrolname="expiration_date"]').should('be.visible');
  }

  static BarScroll() {
    return cy.get(`#container-3 > .ps__rail-y`);
  }

  static buttonMissions() {
    return cy.get('[ng-reflect-router-link="/missions"] > div', { timeout: 500 }).should('be.visible');
  }

  static missionName() {
    return cy.get('[data-test="mission-name"]').should('be.visible');
  }

  static buttonDuplicateMission() {
    return cy.get('[data-test="duplicate-mission"]').should('be.visible');
  }

  static listboxDuplicateMission() {
    return cy.get('[data-test="transfer-destination-type-select"]').should('be.visible');
  }

  static optionSameWorkspace() {
    return cy.get('[data-test="same-workspace-option"]').should('be.visible');
  }

  static optionAnotherWorkspace() {
    return cy.get('[data-test="other-workspace-option"]').should('be.visible');
  }

  static fieldOwnerMissionDuplicated() {
    return cy.get('[data-test="transfer-dialog-search-input"]');
  }

  static listOptions() {
    return cy.get('[role="listbox"] mat-option');
  }

  static buttonOptionConfirm() {
    return cy.get('[type="button"]');
  }

  static detailContainerDuplicateMission() {
    return cy.get('.detail-container');
  }

  static kpMissionCard() {
    return cy.get('kp-learn-content-card');
  }

  static missionMenuOptionTransfer() {
    return cy.get('[data-test="transfer-mission"]').should('be.visible');
  }

  static transferTabDropdownButton() {
    return cy.get('[ng-reflect-placeholder="Selecione"]').should('be.visible');
  }

  static inputEmailToTransfer() {
    return cy.get('[data-test="transfer-dialog-search-input"]').should('exist');
  }

  static missionMenuOptionShare() {
    return cy.get('[data-test="share-mission"]').should('be.visible');
  }

  static selectShareMission() {
    return cy.get('[data-test="destination-workspace-select"]').should('be.visible');
  }

  static fieldWorkspaceToTransfer() {
    return cy.get('[data-test="destination-workspace-select"]');
  }

  static inputExpirationDate() {
    return cy.get('[data-test="input-mission-expiration-date"]').should('be.visible');
  }

  static closePopupMission() {
    return cy.get('[data-test="close-mission"]');
  }

  static missionTemporaryCheckBox() {
    return cy.get('[data-test="selector-mission-settigs-temporary"]').find('[role="switch"]');
  }

  static missionMinimalPerformanceCheckBox() {
    return cy.get('[data-test="selector-mission-minimal-performance"]').find('[role="switch"]');
  }

  static inputMinimalPerformance() {
    return cy.get('[data-test="input-mission-minimal-performance"]').should('be.visible');
  }

  static missionNotificationSelector() {
    return cy.get('[class="mat-mdc-snack-bar-label mdc-snackbar__label"]').should('be.visible');
  }

  static satisfactionSurveySelector() {
    return cy.get('[data-test="mission-satisfaction-survey-selector"]').find('[role="switch"]');
  }

  static buttonMissionUploadImage() {
    return cy.get('.kp-image-upload-button').should('be.visible');
  }

  static missionDetailsPopup() {
    return cy.get('app-mission-detail-dialog');
  }

  static livePresentialDetailsPopup() {
    return cy.get('app-presential-live-mission-detail-dialog');
  }

  static missionStatusPopup() {
    return cy.get('[data-test="mission-status-popup"]').should('be.visible');
  }

  static missionScormInputTime() {
    return cy.get('[formcontrolname="duration_time"]').should('be.visible');
  }

  static missionContetUploadIcon() {
    return cy.get('[data-test="mission-content-upload-icon"]');
  }

  static missionStepTitleSelector() {
    return cy.get('[data-test="step-title"]', { timeout: 10000 });
  }

  static missionMenuMissionCreatedByMe() {
    return cy.get(`[ng-reflect-label="${util.CREATED_BY_ME}"] button`).should('be.visible');
  }

  static inputLiveLink() {
    return cy.get('[data-test="input-mission-live-link"]').should('be.visible');
  }

  static inputPresentialAdress() {
    return cy.get('[data-test="input-mission-presential-adress"]').should('be.visible');
  }

  static inputVacancies() {
    return cy.get('[formcontrolname="seats"]').should('be.visible');
  }

  static inputDate() {
    return cy.get('[formcontrolname="date"]').should('be.visible');
  }

  static missionTypePopupSelector(type) {
    return cy.get(`[data-test="mission-type-${type}-pop-up-selector"]`).should('be.visible');
  }

  static livePresencialDataPopupSelector() {
    return cy.get('[data-test="mission-live-presential-pop-up-data-selector"]').should('be.visible');
  }

  static livePresencialVacanciesPopupSelector() {
    return cy.get('[data-test="mission-live-presential-pop-up-spots-selector"]').should('exist');
  }

  static enrollLiveMission() {
    return cy.get('[data-test="enroll-presential-live-mission"]').should('be.visible');
  }

  static missionGiveUp() {
    return cy.get('[data-test="give-up"]').should('be.visible');
  }

  static messageContainer() {
    return cy.get('#toast-container div [role="alert"]');
  }

  static missionPresentialLiveStatusEnrollment() {
    return cy.get('kp-status-chip div div .font-bold').should('be.visible');
  }

  static closePopupMissionLiveOrPresential() {
    return cy.get('app-mission-detail-dialog-container').find('[aria-label="Fechar"]').scrollIntoView();
  }

  static missionScormTime() {
    return cy.get('[data-test="time-duration"]');
  }

  static missionPresentialLiveBatchEnrollments() {
    return cy.get('[data-test="presential-live-batch-enrollments"]').should('be.visible');
  }

  static popUpResultsEnrollment() {
    return cy.get('app-batch-enrollments-resume');
  }

  static popUpMissionPresentialLive() {
    return cy.get('app-presential-live-mission-detail-dialog');
  }

  static popUpMission() {
    return cy.get('[data-test="mission-pop-up-resume-selector"]').should('be.exist');
  }

  static statusEnrolledPresentialLive() {
    return cy.get('[ng-reflect-status="ENROLLED"]');
  }

  static batchEnrollmentsPopup() {
    return cy.get('#mission-batch-enrollments-positive-button');
  }

  static closeListEnrollmentsPresentialLive() {
    return cy.get('app-mission-enrollments-dialog').contains('close').should('be.visible');
  }

  static finishPresentialLiveMission() {
    return cy.get('[data-test="finish-presential-live-mission"]').should('be.visible');
  }

  static inputInstructor() {
    return cy.get('[data-test="input-live-presential-instructor"]').should('be.visible');
  }

  static optionSelector() {
    return cy.get('[role="option"]').should('be.visible');
  }

  static addExternalInstructor() {
    MissionElements.inputInstructor().click();
    return cy.get('[data-test="live-presential-add-external-instructor"]').should('be.visible');
  }

  static listInstructors() {
    return cy.get('[data-test="live-presential-add-instructor"]').should('be.visible');
  }

  static inputExternalInstructorName() {
    return cy.get('[formcontrolname="name"]').should('be.visible');
  }

  static inputExternalInstructorEmail() {
    return cy.get('[formcontrolname="email"]').should('be.visible');
  }

  static buttonConfirmExternalInstructor() {
    return cy.get('new-instructor-dialog form button').last().should('be.visible');
  }

  static missionDetailsInstructors() {
    return cy.get('[data-test="mission-live-presential-details-instructors"]');
  }

  static missionRemoveInstructor() {
    return cy.get('[data-test="live-presential-remove-instructor"]').should('be.visible');
  }

  static livePresentialAddNewSchedule() {
    return cy.get('[data-test="live-presential-add-new-schedule"]').should('be.visible');
  }

  static livePresentialDateSelector() {
    return cy.get('[data-test="live-presential-date-selector"]').should('be.visible');
  }
  static emptyListEnrollmentsPresentialLive() {
    return cy.get('.empty-message > span');
  }

  static deleteEnrollmentPresentialLive() {
    return cy.get('[ng-reflect-message="Excluir"]').should('be.visible').first().click();
  }

  static batchEnrollInputSheet() {
    //here
    return cy.get('[class="flex gap-2 mr-2 items-center"] button').should('be.visible');
  }

  static fieldSearchListEnrollmentsPresentialLive() {
    return cy.get('[ng-reflect-placeholder="Pesquisar por nome ou e-mail"]').should('be.visible');
  }

  static rowsListOfEnrollmentsPresentialLive() {
    return cy.get('[role="row"]').should('be.visible');
  }

  static buttonCloseAttendanceList() {
    return cy.get('button span').contains('Encerrar').should('be.visible');
  }

  static livePresentialPopupUrlOrAdress() {
    return cy.get('[data-test="live-presential-pop-up-url-or-adress"]').should('be.visible');
  }

  static livePresentialPopupFlagToday() {
    return cy.get('[data-test="live-presential-pop-up-flag-is-today"]').should('exist');
  }

  static buttonOpenMissionOnClassroom() {
    return cy.get('[data-test="open-mission"]').should('be.visible');
  }

  static missionPopupResumeSelector() {
    return cy.get('[data-test="mission-pop-up-resume-selector"]').should('be.visible');
  }

  static providerFormExternalMission() {
    return cy.get('app-mission-provider-form');
  }

  static missionFilterCategoryName() {
    return cy.get('[data-test="mission-filter-categories-name"]');
  }

  static inputSearchMobile() {
    return cy.get('kp-list-filter div div kp-global-search-input div #filter-input').should('be.visible');
  }

  static missionEditPage() {
    return cy.get('app-mission-create');
  }

  static manageLiveAttendanceListButton() {
    return cy.get('[data-test="live-presential-attendance-list-button"]').scrollIntoView();
  }

  static confirmAttendanceButton() {
    return cy.get('[role="switch"]').first().scrollIntoView();
  }

  static liveAttendanceListSelector() {
    return cy.get('app-mission-attendances-overview').scrollIntoView();
  }

  static saveAttendanceListButton() {
    return cy.get('app-mission-attendances-dialog').find('button').last().should('be.visible');
  }

  static manageLiveEnrollButton() {
    return cy.get('[data-test="live-presential-enrollments-list-button"]').scrollIntoView();
  }

  static enrollSelectorOnLive() {
    return cy.get('[data-test="mission-live-presential-enroll"]').should('be.visible');
  }

  static saveLiveEnrollListButton() {
    return cy.get('app-mission-enrollments-dialog').find('button').last().should('be.visible');
  }

  static buttonOptionContentHtml() {
    return cy.get('[aria-label="Ferramentas de Autoria"]').should('be.visible');
  }

  static buttonOptionGenially() {
    return cy.get('[aria-label="Genially"]').should('be.visible');
  }

  static inputGeniallyField() {
    return cy.get('[data-cy="file-upload"]');
  }

  static inputGeniallyTime() {
    return cy.get('[data-test="input-genially-time"]');
  }

  static toggleGoalDate() {
    return cy.get('[ng-reflect-label="Data meta personalizada"] div mat-slide-toggle div button');
  }

  static inputCustomGoalDateField() {
    return cy.get('[formcontrolname="enrollment_goal_duration_days"]').should('be.visible');
  }

  static buttonContentQuiz() {
    return cy.get('[ng-reflect-message="Crie perguntas e respostas"]').should('be.visible');
  }

  static fieldQuestionTextQuiz(position: number) {
    return cy.get(`[data-test="kp-editor-${position}"]`);
  }

  static fieldAwnserTextQuiz(position: number) {
    return cy.get(`[data-test="input-option-${position}"]`).should('be.visible');
  }

  static buttonAddNewAwnserQuiz() {
    return cy.get('[data-test="add-new-option"]').should('be.visible');
  }

  static buttonNextOnCreateQuiz() {
    return cy.get('[aria-label="Próximo"]').should('be.visible');
  }

  static buttonCorrectAwnserQuiz(option: number) {
    return cy.get(`[data-test="select-option-${option}"]`).should('be.visible');
  }

  static buttonAddNewQuestion() {
    return cy.get('button').contains('Adicionar pergunta');
  }

  static ExpandNewQuestion() {
    return cy.get('mat-expansion-panel-header').contains('Pergunta 2');
  }

  static buttonSaveContentQuiz() {
    return cy.get('[aria-label="Salvar"]').should('be.visible');
  }

  static buttonEventsNavBar() {
    return cy.get('[data-test="nav-link-event"]').should('be.visible');
  }

  static checkboxBatchEnrollInMission() {
    return cy.get('[data-test="checkbox-modal-row"]').should('be.visible');
  }

  static buttonBatchEnrollUser() {
    return cy.get('#mission-batch-enrollments-positive-button').should('be.visible');
  }

  static buttonAllContents() {
    return cy.get('[data-test="button-all-contents"]').should('be.visible');
  }
}
