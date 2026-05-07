import Keycloak from 'keycloak-js';

import { InitService } from './init.service';
import { CheckInService } from './check-in.service';
import { SessionData } from '../models/session-data';
import { SupportMaterialsService } from './support-materials.service';

describe('InitService', () => {
  let service: InitService;
  let keycloakMock: jest.Mocked<Keycloak>;
  let locationMock: jest.Mocked<Location>;
  let checkInServiceMock: jest.Mocked<CheckInService>;
  let supportMaterialsServiceMock: jest.Mocked<SupportMaterialsService>;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    locationMock = {
      href: 'mock_href',
      replace: jest.fn(),
      origin: 'mock_origin',
    } as unknown as jest.Mocked<Location>;

    keycloakMock = {
      init: jest.fn().mockResolvedValue(undefined),
      authenticated: true,
      idTokenParsed: { sub: 'USER-123' },
      login: jest.fn().mockResolvedValue(undefined),
      createLoginUrl: jest.fn().mockReturnValue('http://keycloak/login?foo=bar'),
    } as unknown as jest.Mocked<Keycloak>;

    checkInServiceMock = {
      setSessionData: jest.fn(),
      autoCheckIn: jest.fn(),
    } as unknown as jest.Mocked<CheckInService>;

    supportMaterialsServiceMock = {
      loadSupportMaterials: jest.fn(),
    } as unknown as jest.Mocked<SupportMaterialsService>;

    delete (window as any).location;
    (window.location as any) = locationMock;

    service = new InitService(keycloakMock, checkInServiceMock, supportMaterialsServiceMock);
  });

  it('should redirect to login when not authenticated with the redirect uri param', async () => {
    keycloakMock.authenticated = false;
    await service.init();

    expect(keycloakMock.init).toHaveBeenCalledTimes(1);
    expect(keycloakMock.login).toHaveBeenCalled();
  });

  it('should not set session when authenticated but URL has no encoded data', async () => {
    keycloakMock.authenticated = true;
    locationMock.href = 'https://checkpoint-stage.keepsdev.com/invalid-data';

    await service.init();

    expect(checkInServiceMock.setSessionData).not.toHaveBeenCalled();
  });

  it('should decode URL data, set session with the current user ID and perform the check-in', async () => {
    keycloakMock.authenticated = true;
    keycloakMock.idTokenParsed = { sub: 'USER-ABC' } as any;

    const payload: SessionData = {
      eventId: 'EVT-1',
      dateId: 'DATE-1',
      workspaceId: 'WS-1',
      start: '2025-11-03',
      end: '2025-11-03',
      eventName: 'Event',
      workspaceColor: '#FFF',
    };

    const jsonData = JSON.stringify(payload);
    const encodedData = encodeURIComponent(jsonData);
    const encoded = btoa(encodedData);

    locationMock.href = `https://checkpoint-stage.keepsdev.com/${encoded}`;

    await service.init();

    expect(checkInServiceMock.setSessionData).toHaveBeenCalledWith({
      ...payload,
      user: 'USER-ABC',
    });
    expect(checkInServiceMock.autoCheckIn).toHaveBeenCalledWith(payload.dateId);
  });

  it('should ignore data if decodeURIComponent throws', async () => {
    keycloakMock.authenticated = true;
    locationMock.href = 'https://checkpoint-stage.keepsdev.com/check-in/%';

    await service.init();

    expect(checkInServiceMock.setSessionData).not.toHaveBeenCalled();
  });

  it('should ignore data if base64/JSON parsing fails', async () => {
    keycloakMock.authenticated = true;
    const bad = encodeURIComponent('not-base64');
    locationMock.href = `https://checkpoint-stage.keepsdev.com/check-in/${bad}`;

    await service.init();

    expect(checkInServiceMock.setSessionData).not.toHaveBeenCalled();
  });
});
