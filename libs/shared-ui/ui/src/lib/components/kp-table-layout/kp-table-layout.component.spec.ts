import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpTableLayoutComponent } from './kp-table-layout.component';

describe('KpTableLayoutComponent', () => {
  let component: KpTableLayoutComponent;
  let fixture: ComponentFixture<KpTableLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpTableLayoutComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpTableLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should have default values', () => {
      expect(component.totalItems()).toBe(0);
      expect(component.pageSize()).toBe(10);
      expect(component.pageIndex()).toBe(0);
      expect(component.hidePaginator()).toBe(false);
      expect(component.showFirstLastButtons()).toBe(true);
    });

    it('should reflect input values when set', () => {
      fixture.componentRef.setInput('totalItems', 100);
      fixture.componentRef.setInput('pageSize', 25);
      fixture.componentRef.setInput('pageIndex', 2);

      expect(component.totalItems()).toBe(100);
      expect(component.pageSize()).toBe(25);
      expect(component.pageIndex()).toBe(2);
    });
  });

  describe('searchChange output', () => {
    it('should emit searchChange after debounce when search control value changes', fakeAsync(() => {
      const spy = jest.spyOn(component.searchChange, 'emit');

      component['searchControl'].setValue('hello');
      tick(300);

      expect(spy).toHaveBeenCalledWith('hello');
    }));

    it('should not emit searchChange before debounce time elapses', fakeAsync(() => {
      const spy = jest.spyOn(component.searchChange, 'emit');

      component['searchControl'].setValue('hello');
      tick(100);

      expect(spy).not.toHaveBeenCalled();
    }));

    it('should not emit searchChange for duplicate consecutive values', fakeAsync(() => {
      const spy = jest.spyOn(component.searchChange, 'emit');

      component['searchControl'].setValue('hello');
      tick(300);
      component['searchControl'].setValue('hello');
      tick(300);

      expect(spy).toHaveBeenCalledTimes(1);
    }));

    it('should emit empty string when value is cleared', fakeAsync(() => {
      const spy = jest.spyOn(component.searchChange, 'emit');

      component['searchControl'].setValue('');
      tick(300);

      expect(spy).toHaveBeenCalledWith('');
    }));
  });

  describe('pageChange output', () => {
    it('should emit pageChange when onPageChange is called', () => {
      const spy = jest.spyOn(component.pageChange, 'emit');
      const event: PageEvent = { pageIndex: 1, pageSize: 25, length: 100 };

      component['onPageChange'](event);

      expect(spy).toHaveBeenCalledWith(event);
    });
  });

  describe('hidePaginator', () => {
    it('should hide the paginator when hidePaginator is true', () => {
      fixture.componentRef.setInput('hidePaginator', true);
      fixture.detectChanges();

      const paginator = fixture.nativeElement.querySelector('mat-paginator');
      expect(paginator).toBeNull();
    });

    it('should show the paginator when hidePaginator is false', () => {
      fixture.componentRef.setInput('hidePaginator', false);
      fixture.detectChanges();

      const paginator = fixture.nativeElement.querySelector('mat-paginator');
      expect(paginator).not.toBeNull();
    });
  });
});
