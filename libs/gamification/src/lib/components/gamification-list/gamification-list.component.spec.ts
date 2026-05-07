import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../util';
import { GamificationListComponent } from './gamification-list.component';

describe('GamificationListComponent', () => {
  let component: GamificationListComponent;
  let fixture: ComponentFixture<GamificationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GamificationListComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(GamificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit cleanFilterEvent event', () => {
    const emitSpy = jest.spyOn(component.cleanFilterEvent, 'emit');
    component.cleanFilter();
    expect(emitSpy).toHaveBeenCalled();
  });
});
