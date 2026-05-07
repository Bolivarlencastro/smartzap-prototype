import { LanguagesService } from './languages.service';
import { Language, LanguagesApi, LanguageTypes } from '../my-account-sdk';
import { UserProfileService } from '../services';
import { of, Subject } from 'rxjs';

const mockLanguages: Language[] = [
  { name: 'pt-br', id: 'pt-br-id' },
  { name: 'pt-pt', id: 'pt-pt-id' },
  { name: 'es', id: 'es-id' },
  { name: 'en', id: 'en-id' },
] as Language[];

describe('LanguagesService', () => {
  let service: LanguagesService;
  let languagesApiMock: jest.Mocked<LanguagesApi>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  const userProfileSubject = new Subject<any>();

  beforeEach(() => {
    languagesApiMock = {
      fetchLanguages: jest.fn().mockReturnValue(of(mockLanguages)),
    } as unknown as jest.Mocked<LanguagesApi>;
    userProfileServiceMock = { user$: userProfileSubject.asObservable() } as unknown as jest.Mocked<UserProfileService>;

    service = new LanguagesService(languagesApiMock, userProfileServiceMock);
    userProfileSubject.next({});
  });

  it('should load the languages when the user is defined', () => {
    expect(languagesApiMock.fetchLanguages).toHaveBeenCalled();
  });

  it('should set both signals values', () => {
    const expectedLanguages = [
      { name: 'pt-BR', id: 'pt-br-id' },
      { name: 'pt-PT', id: 'pt-pt-id' },
      { name: 'es', id: 'es-id' },
      { name: 'en', id: 'en-id' },
    ] as Language[];
    const expectedLanguageTypes: LanguageTypes[] = ['pt-BR', 'pt-PT', 'es', 'en'];

    expect(service.languages()).toMatchObject(expectedLanguages);
    expect(service.languagesTypes()).toMatchObject(expectedLanguageTypes);
  });
});
