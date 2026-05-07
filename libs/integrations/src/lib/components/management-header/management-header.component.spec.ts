import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../utils';
import { ManagementHeaderComponent } from './management-header.component';

describe('ManagementHeaderComponent', () => {
  let component: ManagementHeaderComponent;
  let fixture: ComponentFixture<ManagementHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ManagementHeaderComponent,
        getTranslocoTestingModule(),
        NoopAnimationsModule,
        MatIconModule,
        MatButtonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit configureToken event', () => {
    const openSpy = jest.spyOn(component.configureToken, 'emit');

    component.onOpenTokensConfigDialog();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should emit courseMirrorDialog event', () => {
    const openSpy = jest.spyOn(component.courseMirrorDialog, 'emit');

    component.onOpenCourseMirrorDialog();

    expect(openSpy).toHaveBeenCalled();
  });
});
