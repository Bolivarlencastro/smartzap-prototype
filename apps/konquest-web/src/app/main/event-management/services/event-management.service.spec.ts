import { MissionModel } from '@app/main/mission/mission.model';
import { MissionServiceV2 } from '@app/main/mission/services/mission.service';
import { KonquestAPI } from '@core/api';
import { of } from 'rxjs';
import { EventManagementFilter } from '../models/filter';
import { EventManagementService } from './event-management.service';

describe('EventManagementService', () => {
  let service: EventManagementService;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;
  let konquestApiMock: jest.Mocked<KonquestAPI>;

  beforeEach(() => {
    missionServiceMock = {
      fetchMissionById: jest.fn(() => of({})),
    } as unknown as jest.Mocked<MissionServiceV2>;

    konquestApiMock = {
      get: jest.fn(() => of({})),
    } as unknown as jest.Mocked<KonquestAPI>;

    service = new EventManagementService(missionServiceMock, konquestApiMock);
  });

  describe('Load Event', () => {
    it('should load event by id using mission service', (done) => {
      const eventId = '123';

      service.loadEvent(eventId).subscribe(() => {
        expect(missionServiceMock.fetchMissionById).toHaveBeenCalledWith(eventId);
        done();
      });
    });
  });

  describe('Load Users', () => {
    const mockFilter: EventManagementFilter = {
      search: 'Test term',
      paginate: false,
    };

    it('should load users for presential event with correct endpoint', (done) => {
      const missionModel = MissionModel.PRESENTIAL;

      service.loadUsers(mockFilter, missionModel).subscribe(() => {
        expect(konquestApiMock.get).toHaveBeenCalledWith('/mission-enrollments/presential-attendances', mockFilter);
        done();
      });
    });

    it('should load users for presential event with correct endpoint', (done) => {
      const missionModel = MissionModel.LIVE;

      service.loadUsers(mockFilter, missionModel).subscribe(() => {
        expect(konquestApiMock.get).toHaveBeenCalledWith('/mission-enrollments/live-attendances', mockFilter);
        done();
      });
    });
  });
});
