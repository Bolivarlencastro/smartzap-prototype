/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import * as util from '../../support/constants/utils';
import { SectionOptions } from '../../support/interfaces/sections-options';

let data: SectionOptions;
let mission;
let trail;
let missionToDelete;
let trailToDelete;

describe('Custom Sections Tests', () => {
  beforeEach(() => {
    cy.Login('admin');
    cy.APISectionDeleteAll();
    cy.HomeAccess();
  });

  describe('Course Sections', () => {
    beforeEach(() => {
      cy.FixturesMission()
        .then((fixture) => cy.APIMissionCreate({ ...fixture, name: getRandomName() }))
        .then((response) => {
          mission = response.body;
          missionToDelete = response.body.id;
        });

      cy.SettingsSectionsTabAccess(util.SectionMap.TAB_COURSES);

      data = {
        option: util.SectionMap.COURSE,
        name: `Section ${getRandomName()}`,
        description: util.SectionMap.DESCRIPTION,
      };
    });

    it('should create a custom course section with a course', () => {
      cy.SettingsSectionsCreate({ ...data });
      cy.SettingsSectionsAddContent({ learningObject: mission.name });
      cy.HomeAccess({ filter: util.SectionMap.TAB_COURSES });
      cy.SectionsVerifyDetails({ name: data.name, description: data.description, learningObject: mission.name });
    });

    it('should create a temporary custom course section with a course', () => {
      cy.SettingsSectionsCreate({
        ...data,
        temporary: true,
      });
      cy.SettingsSectionsAddContent({ learningObject: mission.name });
      cy.HomeAccess({ filter: util.SectionMap.TAB_COURSES });
      cy.SectionsVerifyDetails({ name: data.name, description: data.description, learningObject: mission.name });
    });
  });

  describe('Trail Sections', () => {
    beforeEach(() => {
      cy.FixturesTrail()
        .then((fixture) => cy.APITrailCreate({ ...fixture, name: getRandomName() }))
        .then((response) => {
          trail = response.body;
          trailToDelete = response.body.id;
        });

      cy.SettingsSectionsTabAccess(util.SectionMap.TAB_TRAILS);

      data = {
        option: util.SectionMap.LEARNING_TRAIL,
        name: `Section ${getRandomName()}`,
        description: util.SectionMap.DESCRIPTION,
      };
    });

    it('should create a custom trail section with a trail', () => {
      cy.SettingsSectionsCreate({ ...data });
      cy.SettingsSectionsAddContent({ learningObject: trail.name });
      cy.HomeAccess({ filter: util.SectionMap.TAB_TRAILS });
      cy.SectionsVerifyDetails({ name: data.name, description: data.description, learningObject: trail.name });
    });

    it('should create a temporary custom trail section with a trail', () => {
      cy.SettingsSectionsCreate({
        ...data,
        temporary: true,
      });
      cy.SettingsSectionsAddContent({ learningObject: trail.name });
      cy.HomeAccess({ filter: util.SectionMap.TAB_TRAILS });
      cy.SectionsVerifyDetails({ name: data.name, description: data.description, learningObject: trail.name });
    });
  });

  afterEach(() => {
    cy.APISectionDeleteAll();
    if (missionToDelete) {
      cy.APICourseDelete(missionToDelete);
      missionToDelete = null;
    }

    if (trailToDelete) {
      cy.APITrailDelete(trailToDelete);
      trailToDelete = null;
    }
  });
});
