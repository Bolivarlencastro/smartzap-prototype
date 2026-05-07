import { UserRolesTranslatePipe } from './user-roles-translate.pipe';
import { TranslocoService } from '@jsverse/transloco';

describe('UserRolesTranslatePipe', () => {
  let translocoServiceMock: jest.Mocked<TranslocoService>;
  let pipe: UserRolesTranslatePipe;

  beforeEach(() => {
    translocoServiceMock = {
      translate: jest.fn().mockImplementation((value) => value),
    } as unknown as jest.Mocked<TranslocoService>;
    pipe = new UserRolesTranslatePipe(translocoServiceMock);
  });

  it('should return the formatted translated string', () => {
    const appName = 'Konquest';
    const roles = ['admin', 'super_admin'];

    const result = pipe.transform(appName, roles);

    expect(translocoServiceMock.translate).toHaveBeenCalledWith(`GENERAL.KEEPS_APPS.${appName.toUpperCase()}`);
    expect(translocoServiceMock.translate).toHaveBeenCalledWith(`GENERAL.APPS_ROLES.${roles[0].toUpperCase()}`);
    expect(translocoServiceMock.translate).toHaveBeenCalledWith(`GENERAL.APPS_ROLES.${roles[1].toUpperCase()}`);
    expect(result).toEqual('GENERAL.KEEPS_APPS.KONQUEST: GENERAL.APPS_ROLES.ADMIN, GENERAL.APPS_ROLES.SUPER_ADMIN');
  });
});
