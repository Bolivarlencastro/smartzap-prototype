import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpFileComponent } from './kp-file.component';
import { getTranslocoTestingModule } from '../../../../transloco-testing.module';

describe('KpFileComponent', () => {
  let component: KpFileComponent;
  let fixture: ComponentFixture<KpFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpFileComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(KpFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit selectCoverImage event', () => {
    const emitSpy = jest.spyOn(component.selectCoverImage, 'emit');
    const mockFile = new File([''], 'test.png', {
      type: 'image/png',
    });
    const mockEvent = {
      target: { files: [mockFile] },
    } as unknown as Event;

    component.onSelectCoverImage(mockEvent);
    expect(emitSpy).toHaveBeenCalledWith({ event: mockEvent, element: component.uploadCoverImageInput });
  });
});
