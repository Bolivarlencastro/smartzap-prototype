import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionContentFormService } from '../../services/mission-content-form.service';

import { MissionDragContentListComponent } from './mission-drag-content-list.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionDragContentListComponent', () => {
  let component: MissionDragContentListComponent;
  let fixture: ComponentFixture<MissionDragContentListComponent>;
  let mockContentFormService: jest.Mocked<MissionContentFormService>;

  beforeEach(async () => {
    mockContentFormService = {
      editQuiz: jest.fn(),
      editStageContent: jest.fn(),
    } as unknown as jest.Mocked<MissionContentFormService>;

    await TestBed.configureTestingModule({
      imports: [MissionDragContentListComponent, getTranslocoTestingModule()],
      providers: [{ provide: MissionContentFormService, useValue: mockContentFormService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionDragContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onEditContent', () => {
    it('should call editStageContent', () => {
      const mockContent = { learn_content_type: { name: 'Link' } } as any;
      component.onEditContent(mockContent);

      expect(mockContentFormService.editStageContent).toHaveBeenCalledWith(mockContent);
    });

    it('should call editQuiz when the content type is question', () => {
      const mockContent = { learn_content_type: { name: 'Question' } } as any;
      component.onEditContent(mockContent);

      expect(mockContentFormService.editQuiz).toHaveBeenCalledWith(mockContent);
    });
  });
});
