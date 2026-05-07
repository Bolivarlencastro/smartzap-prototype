import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningTrailContentComponent } from './learning-trail-content.component';
import { LearningTrailImagesComponent } from '../learning-trail-images/learning-trail-images.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LearningTrailCreateActions } from '../../store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LearningTrailContentComponent', () => {
  let component: LearningTrailContentComponent;
  let fixture: ComponentFixture<LearningTrailContentComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LearningTrailImagesComponent,
        getTranslocoTestingModule(),
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore({}), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningTrailContentComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should dispatch loadContents action when onLoadContents is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const search = 'test search';

    component.onLoadContents(search);

    expect(dispatchSpy).toHaveBeenCalledWith(LearningTrailCreateActions.loadContents({ search }));
  });
});
