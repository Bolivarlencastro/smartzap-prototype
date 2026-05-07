import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpImagePreviewComponent } from './kp-image-preview.component';

describe('KpImagePreviewComponent', () => {
  let component: KpImagePreviewComponent;
  let fixture: ComponentFixture<KpImagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpImagePreviewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit openDialog event', () => {
    const spy = jest.spyOn(component.openDialog, 'emit');

    component.onOpenDialog();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit remove event', () => {
    const spy = jest.spyOn(component.remove, 'emit');

    component.onRemove();

    expect(spy).toHaveBeenCalled();
  });
});
