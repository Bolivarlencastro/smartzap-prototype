import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { MissionScormService } from '../../services/mission-scorm.service';
import { ScormUploadComponent } from './scorm-upload.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('ScormUploadComponent', () => {
  let component: ScormUploadComponent;
  let fixture: ComponentFixture<ScormUploadComponent>;
  const mockStore = { dispatch: jest.fn() };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScormUploadComponent, getTranslocoTestingModule()],
      providers: [
        {
          provide: MissionScormService,
          useValue: {
            selectedFileName$: of(EMPTY),
            uploadDisabled$: of(EMPTY),
            processingUpload$: of(EMPTY),
            errorMessage$: of(EMPTY),
            progress$: of(EMPTY),
            resetUploadState: jest.fn(),
          },
        },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScormUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should disable the submit button when no time is set', () => {
    component.uploadDisabled$ = of(false);
    component.durationFormControl.setValue('');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('#scorm-upload_import_button');
    expect(button.disabled).toBe(true);
  });
});
