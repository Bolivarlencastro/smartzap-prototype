import { Service, WorkspaceBasicDto } from '../my-account-sdk';
import { WorkspaceHashMap, WorkspaceService } from './workspace.service';
import { Chance } from 'chance';

const mockWorkspace = { id: 'test', name: 'test_workspace', logo_url: 'test_logo' } as WorkspaceBasicDto;

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  const chance = new Chance();

  beforeEach(() => {
    service = new WorkspaceService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setCurrentWorkspace', () => {
    it('should emit the workspace value on the currentWorkspace observable', (done) => {
      service.setCurrentWorkspace(mockWorkspace);

      service.currentWorkspace$.subscribe((workspace) => {
        expect(workspace).toBe(mockWorkspace);
        done();
      });
    });

    it('should store the workspace on localStorage', () => {
      global.Storage.prototype.setItem = jest.fn();
      const setItemSpy = jest.spyOn(localStorage, 'setItem');

      service.setCurrentWorkspace(mockWorkspace);

      expect(setItemSpy).toHaveBeenCalledWith(WorkspaceService.WORKSPACE_KEY, JSON.stringify(mockWorkspace));
    });
  });

  describe('getCurrentWorkspace', () => {
    it('should return the workspace instance from the service if already set', () => {
      service.setCurrentWorkspace(mockWorkspace);

      expect(service.getCurrentWorkspace()).toBe(mockWorkspace);
    });

    it('should read the workspace from localStorage if not already set', () => {
      global.Storage.prototype.getItem = jest.fn().mockReturnValue(null);
      const getItemSpy = jest.spyOn(localStorage, 'getItem');

      service.getCurrentWorkspace();

      expect(getItemSpy).toHaveBeenCalledWith(WorkspaceService.WORKSPACE_KEY);
    });

    it('should emit the workspace from localStorage', (done) => {
      global.Storage.prototype.getItem = jest.fn().mockReturnValue(JSON.stringify(mockWorkspace));

      service.getCurrentWorkspace();

      service.currentWorkspace$.subscribe((workspace) => {
        expect(workspace).toEqual(mockWorkspace);
        done();
      });
    });
  });

  describe('clearCurrentWorkspace', () => {
    it('should emit undefined as the new workspace', (done) => {
      service.clearCurrentWorkspace();

      service.currentWorkspace$.subscribe((workspace) => {
        expect(workspace).toBe(undefined);
        done();
      });
    });

    it('should clear the workspace on localStorage', () => {
      global.Storage.prototype.removeItem = jest.fn();
      const removeItemSpy = jest.spyOn(localStorage, 'removeItem');

      service.clearCurrentWorkspace();

      expect(removeItemSpy).toHaveBeenCalledWith(WorkspaceService.WORKSPACE_KEY);
    });

    it('should clear the current workspace services', (done) => {
      service.setWorkspaceServices([{ id: chance.guid() }] as Service[]);
      service.clearCurrentWorkspace();

      service.workspaceServices$.subscribe((services) => {
        expect(services).toEqual([]);
        done();
      });
    });
  });

  describe('setWorkspaceServices', () => {
    it('should define the workspace services', (done) => {
      const mockServices = [{ id: chance.guid() }] as Service[];
      service.setWorkspaceServices(mockServices);

      service.workspaceServices$.subscribe((services) => {
        expect(services).toBe(mockServices);
        done();
      });
    });
  });

  describe('createWorkspace', () => {
    it('should emit createWorkspace$ observable', (done) => {
      service.createWorkspace$.subscribe(() => {
        done();
      });

      service.createWorkspace();
    });
  });

  describe('setAvailableWorkspace', () => {
    it('should store the user workspaces hashes and ids', () => {
      global.Storage.prototype.setItem = jest.fn();
      const setItemSpy = jest.spyOn(localStorage, 'setItem');
      const mockWorkspaces: WorkspaceHashMap = [
        { id: chance.guid(), hash_id: chance.guid() },
        {
          id: chance.guid(),
          hash_id: chance.guid(),
        },
      ];

      service.storeAvailableWorkspaces(mockWorkspaces);

      expect(setItemSpy).toHaveBeenCalledWith(
        WorkspaceService.AVAILABLE_WORKSPACES_HASHES,
        JSON.stringify(mockWorkspaces),
      );
    });
  });

  describe('isWorkspaceAvailable', () => {
    it('should return whether a workspace is available by its hash_id', () => {
      const hashId = chance.guid();
      const mockWorkspaces: WorkspaceHashMap = [
        { id: chance.guid(), hash_id: hashId },
        {
          id: chance.guid(),
          hash_id: chance.guid(),
        },
      ];
      global.Storage.prototype.getItem = jest.fn().mockReturnValue(JSON.stringify(mockWorkspaces));
      const getItemSpy = jest.spyOn(localStorage, 'getItem');

      const available = service.isWorkspaceAvailable(hashId);

      expect(getItemSpy).toHaveBeenCalledWith(WorkspaceService.AVAILABLE_WORKSPACES_HASHES);
      expect(available).toBe(true);
    });
  });
});
