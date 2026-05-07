import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ChannelCardInfo } from '@app/main/channel/channel.model';
import { KpImageCropperComponent } from '@keeps-platform-frontend-workspace/ui/kp-image-cropper';
import { of } from 'rxjs';
import { ChannelFormCoverComponent } from './channel-form-cover.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

const cardInfoMock: ChannelCardInfo = {
  id: 'df2c45fb-9a14-46e4-ac2c-4bc53db39049',
  name: 'Novo Nome',
  description: 'Testedsd',
  enrolled: true,
  stats: {
    pulses_count: 8,
    subscribers_count: 1,
    rating: null,
  },
  total_pulses: 8,
  category: 'Atendimento',
  cover_image: 'b06ae32a-3e9d-4040-9b38-5c4ef1adbcb9-1000x500.jpg',
  is_active: true,
  showSubscribeButton: false,
};

const imageHtmlTag = '[data-test="kp-channel-card.cover-background"]';

describe('ChannelFormCoverComponent Tests', () => {
  describe('ChannelFormCoverComponent', () => {
    let component: ChannelFormCoverComponent;
    let fixture: ComponentFixture<ChannelFormCoverComponent>;
    let dialog: MatDialog;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChannelFormCoverComponent, MatIconTestingModule, getTranslocoTestingModule()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: MatDialog, useValue: { open: jest.fn() } }],
      }).compileComponents();

      dialog = TestBed.inject(MatDialog);
      fixture = TestBed.createComponent(ChannelFormCoverComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should open dialog and emit coverChange on file selection', () => {
      const mockFile = new File([''], 'test.png', {
        type: 'image/png',
      });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as Event;

      const mockInputElement = document.createElement('input');
      mockInputElement.type = 'file';

      const mockFileList = {
        0: mockFile,
        length: 1,
        item: () => mockFile,
      } as unknown as FileList;

      Object.defineProperty(mockInputElement, 'files', {
        value: mockFileList,
        writable: false,
      });

      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(mockFile)),
      };
      (dialog.open as jest.Mock).mockReturnValue(mockDialogRef);

      jest.spyOn(component.coverChange, 'emit');
      component.uploadCoverImageInput = { nativeElement: mockInputElement };

      component.onSelectCoverImage(mockEvent);

      expect(dialog.open).toHaveBeenCalledWith(KpImageCropperComponent, {
        autoFocus: false,
        disableClose: true,
        data: { fileEvent: mockEvent, aspectRatio: 1, resizeToWidth: 300, resizeToHeight: 300 },
      });

      expect(mockInputElement.value).toBe('');
      expect(component.coverChange.emit).toHaveBeenCalledWith(mockFile);
    });

    it('should emit back', () => {
      const backSpy = jest.spyOn(component.back, 'emit');

      component.onBack();
      fixture.detectChanges();

      expect(backSpy).toHaveBeenCalled();
    });

    it('should emit finish', () => {
      const finishSpy = jest.spyOn(component.save, 'emit');

      component.onFinish();
      fixture.detectChanges();

      expect(finishSpy).toHaveBeenCalled();
    });
  });

  describe('ChannelFormCoverComponent TestHostComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent, getTranslocoTestingModule(), MatIconTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should render card background image', () => {
      component.channelCard = { ...cardInfoMock };

      fixture.detectChanges();
      const imageElement = debugElement.query(By.css(imageHtmlTag));
      const imageUrl = imageElement.nativeElement.style.backgroundImage;

      expect(imageUrl).toBe(`url(${cardInfoMock.cover_image})`);
    });

    it('should render default background image when there is no channel image', () => {
      component.channelCard = {
        ...cardInfoMock,
        cover_image: null,
      };

      fixture.detectChanges();
      const imageElement = debugElement.query(By.css(imageHtmlTag));
      const imageUrl = imageElement.nativeElement.style.backgroundImage;

      expect(imageUrl).toBe('url(assets/images/channel-default-image.png)');
    });

    it('should open file explorer on file upload click', fakeAsync(() => {
      let countClick = 0;
      const inputImage = fixture.debugElement.query(By.css('input')).nativeElement;
      inputImage.onclick = () => countClick++;

      fixture.detectChanges();
      const fileUpload = fixture.debugElement.query(By.css('[data-test="kp-channel-card.file_upload"]')).nativeElement;
      fileUpload.click();

      tick();

      expect(countClick).toBe(1);
    }));
  });
});

@Component({
  template: ` <app-channel-form-cover [channelCard]="channelCard"></app-channel-form-cover>`,
  imports: [ChannelFormCoverComponent],
})
class TestHostComponent {
  channelCard = cardInfoMock;
}
