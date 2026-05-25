import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CreationActions, creationInitialState } from '../../store';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ScheduleStepComponent } from '../schedule-step/schedule-step.component';
import { CreationComponent } from './creation.component';

describe('CreationComponent', () => {
  let component: CreationComponent;
  let fixture: ComponentFixture<CreationComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    TestBed.overrideComponent(CreationComponent, {
      remove: { imports: [ScheduleStepComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [CreationComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { 'pm-creation': creationInitialState } }),
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch loadData action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(CreationActions.loadData());
  });

  it('should navigate to panel page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.goToPanel();
    expect(navigateSpy).toHaveBeenCalledWith(['/push-manager/panel']);
  });

  it('should dispatch reset action on destroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(CreationActions.reset());
  });

  describe('revalidateIfStale', () => {
    it('should not dispatch when selectedIndex is not 3', () => {
      store.dispatch.mockClear();
      component.revalidateIfStale({ selectedIndex: 2 } as any);
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch validateCampaign when validatedWith is null', () => {
      store.dispatch.mockClear();
      store.setState({ 'pm-creation': { ...creationInitialState, validatedWith: null } });

      component.templateForm.get('templateId').setValue('tpl-1');
      component.contactsForm.get('contacts').setValue(new File([''], 'test.csv'));

      component.revalidateIfStale({ selectedIndex: 3 } as any);

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: '[Push Manager - Creation] Validate Campaign' }),
      );
    });

    it('should not dispatch when validatedWith matches current template and variables', () => {
      const templateId = 'tpl-1';
      const templateVariables = '{}';

      component.templateForm.get('templateId').setValue(templateId);

      store.setState({
        'pm-creation': {
          ...creationInitialState,
          validatedWith: { templateId, templateVariables, fileName: 'test.csv' },
        },
      });

      store.dispatch.mockClear();
      component.revalidateIfStale({ selectedIndex: 3 } as any);

      expect(store.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: '[Push Manager - Creation] Validate Campaign' }),
      );
    });

    it('should dispatch when templateId changed since last validation', () => {
      store.setState({
        'pm-creation': {
          ...creationInitialState,
          validatedWith: { templateId: 'tpl-OLD', templateVariables: '{}', fileName: 'test.csv' },
        },
      });

      component.templateForm.get('templateId').setValue('tpl-NEW');
      store.dispatch.mockClear();

      component.revalidateIfStale({ selectedIndex: 3 } as any);

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: '[Push Manager - Creation] Validate Campaign' }),
      );
    });
  });
});
