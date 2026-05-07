import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../util';
import { PointsStatementTableComponent } from './points-statement-table.component';

describe('PointsStatementTableComponent', () => {
  let component: PointsStatementTableComponent;
  let fixture: ComponentFixture<PointsStatementTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PointsStatementTableComponent, getTranslocoTestingModule()],
    });
    fixture = TestBed.createComponent(PointsStatementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit cleanFilterEvent event', () => {
    const emitSpy = jest.spyOn(component.cleanFilterEvent, 'emit');
    component.cleanFilter();
    expect(emitSpy).toHaveBeenCalled();
  });
});
