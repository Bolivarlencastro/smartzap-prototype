import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PanelActions, panelInitialState } from '../../store';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PanelComponent } from './panel.component';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { panelInitialState } }),
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch loadPanelData action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(PanelActions.loadPanelData());
  });

  it('should navigate to creation page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.goToCreation();
    expect(navigateSpy).toHaveBeenCalledWith(['/push-manager/creation']);
  });

  it('should dispatch removePush action to remove push', () => {
    const id = '123';
    component.removePush(id);
    expect(store.dispatch).toHaveBeenCalledWith(PanelActions.removePush({ id }));
  });
});
