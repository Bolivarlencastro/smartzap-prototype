import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CsvImportService } from './csv-import.service';
import { QuestionInput } from '../../models/quiz';

// jsdom does not implement Blob#text — polyfill it for the test environment
if (!Blob.prototype.text) {
  Blob.prototype.text = function (): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(this);
    });
  };
}

const CSV_SINGLE_QUESTION = `ID,ENUNCIADO,ALTERNATIVA,CORRETA
Q1,"Qual destes animais e um mamífero?","Golfinho","SIM"
Q1,"Qual destes animais e um mamífero?","Pardal","NAO"
Q1,"Qual destes animais e um mamífero?","Tartaruga","NAO"`;

const CSV_MULTI_QUESTION = `ID,ENUNCIADO,ALTERNATIVA,CORRETA
Q1,"Qual destes animais e um mamífero?","Golfinho","SIM"
Q1,"Qual destes animais e um mamífero?","Pardal","NAO"
Q2,"Selecione os itens obrigatorios para iniciar o projeto","Briefing aprovado","SIM"
Q2,"Selecione os itens obrigatorios para iniciar o projeto","Escopo definido","SIM"
Q2,"Selecione os itens obrigatorios para iniciar o projeto","Cafe na copa","NAO"`;

function makeCsvFile(content: string, sizeBytes?: number): File {
  const blob = sizeBytes ? new Blob([new Uint8Array(sizeBytes)]) : new Blob([content]);
  return new File([blob], 'questions.csv', { type: 'text/csv' });
}

describe('CsvImportService', () => {
  let service: CsvImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CsvImportService] });
    service = TestBed.inject(CsvImportService);
  });

  describe('parseCSV', () => {
    it('should parse a single question with one option', () => {
      const csv = `ID,ENUNCIADO,ALTERNATIVA,CORRETA\nQ1,"Pergunta","Resposta","SIM"`;
      const result = service.parseCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0].question_text).toBe('Pergunta');
      expect(result[0].options).toEqual([{ option: 'Resposta', correct_answer: true }]);
    });

    it('should parse a single question with multiple options', () => {
      const result = service.parseCSV(CSV_SINGLE_QUESTION);

      expect(result).toHaveLength(1);
      expect(result[0].options).toHaveLength(3);
    });

    it('should parse multiple questions preserving order', () => {
      const result = service.parseCSV(CSV_MULTI_QUESTION);

      expect(result).toHaveLength(2);
      expect(result[0].question_text).toBe('Qual destes animais e um mamífero?');
      expect(result[1].question_text).toBe('Selecione os itens obrigatorios para iniciar o projeto');
    });

    it('should map SIM to correct_answer true and NAO to false', () => {
      const result = service.parseCSV(CSV_MULTI_QUESTION);

      const [dolphin, sparrow] = result[0].options;
      expect(dolphin.correct_answer).toBe(true);
      expect(sparrow.correct_answer).toBe(false);

      const [briefing, scope, coffee] = result[1].options;
      expect(briefing.correct_answer).toBe(true);
      expect(scope.correct_answer).toBe(true);
      expect(coffee.correct_answer).toBe(false);
    });

    it('should default save_to_bank to false', () => {
      const result = service.parseCSV(CSV_SINGLE_QUESTION);

      expect(result[0].save_to_bank).toBe(false);
    });

    it('should handle whitespace around the CORRETA value', () => {
      const csv = `ID,ENUNCIADO,ALTERNATIVA,CORRETA\nQ1,"P","A"," SIM "`;
      const result = service.parseCSV(csv);

      expect(result[0].options[0].correct_answer).toBe(true);
    });

    it('should return the correct QuestionInput shape', () => {
      const result = service.parseCSV(CSV_SINGLE_QUESTION);
      const expected: QuestionInput = {
        question_text: 'Qual destes animais e um mamífero?',
        options: [
          { option: 'Golfinho', correct_answer: true },
          { option: 'Pardal', correct_answer: false },
          { option: 'Tartaruga', correct_answer: false },
        ],
        save_to_bank: false,
      };

      expect(result[0]).toEqual(expected);
    });

    it('should throw when the header columns are wrong', () => {
      const csv = `WRONG,COLUMNS,HERE,NOW\nQ1,"P","A","SIM"`;

      expect(() => service.parseCSV(csv)).toThrow();
    });

    it('should throw when the file has only the header and no data rows', () => {
      const csv = `ID,ENUNCIADO,ALTERNATIVA,CORRETA`;

      expect(() => service.parseCSV(csv)).toThrow();
    });

    it('should throw when the content is empty', () => {
      expect(() => service.parseCSV('')).toThrow();
    });
  });

  describe('parseFile', () => {
    it('should resolve with parsed questions for a valid .csv file', async () => {
      const file = makeCsvFile(CSV_SINGLE_QUESTION);
      const result = await firstValueFrom(service.parseFile(file));

      expect(result).toHaveLength(1);
      expect(result[0].question_text).toBe('Qual destes animais e um mamífero?');
    });

    it('should error when the file extension is not .txt', (done) => {
      const file = new File(['content'], 'questions.txt', { type: 'text/plain' });

      service.parseFile(file).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('.csv');
          done();
        },
      });
    });

    it('should error when the file size exceeds 1 MB', (done) => {
      const file = makeCsvFile('', 1_000_001);

      service.parseFile(file).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('1 MB');
          done();
        },
      });
    });

    it('should error when the file content has invalid CSV format', (done) => {
      const file = makeCsvFile('this is not a valid csv at all');

      service.parseFile(file).subscribe({
        error: () => done(),
      });
    });

    it('should error when the file has correct headers but no data rows', (done) => {
      const file = makeCsvFile('ID,ENUNCIADO,ALTERNATIVA,CORRETA');

      service.parseFile(file).subscribe({
        error: () => done(),
      });
    });
  });
});
