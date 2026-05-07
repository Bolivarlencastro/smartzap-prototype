import { Gender, Language, User } from '.';

describe('User', () => {
  it('should create an instance with default values', () => {
    const user = new User();

    expect(user.id).toBe('');
    expect(user.name).toBe('');
    expect(user.nickname).toBe('');
    expect(user.email).toBe('');
    expect(user.secondary_email).toBe('');
    expect(user.phone).toBe('');
    expect(user.gender).toBe(Gender.MALE);
    expect(user.job).toBe('');
    expect(user.birthday).toBe('');
    expect(user.address).toBe('');
    expect(user.avatar).toBe('');
    expect(user.status).toBe(true);
    expect(user.created_date).toBeInstanceOf(Date);
    expect(user.updated_date).toBeInstanceOf(Date);
    expect(user.language).toBeInstanceOf(Language);
    expect(user.roles).toEqual([]);
  });

  it('should create an instance with provided values', () => {
    const language = new Language({ id: '1', name: 'English' });
    const created_date = new Date('2020-01-01');
    const updated_date = new Date('2021-01-01');

    const userData = {
      id: '1',
      name: 'John Doe',
      nickname: 'johnny',
      email: 'john.doe@example.com',
      secondary_email: 'john.secondary@example.com',
      phone: '1234567890',
      gender: Gender.MALE,
      job: 'Developer',
      birthday: '1990-01-01',
      address: '123 Main St',
      avatar: 'avatar.png',
      status: false,
      created_date,
      updated_date,
      language,
      roles: [],
    };

    const user = new User(userData);

    expect(user.id).toBe(userData.id);
    expect(user.name).toBe(userData.name);
    expect(user.nickname).toBe(userData.nickname);
    expect(user.email).toBe(userData.email);
    expect(user.secondary_email).toBe(userData.secondary_email);
    expect(user.phone).toBe(userData.phone);
    expect(user.gender).toBe(userData.gender);
    expect(user.job).toBe(userData.job);
    expect(user.birthday).toBe(userData.birthday);
    expect(user.address).toBe(userData.address);
    expect(user.avatar).toBe(userData.avatar);
    expect(user.status).toBe(userData.status);
    expect(user.created_date).toEqual(userData.created_date);
    expect(user.updated_date).toEqual(userData.updated_date);
    expect(user.language).toEqual(userData.language);
    expect(user.roles).toEqual(userData.roles);
  });
});
