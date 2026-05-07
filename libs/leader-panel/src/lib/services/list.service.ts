import { Injectable } from '@angular/core';
import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { delay, Observable, of } from 'rxjs';
import { Course } from '../models/course';
import { ListFilter } from '../models/list';
import { Led } from '../models/led';
import { Trail } from '../models/trail';
import { Event } from '../models/events';
import { Channel } from '../models/channel';
import { Pulse } from '../models/pulse';

@Injectable()
export class ListService {
  getLed(_filter: ListFilter): Observable<Pagination<Led>> {
    return of({
      count: 2,
      results: [
        {
          id: '1',
          avatar: 'https://media.keepsdev.com/myaccount/myaccount/user-avatar/d24674a7-7f91-48c4-a0c4-f94fe81d9905.png',
          job_position: 'Analista de Vendas',
          name: 'Fernando Rocha',
          required_progress: '1 Atradado(s)',
          next_due_date: 'Vencido há 20d',
          last_activity: 'Há 25 dias',
          engagement: null,
          general_status: null,
        },
        {
          id: '2',
          avatar: null,
          job_position: 'Vendedor Sênior',
          name: 'João Silva',
          required_progress: '1 Atradado(s)',
          next_due_date: 'Vencido há 12d',
          last_activity: 'Há 19 dias',
          engagement: null,
          general_status: null,
        },
      ],
    }).pipe(delay(1000));
  }

  getCourses(_filter: ListFilter): Observable<Pagination<Course>> {
    return of({
      count: 2,
      results: [
        {
          course_id: '1',
          course_name: 'Introduction to Project Management',
          duration: 7200,
          enrollments_count: 156,
          overdue_count: 23,
          completion_rate: 0.68,
          average_progress: 0.72,
        },
        {
          course_id: '2',
          course_name: 'Advanced JavaScript Programming',
          duration: 10800,
          enrollments_count: 234,
          overdue_count: 45,
          completion_rate: 0.55,
          average_progress: 0.61,
        },
      ],
    }).pipe(delay(1000));
  }

  getTrails(_filter: ListFilter): Observable<Pagination<Trail>> {
    return of({
      count: 2,
      results: [
        {
          learning_trail_id: '1',
          learning_trail_name: 'Introduction to Project Management',
          duration: 7200,
          enrollments_count: 156,
          overdue_count: 23,
          completion_rate: 0.68,
          average_progress: 0.72,
        },
        {
          learning_trail_id: '2',
          learning_trail_name: 'Advanced JavaScript Programming',
          duration: 10800,
          enrollments_count: 234,
          overdue_count: 45,
          completion_rate: 0.55,
          average_progress: 0.61,
        },
      ],
    }).pipe(delay(1000));
  }

  getPulses(_filter: ListFilter): Observable<Pagination<Pulse>> {
    return of({
      count: 2,
      results: [
        {
          id: '1',
          name: 'Weekly Team Update',
          channel_name: 'Sales Communication Channel',
          type: 'video',
          duration: 180,
          views: 145,
          consumption_rate: 0.82,
          content_type_name: 'Image',
        },
        {
          id: '2',
          name: 'Product Launch Announcement',
          channel_name: 'Marketing Strategy Channel',
          type: 'spreadsheet',
          duration: 300,
          views: 198,
          consumption_rate: 0.74,
          content_type_name: 'Question',
        },
      ],
    }).pipe(delay(1000));
  }

  getChannels(_filter: ListFilter): Observable<Pagination<Channel>> {
    return of({
      count: 2,
      results: [
        {
          id: '1',
          name: 'Sales Communication Channel',
          description: 'Desenvolva habilidades para liderar equipes de alta performance',
          pulses: 45,
          enrolled_count: 234,
          last_activity: new Date('2025-11-27'),
          general_progress: 0.75,
        },
        {
          id: '2',
          name: 'Marketing Strategy Channel',
          description: 'Canais, ferramentas e estratégias de marketing',
          pulses: 32,
          enrolled_count: 156,
          last_activity: new Date('2025-11-26'),
          general_progress: 0.68,
        },
      ],
    }).pipe(delay(1000));
  }

  getEvents(_filter: ListFilter): Observable<Pagination<Event>> {
    return of({
      count: 2,
      results: [
        {
          event_id: '1',
          event_name: 'Event #1',
          event_status: 'DONE',
          start_date: null,
          end_date: null,
          enrolled_count: 156,
          attended_count: null,
          attendance_rate: 0.75,
        },
        {
          event_id: '2',
          event_name: 'Event #2',
          event_status: 'DONE',
          start_date: null,
          end_date: null,
          enrolled_count: 234,
          attended_count: null,
          attendance_rate: 0.75,
        },
      ],
    }).pipe(delay(1000));
  }

  buildFilter({ page, per_page, search, sort }: ListFilter) {
    const { active, direction } = sort;

    if (!direction) {
      return { page, per_page, search };
    }

    const order = direction === 'asc' ? active : `-${active}`;
    return { page, per_page, search, order };
  }
}
