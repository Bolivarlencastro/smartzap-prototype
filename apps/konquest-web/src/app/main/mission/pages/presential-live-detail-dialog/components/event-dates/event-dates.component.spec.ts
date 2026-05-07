import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MissionInformationDate } from '@app/main/mission/mission.model';
import { EventDatesComponent } from './event-dates.component';

describe('EventDatesComponent', () => {
  let component: EventDatesComponent;
  let fixture: ComponentFixture<EventDatesComponent>;

  const past = (offsetMinutes: number): string => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - offsetMinutes);
    return d.toISOString();
  };

  const future = (offsetMinutes: number): string => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toISOString();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDatesComponent, getTranslocoTestingModule()],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('activeDate', () => {
    it('should return null when eventDates is empty', () => {
      fixture.componentRef.setInput('eventDates', []);
      fixture.detectChanges();

      expect(component.activeDate()).toBeNull();
    });

    it('should return the ongoing event when now is between start_at and end_at', () => {
      const ongoing: MissionInformationDate = {
        id: 'ongoing-id',
        start_at: past(30),
        end_at: future(30),
      };
      const upcoming: MissionInformationDate = {
        id: 'upcoming-id',
        start_at: future(60),
        end_at: future(90),
      };

      fixture.componentRef.setInput('eventDates', [ongoing, upcoming]);
      fixture.detectChanges();

      expect(component.activeDate()).toEqual(ongoing);
    });

    it('should return the closest upcoming event when no event is ongoing', () => {
      const closestUpcoming: MissionInformationDate = {
        id: 'closest-id',
        start_at: future(60),
        end_at: future(90),
      };
      const fartherUpcoming: MissionInformationDate = {
        id: 'farther-id',
        start_at: future(120),
        end_at: future(150),
      };

      fixture.componentRef.setInput('eventDates', [fartherUpcoming, closestUpcoming]);
      fixture.detectChanges();

      expect(component.activeDate()).toEqual(closestUpcoming);
    });

    it('should return the last event when all events are in the past', () => {
      const first: MissionInformationDate = {
        id: 'first-id',
        start_at: past(120),
        end_at: past(90),
      };
      const last: MissionInformationDate = {
        id: 'last-id',
        start_at: past(60),
        end_at: past(30),
      };

      fixture.componentRef.setInput('eventDates', [first, last]);
      fixture.detectChanges();

      expect(component.activeDate()).toEqual(last);
    });
  });
});
