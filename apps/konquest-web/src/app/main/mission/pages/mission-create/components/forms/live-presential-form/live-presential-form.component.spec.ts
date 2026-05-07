import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionLive, MissionModel, MissionModelInformation, MissionPresential } from 'app/main/mission/mission.model';
import { LivePresentialFormComponent } from './live-presential-form.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ptBR } from 'date-fns/locale';
import { provideNgxMask } from 'ngx-mask';

const defaultMissionModelInfo: Partial<MissionModelInformation> = {
  dates: [
    {
      id: 'd0aac477-e7fa-4c5e-aca9-669f5e381aab',
      start_at: '2023-05-26T08:00:00',
      end_at: '2023-05-26T09:00:00',
    },
    {
      id: '47992120-59b3-44c5-8deb-eb1bf42c367e',
      start_at: '2023-05-27T08:00:00',
      end_at: '2023-05-27T10:00:00',
    },
    {
      id: '43f481bd-6965-4229-99cd-6069059ad689',
      start_at: '2023-05-31T10:00:00',
      end_at: '2023-05-31T14:00:00',
    },
  ],
};

const defaultFormValue: Partial<MissionModelInformation> = {
  dates: [
    {
      date: '2023-05-26',
      deleted: false,
      end_at: '2023-05-26T09:00:00',
      id: 'd0aac477-e7fa-4c5e-aca9-669f5e381aab',
      start_at: '2023-05-26T08:00:00',
      touched: false,
    },
    {
      date: '2023-05-27',
      deleted: false,
      end_at: '2023-05-27T10:00:00',
      id: '47992120-59b3-44c5-8deb-eb1bf42c367e',
      start_at: '2023-05-27T08:00:00',
      touched: false,
    },
    {
      date: '2023-05-31',
      deleted: false,
      end_at: '2023-05-31T14:00:00',
      id: '43f481bd-6965-4229-99cd-6069059ad689',
      start_at: '2023-05-31T10:00:00',
      touched: false,
    },
  ],
};

const defaultPresentialInfo: Partial<MissionPresential> = { ...defaultMissionModelInfo, address: 'mock_address' };
const defaultPresentialFormValue: Partial<MissionPresential> = { ...defaultFormValue, address: 'mock_address' };

const defaultLivelInfo: Partial<MissionLive> = { ...defaultMissionModelInfo, url: 'mock_url' };
const defaultLiveFormValue: Partial<MissionLive> = { ...defaultFormValue, url: 'mock_url' };

describe('LivePresentialFormComponent', () => {
  let component: LivePresentialFormComponent;
  let fixture: ComponentFixture<LivePresentialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivePresentialFormComponent, getTranslocoTestingModule()],
      providers: [
        provideNgxMask(),
        provideDateFnsAdapter(),
        {
          provide: MAT_DATE_LOCALE,
          useValue: ptBR,
        },
      ],
    }).compileComponents();

    jest.useFakeTimers().setSystemTime(new Date('26 May 2023 08:00:00 GMT-0300'));
    fixture = TestBed.createComponent(LivePresentialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('dates', () => {
    it('should have one form group after creation', () => {
      expect(component.dates.length).toBe(1);
    });

    it('should have one form group for each of the missionModelInfo input dates', () => {
      fixture.componentRef.setInput('missionModelInfo', defaultPresentialInfo);
      fixture.detectChanges();

      expect(component.dates.length).toBe(3);
    });
  });

  describe('getFormValue', () => {
    it('should reflect the missionModelInfo as the formValue for presential missions', () => {
      fixture.componentRef.setInput('missionModelInfo', defaultPresentialInfo);
      fixture.detectChanges();

      const formValue = component.getFormValue();

      expect(formValue).toEqual(defaultPresentialFormValue);
    });

    it('should reflect the missionModelInfo as the formValue for live missions', () => {
      fixture.componentRef.setInput('missionModel', MissionModel.LIVE);
      fixture.componentRef.setInput('missionModelInfo', defaultLivelInfo);
      fixture.detectChanges();

      const formValue = component.getFormValue();

      expect(formValue).toEqual(defaultLiveFormValue);
    });
  });

  describe('add date', () => {
    it('should add a new date form control', () => {
      component.addNewDate();

      expect(component.dates.length).toBe(2);
    });

    it('the added date should be on the next day', () => {
      component.addNewDate();

      const addedDate = component.dates.at(1).value;
      expect(addedDate.date).toBe('2023-05-27');
    });

    it('the added date should marked as touched', () => {
      component.addNewDate();

      const addedDate = component.dates.at(1).value;
      expect(addedDate.touched).toBe(true);
    });

    it('the added date should not be marked as deleted', () => {
      component.addNewDate();

      const addedDate = component.dates.at(1).value;
      expect(addedDate.deleted).toBe(false);
    });
  });

  describe('removeDate', () => {
    it('should remove a date if it does not have an id', () => {
      component.addNewDate();

      component.removeDate(1);

      expect(component.dates.length).toBe(1);
    });

    it('should set a date as deleted if it has an id', () => {
      fixture.componentRef.setInput('missionModelInfo', defaultPresentialInfo);
      fixture.detectChanges();

      component.removeDate(2);
      const removedDate = component.dates.at(2).value;

      expect(removedDate.deleted).toBe(true);
    });
  });

  describe('markDateAsTouched', () => {
    it('should set a date as touched', () => {
      component.markDateAsTouched(0);

      const touchedDate = component.dates.at(0).value;

      expect(touchedDate.touched).toBe(true);
    });
  });
});
