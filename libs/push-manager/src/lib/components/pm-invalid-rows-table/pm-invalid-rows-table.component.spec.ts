import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PmInvalidRowsTableComponent } from './pm-invalid-rows-table.component';

describe('PmInvalidRowsTableComponent', () => {
  let component: PmInvalidRowsTableComponent;
  let fixture: ComponentFixture<PmInvalidRowsTableComponent>;

  const mockRows = [
    { row: 2, name: 'John Doe', phone: '5511999999999' },
    { row: 5, name: '', phone: '5511888888888' },
    { row: 9, name: 'Jane', phone: '' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmInvalidRowsTableComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PmInvalidRowsTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rows', mockRows);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept rows input and expose it via rows()', () => {
    expect(component.rows()).toEqual(mockRows);
  });

  it('should display the row count in the header', () => {
    const countEl = fixture.nativeElement.querySelector('.table-header span.text-red-500');
    expect(countEl.textContent).toContain('3');
  });
});
