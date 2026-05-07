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
        provideMockStore({ initialState: { creationInitialState } }),
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
});
