import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../util';
import { SpecificRankingsTableComponent } from './specific-rankings-table.component';

describe('SpecificRankingsTableComponent', () => {
  let component: SpecificRankingsTableComponent;
  let fixture: ComponentFixture<SpecificRankingsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpecificRankingsTableComponent, getTranslocoTestingModule()],
    });
    fixture = TestBed.createComponent(SpecificRankingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit cleanFilterEvent event', () => {
    const emitSpy = jest.spyOn(component.cleanFilterEvent, 'emit');
    component.cleanFilter();
    expect(emitSpy).toHaveBeenCalled();
  });
});
