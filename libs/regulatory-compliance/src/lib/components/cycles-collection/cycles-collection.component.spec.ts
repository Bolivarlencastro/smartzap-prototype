import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';
import { CyclesCollectionComponent } from './cycles-collection.component';

describe('RegulatoryComplianceListComponent', () => {
  let component: CyclesCollectionComponent;
  let fixture: ComponentFixture<CyclesCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CyclesCollectionComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CyclesCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should select/deselect all rows the selectAll checkbox is toggled', () => {
    const selectSpy = jest.spyOn(component.selection, 'select');
    const clearSpy = jest.spyOn(component.selection, 'clear');
    const mockCycles: CycleDto[] = [{ id: 'mock_cycle_id_1' }, { id: 'mock_cycle_id_2' }] as CycleDto[];
    const checkbox = fixture.debugElement.query(By.css('#selectAll')).nativeElement;
    fixture.componentRef.setInput('cycles', mockCycles);
    fixture.detectChanges();

    checkbox.dispatchEvent(new Event('change'));
    expect(selectSpy).toHaveBeenCalledWith(...component.dataSource.data);

    checkbox.dispatchEvent(new Event('change'));
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should emit editCycle event', () => {
    const emitSpy = jest.spyOn(component.editCycle, 'emit');
    const mockCycle: CycleDto = { id: 'mock_cycle_id' } as CycleDto;

    component.onEdit(mockCycle);

    expect(emitSpy).toHaveBeenCalledWith(mockCycle);
  });

  it('should emit deleteCycle event with an array of the provided cycles', () => {
    const emitSpy = jest.spyOn(component.deleteCycle, 'emit');
    const mockCycle: CycleDto = { id: 'mock_cycle_id' } as CycleDto;

    component.onDelete(mockCycle.id);

    expect(emitSpy).toHaveBeenCalledWith(['mock_cycle_id']);
  });

  it('should emit deleteCycle event with current selection', () => {
    const emitSpy = jest.spyOn(component.deleteCycle, 'emit');
    const mockCycles: CycleDto[] = [{ id: 'mock_cycle_id_1' }, { id: 'mock_cycle_id_2' }] as CycleDto[];

    component.selection.setSelection(...mockCycles);
    component.onDelete();

    expect(emitSpy).toHaveBeenCalledWith(['mock_cycle_id_1', 'mock_cycle_id_2']);
  });
});
