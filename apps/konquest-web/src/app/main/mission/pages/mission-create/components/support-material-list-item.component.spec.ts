import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportMaterialListItemComponent } from './support-material-list-item.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('SupportMaterialListItemComponent', () => {
  let component: SupportMaterialListItemComponent;
  let fixture: ComponentFixture<SupportMaterialListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportMaterialListItemComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportMaterialListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the deletion event', () => {
    const deleteSpy = jest.spyOn(component.delete, 'emit');

    component.onDelete();

    expect(deleteSpy).toHaveBeenCalled();
  });
});
