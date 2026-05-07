import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpVinculateListComponent } from './kp-vinculate-list.component';
import { VinculateListColumnDefinition } from './models';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { getTranslocoTestingModule } from '../../transloco-testing.module';

type MockItem = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

describe('KpVinculateListComponent', () => {
  let component: KpVinculateListComponent<MockItem>;
  let fixture: ComponentFixture<KpVinculateListComponent<MockItem>>;
  const mockItem: MockItem = { id: 'mock_id', name: 'mock_name', avatarUrl: 'mock_url', email: 'mock_email' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpVinculateListComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(KpVinculateListComponent<MockItem>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('displayedColumns', () => {
    it('should include the select column if selectable is true', () => {
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      expect(component.displayedColumns).toContain('select');
    });

    it('should include the avatar column if avatarKey is defined', () => {
      fixture.componentRef.setInput('avatarKey', 'avatarUrl');
      fixture.detectChanges();

      expect(component.displayedColumns).toContain('avatar');
    });

    it('should include the properties specified in the columns input', () => {
      const mockColumns: VinculateListColumnDefinition<MockItem>[] = [
        {
          title: 'User Name',
          property: 'name',
        },
        { title: 'E-mail', property: 'email' },
      ];
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();

      expect(component.displayedColumns).toEqual(expect.arrayContaining(['name', 'email']));
    });
  });

  describe('accessProperty', () => {
    it('should return the value of the informed property', () => {
      expect(component.accessProperty(mockItem, 'avatarUrl')).toBe('mock_url');
    });
  });

  describe('isSelected', () => {
    it('should return whether an item id is present in the selection', () => {
      const mockSelection: Record<string, string> = { mock_id: 'mock_id' };

      fixture.componentRef.setInput('selection', mockSelection);

      expect(component.isSelected(mockItem)).toBe(true);
    });
  });

  describe('selectedTotal', () => {
    it('should return the selection length', () => {
      const mockSelection: Record<string, string> = { mock_id: 'mock_id' };

      fixture.componentRef.setInput('selection', mockSelection);

      expect(component.selectedTotal).toBe(1);
    });

    it('should return 0 if selection is not defined', () => {
      expect(component.selectedTotal).toBe(0);
    });
  });

  describe('hasSelection', () => {
    it('should true if there is selection', () => {
      const mockSelection: Record<string, string> = { mock_id: 'mock_id' };

      fixture.componentRef.setInput('selection', mockSelection);

      expect(component.hasSelection).toBe(true);
    });
  });

  describe('isAllSelected', () => {
    it('should true if the selection total equals the total of items', () => {
      const mockSelection: Record<string, string> = { mock_id: 'mock_id' };

      fixture.componentRef.setInput('selection', mockSelection);
      fixture.componentRef.setInput('items', [mockItem]);
      fixture.detectChanges();

      expect(component.isAllSelected).toBe(true);
    });
  });

  describe('indeterminateCheck', () => {
    it('should true if there is selection but the selection total does not equals the total of items', () => {
      const mockSelection: Record<string, string> = { mock_id: 'mock_id' };

      fixture.componentRef.setInput('selection', mockSelection);
      fixture.componentRef.setInput('items', [mockItem, mockItem]);
      fixture.detectChanges();

      expect(component.indeterminateCheck).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should true if it is not loading and there are no items', () => {
      expect(component.isEmpty).toBe(true);
    });
  });

  describe('trackByFunction', () => {
    it('should the item id', () => {
      expect(component.trackByFunction(0, mockItem)).toBe('mock_id');
    });
  });

  it('should dispatch the itemSelectionChange event', () => {
    const emitSpy = jest.spyOn(component.itemSelectionChange, 'emit');

    component.onItemSelectionChange({ checked: true } as MatCheckboxChange, mockItem);

    expect(emitSpy).toHaveBeenCalledWith({ selected: true, item: mockItem });
  });

  it('should dispatch the selectAllChange event', () => {
    const emitSpy = jest.spyOn(component.selectAllChange, 'emit');

    component.toggleAllRows({ checked: true } as MatCheckboxChange);

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should dispatch the onScroll event', () => {
    const emitSpy = jest.spyOn(component.scrolled, 'emit');

    component.onScroll();

    expect(emitSpy).toHaveBeenCalled();
  });
});
