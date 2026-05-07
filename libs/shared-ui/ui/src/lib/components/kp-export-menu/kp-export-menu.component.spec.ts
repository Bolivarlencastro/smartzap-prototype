import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpExportMenuComponent } from './kp-export-menu.component';

describe('KpExportMenuComponent', () => {
  let component: KpExportMenuComponent;
  let fixture: ComponentFixture<KpExportMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpExportMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpExportMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the export event', () => {
    const emitSpy = jest.spyOn(component.export, 'emit');

    component.optionSelected('pdf');

    expect(emitSpy).toHaveBeenCalledWith('pdf');
  });
});
