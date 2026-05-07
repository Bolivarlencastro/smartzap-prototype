import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionContentsHeaderComponent } from './section-contents-header.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { Store } from '@ngrx/store';
import { LanguagesService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { SectionContentActions } from 'app/main/section-contents/store/actions';

describe('SectionContentHeaderComponent', () => {
  let component: SectionContentsHeaderComponent;
  let fixture: ComponentFixture<SectionContentsHeaderComponent>;
  let mockStore: jest.Mocked<Store>;
  let mockLanguagesService: jest.Mocked<LanguagesService>;

  beforeEach(async () => {
    mockStore = { dispatch: jest.fn(), select: jest.fn().mockReturnValue(of([])) } as unknown as jest.Mocked<Store>;
    mockLanguagesService = { languages: signal([]) } as unknown as jest.Mocked<LanguagesService>;

    await TestBed.configureTestingModule({
      imports: [SectionContentsHeaderComponent, getTranslocoTestingModule()],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: LanguagesService,
          useValue: mockLanguagesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionContentsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch the filter action', () => {
    const mockFilter = { search: 'mockSearch' };
    component.onFilterChange(mockFilter);

    expect(mockStore.dispatch).toHaveBeenCalledWith(SectionContentActions.filter({ filter: mockFilter }));
  });
});
