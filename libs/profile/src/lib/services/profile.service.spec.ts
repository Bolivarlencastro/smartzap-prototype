import { ProfileService } from './profile.service';
import { Language, LanguagesApi, UserProfile, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';

describe('ProfileService', () => {
  let service: ProfileService;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  let languagesApiMock: jest.Mocked<LanguagesApi>;
  const mockLanguages: Language[] = [{ id: 'mock_id', name: 'pt-br' }] as unknown as Language[];

  beforeEach(() => {
    userProfileServiceMock = {
      uploadAvatar: jest.fn(),
      updateProfile: jest.fn(),
      fetchUserData: jest.fn(),
    } as unknown as jest.Mocked<UserProfileService>;
    languagesApiMock = { fetchLanguages: jest.fn(() => of(mockLanguages)) } as unknown as jest.Mocked<LanguagesApi>;

    service = new ProfileService(userProfileServiceMock, languagesApiMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('updatePageData', () => {
    it('should update the page title', (done) => {
      service.title$.subscribe((title) => {
        expect(title).toBe('Mock Title');
        done();
      });

      service.updatePageData({ title: 'Mock Title', subtitle: 'Mock Subtitle' });
    });

    it('should update the page subtitle', (done) => {
      service.subtitle$.subscribe((subtitle) => {
        expect(subtitle).toBe('Mock Subtitle');
        done();
      });

      service.updatePageData({ title: 'Mock Title', subtitle: 'Mock Subtitle' });
    });
  });

  describe('updateProfile', () => {
    it('should call update profile on the userProfileService', () => {
      const mockUser: Partial<UserProfile> = { name: 'Mock User' };

      service.updateProfile(mockUser);

      expect(userProfileServiceMock.updateProfile).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('upload avatar', () => {
    it('should call upload avatar on the userProfileService', () => {
      const mockFile = { name: 'avatar.png' } as any;

      service.uploadAvatar(mockFile);

      expect(userProfileServiceMock.uploadAvatar).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('fetchLanguages', () => {
    it('should fetch the available languages', (done) => {
      service.fetchLanguages().subscribe((languages) => {
        expect(languages).toEqual(expect.arrayContaining(mockLanguages));

        done();
      });
    });
  });

  describe('fetchUser', () => {
    it('should fetch the user profile', (done) => {
      service.fetchUser();

      expect(userProfileServiceMock.fetchUserData).toHaveBeenCalled();
      done();
    });
  });
});
