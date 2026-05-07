import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VinculateToGroupActions, vinculateToGroupInitialState } from '@app/shared/store';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { VinculateToGroupComponent } from './vinculate-to-group.component';

describe('VinculateToGroupComponent', () => {
  let component: VinculateToGroupComponent;
  let fixture: ComponentFixture<VinculateToGroupComponent>;
  let store: MockStore;
  let matDialogRef: jest.Mocked<MatDialogRef<VinculateToGroupComponent>>;

  beforeEach(async () => {
    matDialogRef = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<VinculateToGroupComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        VinculateToGroupComponent,
        getTranslocoTestingModule(),
        MatRadioModule,
        FormsModule,
        MatDividerModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({ initialState: { ['vinculateToGroup']: vinculateToGroupInitialState } }),
        { provide: MatDialogRef, useValue: matDialogRef },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(VinculateToGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch search action on searchTerm', () => {
    component.selectedGroup = 'group1';
    const spy = jest.spyOn(store, 'dispatch');
    const search = 'group term';

    component.searchTerm(search);

    expect(component.selectedGroup).toBe(null);
    expect(spy).toHaveBeenCalledWith(VinculateToGroupActions.search({ search }));
  });

  it('should close dialog with selected group on submit', () => {
    component.selectedGroup = 'group1';
    component.onSubmit();

    expect(matDialogRef.close).toHaveBeenCalledWith('group1');
  });
});
