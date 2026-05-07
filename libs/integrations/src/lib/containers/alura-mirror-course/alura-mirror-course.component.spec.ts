import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { aluraCourseMirrorInitialState } from '../../store';
import { AluraCourseMirrorActions } from '../../store/actions';
import { getTranslocoTestingModule } from '../../utils';
import { AluraMirrorCourseComponent } from './alura-mirror-course.component';
import { AluraCourse } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('AluraMirrorCourseComponent', () => {
  let component: AluraMirrorCourseComponent;
  let fixture: ComponentFixture<AluraMirrorCourseComponent>;
  let matDialogRef: jest.Mocked<MatDialogRef<AluraMirrorCourseComponent>>;
  let store: Store;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AluraMirrorCourseComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        provideMockStore({ initialState: { aluraCourseMirror: aluraCourseMirrorInitialState } }),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    matDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<MatDialogRef<AluraMirrorCourseComponent>>;
    fixture = TestBed.createComponent(AluraMirrorCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a new browser tab', () => {
    const url = 'https://alura.com.br';
    const openSpy = jest.spyOn(window, 'open').mockImplementation();

    component.onOpenCourse(url);

    expect(openSpy).toHaveBeenCalledWith(url, '_blank');
  });

  it('should close dialog on cancel', () => {
    component.onCancel();

    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog on mirror', () => {
    component.selection.setSelection({ id: '1' } as AluraCourse);
    component.onMirror();

    expect(matDialogRef.close).toHaveBeenCalledWith(['1']);
  });

  it('should dispatch filter action', () => {
    const filter = { category: ['1', '2'] };

    component.onFilter(filter);

    expect(dispatchSpy).toHaveBeenCalledWith(AluraCourseMirrorActions.filter({ filter }));
  });

  it('should dispatch search action', () => {
    const search = 'test';

    component.onSearch(search);

    expect(dispatchSpy).toHaveBeenCalledWith(AluraCourseMirrorActions.search({ search }));
  });

  it('should dispatch load more courses action', () => {
    component.onScroll();

    expect(dispatchSpy).toHaveBeenCalledWith(AluraCourseMirrorActions.loadMoreCourses());
  });
});
