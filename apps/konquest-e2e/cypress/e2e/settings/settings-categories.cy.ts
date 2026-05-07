/// <reference types="cypress" />

import { getRandomName } from '../../support/commands';
import { InternalMissionOptions } from '../../support/interfaces';
import { mission_category } from '../../fixtures/dev/mission/default.json';
import * as util from '../../support/constants/utils';

let mission: InternalMissionOptions;
let payload: InternalMissionOptions;
let categoryName: string;
let missionToDelete;

describe('Settings: Category Management', () => {
  beforeEach(() => {
    cy.Login('admin');

    cy.FixturesMission()
      .then((fixtures) => cy.APIMissionCreate({ ...fixtures, name: getRandomName() }))
      .then((response) => {
        mission = response.body;
        missionToDelete = response.body.id;
        payload = {
          missionUUID: mission.id,
          mission_category: mission_category,
        };
        categoryName = getRandomName();

        return cy.APIWorkspaceSettings({ allow_list_public_categories: false });
      });
  });

  it('Active default categories', () => {
    cy.SettingsAccess();
    cy.SettingsCategoriesToggleStatus(true);

    cy.VerifyCategories({
      missionId: mission.id,
      visibleCategory: [...util.DEFAULT_CATEGORIES, ...util.CUSTOM_CATEGORIES],
    });
  });

  it('Disable default categories', () => {
    cy.APIWorkspaceSettings({ allow_list_public_categories: true });

    cy.SettingsAccess();
    cy.SettingsCategoriesToggleStatus(false);

    cy.VerifyCategories({
      missionId: mission.id,
      visibleCategory: util.CUSTOM_CATEGORIES,
      hiddenCategory: util.DEFAULT_CATEGORIES,
    });
  });

  it('Should create a custom category and assign it to a mission', () => {
    cy.SettingsCategoriesAccess();
    cy.SettingsCategoriesCreate(categoryName);

    cy.MissionUpdateCategory(mission.id, categoryName);

    cy.VerifyCategories({
      missionId: mission.id,
      visibleCategory: [categoryName],
    });
  });

  it('Should update a category name and apply it to a mission', () => {
    const updatedName = getRandomName();

    cy.APICategoryCreate(categoryName);

    cy.SettingsCategoriesAccess();
    cy.SettingsCategoriesSearch(categoryName);
    cy.SettingsCategoriesEdit(updatedName);

    cy.MissionUpdateCategory(mission.id, updatedName);

    cy.VerifyCategories({
      missionId: mission.id,
      visibleCategory: [updatedName],
    });
  });

  it('Should delete a category and validate in mission and filters', () => {
    cy.APICategoryCreate(categoryName);

    cy.SettingsCategoriesAccess();
    cy.SettingsCategoriesSearch(categoryName);
    cy.SettingsCategoriesDelete();

    cy.VerifyCategories({
      missionId: mission.id,
      hiddenCategory: [categoryName],
    });
  });

  afterEach(() => {
    cy.APIMissionUpdate({ ...payload, mission_category: util.DEFAULT_CATEGORY });
    cy.APICourseDelete(missionToDelete);
    cy.APICategoryDeleteAll();
    cy.APIWorkspaceSettings({ allow_list_public_categories: true });
  });
});
