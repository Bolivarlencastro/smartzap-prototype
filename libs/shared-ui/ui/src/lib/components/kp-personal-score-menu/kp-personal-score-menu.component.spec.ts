import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartialRankingUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpPersonalScoreMenuComponent } from './kp-personal-score-menu.component';
import { GamificationMenuTabType } from './model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const partialRanking: PartialRankingUser[] = [
  {
    id: '111',
    position: 1,
    avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/d7020314-7fd0-4e5b-9198-fc0df770ae2f.jpg',
    user: 'Beatriz Nunes',
    points: 55421,
  },
  {
    id: '222',
    position: 2,
    avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/662df685-2a19-4f31-932d-e667334a1f97.jpg',
    user: 'Cristina Vieira',
    points: 50000,
  },
  {
    id: '333',
    position: 3,
    avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/696269e3-747a-4f8a-845d-c0255ace8b3c-5.jpg',
    user: 'Rafael Marques',
    points: 49885,
  },
  {
    id: '444',
    position: 4,
    avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/3c6c15c2-6a8a-4ede-9134-1c064e88acfc.jpg',
    user: 'Joana Santos',
    points: 43200,
  },
  {
    id: 'bbf47825-8dfb-49bc-8ad8-f8adc775f95f',
    position: 5,
    avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/92cf1611-d777-49ec-9f7f-be83bf3714b7.png',
    user: 'Super Admin',
    points: 41269,
  },
  {
    id: '555',
    position: 6,
    avatar: '',
    user: 'Jonas Antuan',
    points: 35210,
  },
  {
    id: '777',
    position: 7,
    avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/4d10e1d9-2459-4790-b999-ac2df2b757ca.jpg',
    user: 'Alana Vaccario',
    points: 32566,
  },
  {
    id: '888',
    position: 8,
    avatar: '',
    user: 'Humberto Santos',
    points: 30000,
  },
  {
    id: '999',
    position: 9,
    avatar: '',
    user: 'Leonardo Vieira',
    points: 1,
  },
  {
    id: '1010',
    position: 10,
    avatar: '',
    user: 'Sofia Cristal',
    points: 0,
  },
];

describe('KpPersonalScoreMenuComponent', () => {
  let component: KpPersonalScoreMenuComponent;
  let fixture: ComponentFixture<KpPersonalScoreMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpPersonalScoreMenuComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(KpPersonalScoreMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should build the ranking', () => {
    fixture.componentRef.setInput('partialRanking', partialRanking);
    fixture.detectChanges();

    expect(component.podium).toEqual([
      {
        id: '222',
        position: 2,
        avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/662df685-2a19-4f31-932d-e667334a1f97.jpg',
        user: 'Cristina Vieira',
        points: 50000,
      },
      {
        id: '111',
        position: 1,
        avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/d7020314-7fd0-4e5b-9198-fc0df770ae2f.jpg',
        user: 'Beatriz Nunes',
        points: 55421,
      },
      {
        id: '333',
        position: 3,
        avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/696269e3-747a-4f8a-845d-c0255ace8b3c-5.jpg',
        user: 'Rafael Marques',
        points: 49885,
      },
    ]);
    expect(component.otherUsers).toEqual(partialRanking.slice(3));
  });

  it('should change tab', () => {
    const value: GamificationMenuTabType = 'statistics';
    component.changeTab(value);
    expect(component.activeTab).toBe(value);
  });

  it('should emit navigate event', () => {
    const emitSpy = jest.spyOn(component.navigate, 'emit');
    component.navigateToGeneralRanking();
    expect(emitSpy).toHaveBeenCalled();
  });
});
