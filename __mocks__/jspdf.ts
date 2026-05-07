export const jsPDF = jest.fn().mockImplementation(() => {
  return {
    save: jest.fn(),
  };
});
