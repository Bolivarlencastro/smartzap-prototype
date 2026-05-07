import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LatestReportCollectionComponent } from './latest-report-collection.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Component, ViewChild } from '@angular/core';
import { Report } from '@core/api/model';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';

describe('LatestReportCollectionComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let profileServiceMock: jest.Mocked<UserProfileService>;
  const chance = new Chance();

  beforeEach(async () => {
    profileServiceMock = { hasRoles: jest.fn() } as unknown as jest.Mocked<UserProfileService>;
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, InfiniteScrollDirective],
      providers: [{ provide: UserProfileService, useValue: profileServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(hostComponent.reportCollection).toBeTruthy();
  });

  it('should dispatch the loadMore event', () => {
    jest.spyOn(hostComponent.reportCollection.loadMoreItems, 'emit').mockImplementation(() => {});
    hostComponent.reportCollection.requestMoreItems();
    expect(hostComponent.reportCollection.loadMoreItems.emit).toHaveBeenCalled();
  });

  it('should check if the user can experiment the AI chat feature', () => {
    profileServiceMock.hasRoles.mockReturnValueOnce(true);
    const mockReport: Report = { file_format: 'xlsx', report_type: { name: 'konquest_mission_report' } } as Report;

    expect(hostComponent.reportCollection.canUseIaChat(mockReport)).toBe(true);
  });

  it('should emit the openChatBotEvent', () => {
    const mockReport: Report = {
      id: chance.guid(),
      file_format: 'xlsx',
      report_type: { name: 'konquest_mission_report' },
    } as Report;
    const emitSpy = jest.spyOn(hostComponent.reportCollection.openChatbot, 'emit');

    hostComponent.reportCollection.openChatbotDialog(mockReport);

    expect(emitSpy).toHaveBeenCalledWith({ report_id: mockReport.id, name: mockReport.report_type.name });
  });
});

// Needed because the infiniteScroll throws an error while looking for the container-3 element from the root
@Component({
  selector: 'app-host-component',
  imports: [LatestReportCollectionComponent],
  template:
    '<div id="container-3"><app-latest-report-collection [isLoading]="loading"></app-latest-report-collection></div>',
})
class TestHostComponent {
  @ViewChild(LatestReportCollectionComponent)
  reportCollection: LatestReportCollectionComponent;
  loading = false;
}
