import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { LanguagesService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { SectionContentActions, SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { Chance } from 'chance';
import { of } from 'rxjs';
import { SectionContentItemEvent } from '../models/section-content-item-event';
import { SectionContentsComponent } from './section-contents.component';

describe('SectionContentsComponent', () => {
  let component: SectionContentsComponent;
  let fixture: ComponentFixture<SectionContentsComponent>;
  let mockStore: jest.Mocked<Store>;
  let mockLanguagesService: jest.Mocked<LanguagesService>;
  const chance = new Chance();

  beforeEach(async () => {
    mockStore = { dispatch: jest.fn(), select: jest.fn().mockReturnValue(of([])) } as unknown as jest.Mocked<Store>;
    mockLanguagesService = { languages: signal([]) } as unknown as jest.Mocked<LanguagesService>;

    await TestBed.configureTestingModule({
      imports: [SectionContentsComponent, getTranslocoTestingModule()],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: LanguagesService,
          useValue: mockLanguagesService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionContentsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch init action', () => {
    const id = chance.guid();
    fixture.componentRef.setInput('sectionId', id);
    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(SectionContentActions.init({ sectionId: id }));
  });

  it('should not dispatch the init action when the sectionId is falsy', () => {
    fixture.componentRef.setInput('sectionId', null);
    fixture.detectChanges();

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(SectionContentActions.init({ sectionId: null }));
  });

  it('should dispatch resetState action on destroy', () => {
    component.ngOnDestroy();
    expect(mockStore.dispatch).toHaveBeenCalledWith(SectionContentActions.resetState());
  });

  it('should dispatch executeAction action from content cards', () => {
    const event: SectionContentItemEvent = {
      item: null,
      contentType: undefined,
      action: 'continue',
    };
    component.onAction('continue', null);
    expect(mockStore.dispatch).toHaveBeenCalledWith(SectionContentItemActions.executeAction({ event }));
  });

  it('should dispatch loadMoreSectionContents action on scroll', () => {
    component.onScroll();
    expect(mockStore.dispatch).toHaveBeenCalledWith(SectionContentActions.loadMoreSectionContents());
  });
});
