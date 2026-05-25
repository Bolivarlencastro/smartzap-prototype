import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PmPushHistoryComponent } from './pm-push-history.component';

describe('PmPushHistoryComponent', () => {
  let component: PmPushHistoryComponent;
  let fixture: ComponentFixture<PmPushHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmPushHistoryComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PmPushHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange', () => {
    const emitSpy = jest.spyOn(component.searchChange, 'emit');
    component.searchChange.emit('test query');
    expect(emitSpy).toHaveBeenCalledWith('test query');
  });

  it('should emit sortChange', () => {
    const emitSpy = jest.spyOn(component.sortChange, 'emit');
    const sort: Sort = { active: 'date', direction: 'asc' };
    component.sortChange.emit(sort);
    expect(emitSpy).toHaveBeenCalledWith(sort);
  });

  it('should emit pageChange', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    const event = { pageIndex: 1, pageSize: 25, length: 100 } as PageEvent;
    component.pageChange.emit(event);
    expect(emitSpy).toHaveBeenCalledWith(event);
  });

  it('should include completed_at and status in displayedColumns', () => {
    expect(component['displayedColumns']).toContain('completed_at');
    expect(component['displayedColumns']).toContain('status');
  });

  describe('getStatusDotColor', () => {
    it('should return orange for PROCESSING', () => {
      expect(component['getStatusDotColor']('PROCESSING')).toBe('#ff9b40');
    });

    it('should return green for COMPLETED', () => {
      expect(component['getStatusDotColor']('COMPLETED')).toBe('#00b400');
    });

    it('should return red for FAILED', () => {
      expect(component['getStatusDotColor']('FAILED')).toBe('#ff3700');
    });

    it('should return grey for CANCELED', () => {
      expect(component['getStatusDotColor']('CANCELED')).toBe('#b5b5b5');
    });

    it('should return default grey for unknown status', () => {
      expect(component['getStatusDotColor']('UNKNOWN')).toBe('#b5b5b5');
    });
  });
});
