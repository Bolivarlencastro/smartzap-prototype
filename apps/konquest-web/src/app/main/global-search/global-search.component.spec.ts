import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { GlobalSearchComponent } from './global-search.component';
import { GlobalSearchService } from './services/global-search.service';
import { GlobalSearchActions } from './store/actions';
import { MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentTypeTabs } from '@keeps-platform-frontend-workspace/ui/kp-global-search-list';
import { ItemType } from '@keeps-platform-frontend-workspace/ui/kp-global-search-item';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let mockStore: any;
  let dispatchSpy: jest.SpyInstance<any>;

  beforeEach(async () => {
    mockStore = {
      dispatch: jest.fn(),
      select: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [GlobalSearchComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: GlobalSearchService,
          useValue: {
            getTabs: jest.fn(() => [
              {
                title: 'GLOBAL_SEARCH.MISSIONS',
                value: ContentTypeTabs.MISSIONS,
                enabled: true,
              },
            ]),
            getEnrollmentStatus: jest.fn(),
          },
        },
        { provide: AuthService, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  });

  it('should dispatch action to filter items', () => {
    const filter = { search: 'example', enrollmentStatus: ['COMPLETED'] };
    component.updateFilter(filter);
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.updateFilter({ filter }));
  });

  it('should dispatch action to clean the filter', () => {
    component.cleanFilter();
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.cleanFilter());
  });

  it('should dispatch action for open trail details dialog', () => {
    const id = '1';
    const params = { id, type: ItemType.TRAIL, pulse_type: {} };
    component.onOpenDetails(params);
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.openTrailDetails({ id }));
  });

  it('should dispatch action for open mission details dialog', () => {
    const id = '1';
    const params = { id, type: ItemType.COURSE };
    component.onOpenDetails(params);
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.openMissionDetails({ id: params.id }));
  });

  it('should dispatch action for open event details dialog', () => {
    const id = '1';
    const params = { id, type: ItemType.EVENT };
    component.onOpenDetails(params);
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.openEventDetails({ id: params.id }));
  });

  it('should dispatch action for open channel details dialog', () => {
    const id = '1';
    const params = { id, type: ItemType.CHANNEL, pulse_type: {} };
    component.onOpenDetails(params);
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.openChannelDetails({ id }));
  });

  it('should dispatch action for open pulse details dialog', () => {
    const [id, pulse_type] = [
      '1',
      {
        name: 'Pulse Type',
        image: 'img',
        image_cover: 'img cover',
      },
    ];
    const params = { id, type: ItemType.PULSE, pulse_type };
    component.onOpenDetails(params);
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.openPulseDetails({ id, pulse_type }));
  });

  it('should dispatch action for fetch more items', () => {
    component.fetchMoreItems();
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.fetchMoreItems());
  });

  it('should dispatch action for reset the state', () => {
    component.resetState();
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.resetState());
  });

  it('should dispatch action for change the content type', () => {
    const contentType = ContentTypeTabs.MISSIONS;
    component.changeContentType(contentType);
    expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.updateFilter({ filter: { contentType } }));
  });

  describe('openContent', () => {
    it('should dispatch action for open content on trail', () => {
      const item = { id: '123', type: ItemType.TRAIL };
      component.onOpenContent(item);
      expect(dispatchSpy).toHaveBeenCalledWith(GlobalSearchActions.openContentOnTrail({ id: item.id }));
    });

    it('should dispatch action for open mission in classroom when mission is EXTERNAL', () => {
      const item = {
        id: '123',
        course_model: 'EXTERNAL_PROVIDER',
        type: ItemType.COURSE,
        external_course: {
          course_url: 'https://www.udemy.com',
        },
      };
      component.onOpenContent(item);
      expect(dispatchSpy).toHaveBeenCalledWith(
        GlobalSearchActions.openContent({
          item: { id: item.id, mission_model: item.course_model, external_url: item.external_course.course_url },
        }),
      );
    });

    it('should dispatch action for open mission in classroom when mission is not EXTERNAL', () => {
      const item = { id: '123', course_model: 'INTERNAL', type: ItemType.COURSE, external_course: undefined };
      component.onOpenContent(item);
      expect(dispatchSpy).toHaveBeenCalledWith(
        GlobalSearchActions.openContent({ item: { id: item.id, mission_model: item.course_model } }),
      );
    });
  });
});
