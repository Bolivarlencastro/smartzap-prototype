import { SupportMaterialsService } from './support-materials.service';
import { CoursesApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('SupportMaterialsService', () => {
  let service: SupportMaterialsService;
  let coursesApiMock: jest.Mocked<CoursesApi>;
  const chance = new Chance();

  beforeEach(() => {
    coursesApiMock = {
      fetchSupportMaterials: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<CoursesApi>;

    TestBed.configureTestingModule({
      providers: [{ provide: CoursesApi, useValue: coursesApiMock }],
    });
    service = TestBed.inject(SupportMaterialsService);
  });

  it('should load the supportMaterials for the event', async () => {
    const eventId = chance.guid();

    service.loadSupportMaterials(eventId);
    TestBed.tick();

    expect(coursesApiMock.fetchSupportMaterials).toHaveBeenCalledWith(eventId);
  });
});
