import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportMaterialFormComponent } from './support-material-form.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

function createDragEvent(options: Partial<DragEvent> = {}): DragEvent {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    ...options,
  } as unknown as DragEvent;
}

function toFileListLike(files: File[]): any {
  const list: any = { length: files.length };
  files.forEach((f, i) => (list[i] = f));
  return list;
}

function setInputFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    get: () => toFileListLike(files),
  });
}

function setEmptyFiles(input: HTMLInputElement) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    get: () => ({ length: 0 }),
  });
}

describe('SupportMaterialFormComponent', () => {
  let component: SupportMaterialFormComponent;
  let fixture: ComponentFixture<SupportMaterialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportMaterialFormComponent, getTranslocoTestingModule()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportMaterialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('dragEnter should set isDraggingOver to true and increment internal counter', () => {
    const evt = createDragEvent();
    const evt2 = createDragEvent();

    component.dragEnter(evt);

    expect(evt.preventDefault).toHaveBeenCalled();
    expect(component.isDraggingOver()).toBe(true);

    component.dragEnter(evt2);
    expect(component.isDraggingOver()).toBe(true);
  });

  it('dragLeave should only unset dragging when counter reaches zero', () => {
    const leave1 = createDragEvent();
    const leave2 = createDragEvent();
    component.dragEnter(createDragEvent());
    component.dragEnter(createDragEvent());
    expect(component.isDraggingOver()).toBe(true);

    component.dragLeave(leave1);
    expect(leave1.preventDefault).toHaveBeenCalled();
    expect(component.isDraggingOver()).toBe(true);

    component.dragLeave(leave2);
    expect(component.isDraggingOver()).toBe(false);
  });

  it('dragOver should prevent default and stop propagation', () => {
    const evt = createDragEvent();
    component.dragOver(evt);

    expect(evt.preventDefault).toHaveBeenCalled();
    expect(evt.stopPropagation).toHaveBeenCalled();
  });

  it('onFileInputChange should not emit when there are no files selected', () => {
    const emitSpy = jest.spyOn(component.filesSelected, 'emit');
    const input = component.fileInput().nativeElement;
    setEmptyFiles(input);

    component.onFileInputChange();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('onFileInputChange should emit selected files when they are present', () => {
    const emitSpy = jest.spyOn(component.filesSelected, 'emit');
    const input = component.fileInput().nativeElement;
    const f1 = new File(['a'], 'a.txt', { type: 'text/plain' });
    const f2 = new File(['b'], 'b.png', { type: 'image/png' });
    setInputFiles(input, [f1, f2]);

    component.onFileInputChange();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('onDrop should reset dragging state and emit dropped files', () => {
    const emitSpy = jest.spyOn(component.filesSelected, 'emit');
    const f1 = new File(['x'], 'x.pdf', { type: 'application/pdf' });
    const dropEvt = createDragEvent({ dataTransfer: { files: toFileListLike([f1]) } as any });

    component.dragEnter(createDragEvent());
    expect(component.isDraggingOver()).toBe(true);

    component.onDrop(dropEvt);

    expect(dropEvt.preventDefault).toHaveBeenCalled();
    expect(component.isDraggingOver()).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith(expect.arrayContaining([f1]));
  });

  it('uploadClick should trigger click on hidden file input', () => {
    const input = component.fileInput().nativeElement;
    const clickSpy = jest.spyOn(input, 'click');

    component.uploadClick();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
