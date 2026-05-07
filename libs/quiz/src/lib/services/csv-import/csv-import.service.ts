import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { QuestionInput } from '../../models/quiz';

const MAX_FILE_SIZE = 1_000_000;
const EXPECTED_HEADERS = ['ID', 'ENUNCIADO', 'ALTERNATIVA', 'CORRETA'];

@Injectable({ providedIn: 'root' })
export class CsvImportService {
  parseFile(file: File): Observable<QuestionInput[]> {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return throwError(() => new Error('Only .csv files are allowed'));
    }

    if (file.size > MAX_FILE_SIZE) {
      return throwError(() => new Error('File size must not exceed 1 MB'));
    }

    return from(file.text()).pipe(
      map((content) => this.parseCSV(content)),
      catchError((err: unknown) => throwError(() => (err instanceof Error ? err : new Error('Failed to read file')))),
    );
  }

  parseCSV(content: string): QuestionInput[] {
    const [headerLine, ...dataLines] = content.split('\n').filter((line) => line.trim());

    const headers = parseCsvLine(headerLine ?? '').map((h) => h.trim().toUpperCase());
    if (!EXPECTED_HEADERS.every((expected, i) => headers[i] === expected)) {
      throw new Error(`Invalid CSV format: expected columns ${EXPECTED_HEADERS.join(', ')}`);
    }

    const questionsMap = new Map<string, QuestionInput>();

    for (const line of dataLines) {
      const [id, questionText, option, correct] = parseCsvLine(line);

      if (!questionsMap.has(id)) {
        questionsMap.set(id, { question_text: questionText, options: [], save_to_bank: false });
      }

      questionsMap.get(id)?.options.push({
        option,
        correct_answer: correct.trim().toUpperCase() === 'SIM',
      });
    }

    const questions = Array.from(questionsMap.values());

    if (questions.length === 0) {
      throw new Error('No valid questions found in the file');
    }

    return questions;
  }
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let field = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(field);
      field = '';
    } else {
      field += char;
    }
  }

  result.push(field.replace(/\r$/, ''));
  return result;
}
