import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupLinkedDialogContentComponent } from './group-linked-dialog-content.component';
import { VinculateListItemSelectionChange } from '@keeps-platform-frontend-workspace/ui/kp-vinculate-list';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

type MockItem = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

describe('GroupLinkedDialogContentComponent', () => {
  let component: GroupLinkedDialogContentComponent<MockItem>;
  let fixture: ComponentFixture<GroupLinkedDialogContentComponent<MockItem>>;
  const mockItem: MockItem = { id: 'mock_id', name: 'mock_name', avatarUrl: 'mock_url', email: 'mock_email' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupLinkedDialogContentComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupLinkedDialogContentComponent<MockItem>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('itemSelectionChange', () => {
    const mockEvent: VinculateListItemSelectionChange<MockItem> = { selected: true, item: mockItem };

    it('should emit the selection change event', () => {
      const emitSpy = jest.spyOn(component.selectionEvent, 'emit');

      component.itemSelectionChange(mockEvent);

      expect(emitSpy).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('onSelectAll', () => {
    it('should emit the selectAll event with all the items ids', () => {
      const emitSpy = jest.spyOn(component.selectAllEvent, 'emit');
      fixture.componentRef.setInput('items', [mockItem]);

      component.onSelectAll(true);

      expect(emitSpy).toHaveBeenCalledWith([mockItem.id]);
    });

    it('should emit the selectAll event with an empty array when selected is false', () => {
      const emitSpy = jest.spyOn(component.selectAllEvent, 'emit');

      component.onSelectAll(false);

      expect(emitSpy).toHaveBeenCalledWith([]);
    });
  });
});
