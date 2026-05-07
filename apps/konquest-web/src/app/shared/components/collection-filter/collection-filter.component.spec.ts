import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CollectionFilterComponent } from './collection-filter.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('CollectionFilterComponent', () => {
  let component: CollectionFilterComponent;
  let fixture: ComponentFixture<CollectionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionFilterComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit event to filter by input', () => {
    const spy = jest.spyOn(component.filterEvent, 'emit');
    const search = 'test';
    component.onFilter(search);
    expect(spy).toHaveBeenCalledWith(search);
  });

  it('should emit deletedGroupUsersFilter event', () => {
    const emitSpy = jest.spyOn(component.deletedGroupUsersFilter, 'emit');
    const event = { checked: true } as MatSlideToggleChange;
    component.toggleChange(event);
    expect(emitSpy).toHaveBeenCalledWith(true);
  });
});
