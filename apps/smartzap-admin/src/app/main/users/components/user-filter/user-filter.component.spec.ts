import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFilterComponent } from './user-filter.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('UserFilterComponent', () => {
  let component: UserFilterComponent;
  let fixture: ComponentFixture<UserFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilterComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit search event when enter key is pressed', () => {
    const searchTerm = 'test';
    const emitSpy = jest.spyOn(component.searchChange, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });

    component.onKey(event, searchTerm);
    expect(emitSpy).toHaveBeenCalledWith(searchTerm);
  });

  it('should not emit search event when the searchTerm is equal to the current term', () => {
    const searchTerm = 'test';
    const emitSpy = jest.spyOn(component.searchChange, 'emit');
    fixture.componentRef.setInput('term', searchTerm);
    fixture.detectChanges();

    component.onSearch(searchTerm);
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
