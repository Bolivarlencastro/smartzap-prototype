import { ChatbotAnalyticsApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { saveAs } from 'file-saver-es';
import { EMPTY, of } from 'rxjs';
import { ChatbotAnalyticsService } from './chatbot-analytics.service';

jest.mock('file-saver-es', () => ({
  __esModule: true,
  saveAs: jest.fn(),
}));

describe('ChatbotAnalyticsService', () => {
  let service: ChatbotAnalyticsService;
  let apiMock: jest.Mocked<ChatbotAnalyticsApi>;
  const mockSaveAs = saveAs as jest.Mock;

  beforeEach(() => {
    apiMock = {
      startAgent: jest.fn(() => of({ analysis_token: '123' })),
      askQuestion: jest.fn(() => of(EMPTY)),
      generateFollowupQuestions: jest.fn(() => of({ questions: ['A?', 'B?', 'C?'] })),
      generateTable: jest.fn(() => of('<table>Somenthing</table>')),
      generatePlot: jest.fn(() => of({ data: null, layout: null })),
      downloadCSV: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<ChatbotAnalyticsApi>;

    service = new ChatbotAnalyticsService(apiMock);
  });

  describe('startAgent', () => {
    it('should call startAgent with the report url', (done) => {
      const reportUrl = 'https://something.com';

      service.startAgent(reportUrl).subscribe((value) => {
        expect(value).toBe('123');
        expect(apiMock.startAgent).toHaveBeenCalledWith(reportUrl);
        done();
      });
    });
  });

  describe('sendMessage', () => {
    it('should call sendMessage with the session token and a text', (done) => {
      const [text, token] = ['test', '159357'];

      service.sendMessage(text, token).subscribe(() => {
        expect(apiMock.askQuestion).toHaveBeenCalledWith(text, token);
        done();
      });
    });
  });

  describe('generateFollowupQuestions', () => {
    it('should call generateFollowupQuestions and build an interactive answer', (done) => {
      const answer = { question_token: '321', summary: 'textual answer' };
      const analysisToken = 'analysis_123';

      service.generateFollowupQuestions(answer, analysisToken).subscribe((value) => {
        expect(value).toEqual({
          sender: 'bot',
          time: expect.anything(),
          type: 'interactive',
          questionToken: '321',
          text: 'textual answer',
          followupQuestions: ['A?', 'B?', 'C?'],
        });
        expect(apiMock.generateFollowupQuestions).toHaveBeenCalledWith(analysisToken);
        done();
      });
    });
  });

  describe('generateTable', () => {
    it('should call generateTable and build a table answer', (done) => {
      const token = '321';

      service.generateTable(token).subscribe((value) => {
        expect(value).toEqual({
          sender: 'bot',
          time: expect.anything(),
          type: 'table',
          data: '<table>Somenthing</table>',
        });
        expect(apiMock.generateTable).toHaveBeenCalledWith(token);
        done();
      });
    });
  });

  describe('generatePlot', () => {
    it('should call generatePlot and build a plot answer', (done) => {
      const token = '321';

      service.generatePlot(token).subscribe((value) => {
        expect(value).toEqual({
          sender: 'bot',
          time: expect.anything(),
          type: 'plot',
          data: { data: null, layout: null },
        });
        expect(apiMock.generatePlot).toHaveBeenCalledWith(token);
        done();
      });
    });
  });

  describe('csvFile', () => {
    it('should call downloadCSV', (done) => {
      const token = '321';

      service.downloadCSV(token).subscribe(() => {
        expect(apiMock.downloadCSV).toHaveBeenCalledWith(token);
        done();
      });
    });

    it('should call saveCSV', () => {
      const csv = 'Somenthing like a csv file';
      service.saveCSV(csv);
      expect(mockSaveAs).toHaveBeenCalled();
    });
  });
});
