import { GroupVinculationSelectionManager } from './group-vinculation-selection-manager';

describe('GroupVinculationSelectionManager', () => {
  let selectionManager: GroupVinculationSelectionManager;

  beforeEach(() => {
    selectionManager = new GroupVinculationSelectionManager();
  });

  describe('toggleSelection', () => {
    it('should add the item to the selection', () => {
      selectionManager.toggleSelection('mock_id');

      expect(selectionManager.selection).toMatchObject({ mock_id: 'selected' });
    });

    it('should remove the item to the selection if already present', () => {
      selectionManager.toggleSelection('mock_id');
      selectionManager.toggleSelection('secondary_mock_id');

      selectionManager.toggleSelection('mock_id');

      expect(selectionManager.selection).toMatchObject({ secondary_mock_id: 'selected' });
    });

    it('should update the selectionSize property', () => {
      selectionManager.toggleSelection('mock_id');

      expect(selectionManager.selectionSize).toBe(1);
    });
  });

  describe('selectAllChange', () => {
    const mockIds: string[] = ['mock_id_1', 'mock_id_2', 'mock_id_3'];

    it('should add the ids to the selection', () => {
      selectionManager.selectAll(mockIds);

      expect(selectionManager.selection).toMatchObject({
        mock_id_1: 'selected',
        mock_id_2: 'selected',
        mock_id_3: 'selected',
      });
    });

    it('should clear the current selection if an empty array is provided', () => {
      selectionManager.selectAll([]);

      expect(selectionManager.selection).toMatchObject({});
    });
  });

  describe('clear', () => {
    it('should remove current selection if an empty array is provided', () => {
      const mockIds: string[] = ['mock_id_1', 'mock_id_2', 'mock_id_3'];
      selectionManager.selectAll(mockIds);

      selectionManager.clear();

      expect(selectionManager.selection).toMatchObject({});
    });
  });

  describe('selectedIds', () => {
    it('should return an array of the selected ids', () => {
      const expectedArray: string[] = ['mock_id_1', 'mock_id_2'];
      selectionManager.toggleSelection('mock_id_1');
      selectionManager.toggleSelection('mock_id_2');

      expect(selectionManager.selectedIds).toEqual(expect.arrayContaining(expectedArray));
    });
  });
});
