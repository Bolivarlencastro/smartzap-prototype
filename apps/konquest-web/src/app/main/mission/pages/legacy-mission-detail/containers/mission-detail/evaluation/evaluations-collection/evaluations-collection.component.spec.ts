import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { defaultConfig, FuseConfigService } from '@keeps-platform-frontend-workspace/layout';
import { KpContentBoxDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-box-dialog';

import { EvaluationsCollectionComponent } from './evaluations-collection.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideRouter } from '@angular/router';

describe('EvaluationsCollectionComponent', () => {
  let component: EvaluationsCollectionComponent;
  let fixture: ComponentFixture<EvaluationsCollectionComponent>;
  let dialogSpy: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: MatDialog,
          useValue: { open: jest.fn() },
        },
        FuseConfigService,
        {
          provide: defaultConfig,
          useValue: FuseConfigService,
        },
      ],
      imports: [EvaluationsCollectionComponent, getTranslocoTestingModule()],
    }).compileComponents();

    dialogSpy = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;

    fixture = TestBed.createComponent(EvaluationsCollectionComponent);
    component = fixture.componentInstance;
    component.evaluations = [];
    fixture.detectChanges();
  });

  it('should open dialog on show comment', () => {
    // given
    const comment = 'Comment';

    // when
    component.showComment(comment);

    // expect
    expect(dialogSpy.open).toHaveBeenCalledWith(KpContentBoxDialogComponent, {
      maxWidth: 600,
      data: {
        confirmTitle: 'MISSION.DETAIL.EVALUATIONS.COMMENT_DIALOG_TITLE',
        customTemplate: component.commentTemplate,
        context: { $implicit: comment },
      },
    });
  });
});
