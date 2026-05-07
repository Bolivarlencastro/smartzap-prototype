import { provideHttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CORE_CONFIG, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChatbotAnalyticsComponent } from './chatbot-analytics.component';
import { ChatbotAnalyticsActions } from './store';
import { chatbotAnalyticsInitialState } from './store/chatbot-analytics.feature';
import { getTranslocoTestingModule } from './util';

describe('ChatbotAnalyticsComponent', () => {
  let component: ChatbotAnalyticsComponent;
  let fixture: ComponentFixture<ChatbotAnalyticsComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ChatbotAnalyticsComponent,
        getTranslocoTestingModule(),
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
      ],
      providers: [
        provideMockStore({ initialState: chatbotAnalyticsInitialState }),
        { provide: UserProfileService, useValue: { getProfile: jest.fn() } },
        { provide: CORE_CONFIG, useValue: { apis: { apiChatbotAnalytics: '' } } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideHttpClient(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ChatbotAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch resetState action on destroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(ChatbotAnalyticsActions.resetState());
  });

  it('should dispatch sendMessage action', () => {
    const text = 'test';
    component.sendMessage(text);
    expect(store.dispatch).toHaveBeenCalledWith(ChatbotAnalyticsActions.sendMessage({ text }));
  });

  it('should dispatch generateTable action', () => {
    const token = '123';
    component.generateTable(token);
    expect(store.dispatch).toHaveBeenCalledWith(ChatbotAnalyticsActions.generateTable({ token }));
  });

  it('should dispatch generatePlot action', () => {
    const token = '123';
    component.generatePlot(token);
    expect(store.dispatch).toHaveBeenCalledWith(ChatbotAnalyticsActions.generatePlot({ token }));
  });

  it('should dispatch downloadCSV action', () => {
    const token = '123';
    component.downloadCSV(token);
    expect(store.dispatch).toHaveBeenCalledWith(ChatbotAnalyticsActions.downloadCSV({ token }));
  });
});
