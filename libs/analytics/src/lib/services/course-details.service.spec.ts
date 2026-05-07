import { CourseDataResponse, LearnAnalyticsApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoService } from '@jsverse/transloco';
import { of, throwError } from 'rxjs';
import { CourseDetailsService } from './course-details.service';

describe('CourseDetailsService', () => {
  let service: CourseDetailsService;
  let learnAnalyticsApi: jest.Mocked<LearnAnalyticsApi>;
  let translocoService: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    learnAnalyticsApi = {
      fetchCourseData: jest.fn(() => of({} as CourseDataResponse)),
    } as unknown as jest.Mocked<LearnAnalyticsApi>;

    translocoService = {
      translate: jest.fn().mockImplementation((key) => key),
    } as unknown as jest.Mocked<TranslocoService>;

    service = new CourseDetailsService(translocoService, learnAnalyticsApi);
  });

  it('should handle successful fetch', () => {
    learnAnalyticsApi.fetchCourseData.mockReturnValue(of(mockResponse));

    const spy = jest.spyOn(service['_response'], 'next');

    service.fetchCourseData('courseId');

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ isLoading: true }));
    expect(spy).toHaveBeenCalledWith({ response: mockExpectedValue, isLoading: false });
  });

  it('should handle 404 error', () => {
    const errorResponse = { status: 404 };
    learnAnalyticsApi.fetchCourseData.mockReturnValue(throwError(() => errorResponse));

    const spy = jest.spyOn(service['_response'], 'next');

    service.fetchCourseData('courseId');

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ isLoading: true }));
    expect(spy).toHaveBeenCalledWith({
      response: {},
      isLoading: false,
      error: 'ANALYTICS.COURSE_DETAILS_DIALOG.ERROR.NOT_FOUND',
    });
  });

  it('should handle unknown error', () => {
    const errorResponse = { status: 500 };
    learnAnalyticsApi.fetchCourseData.mockReturnValue(throwError(() => errorResponse));

    const spy = jest.spyOn(service['_response'], 'next');

    service.fetchCourseData('courseId');

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ isLoading: true }));
    expect(spy).toHaveBeenCalledWith({
      response: {},
      isLoading: false,
      error: 'ANALYTICS.COURSE_DETAILS_DIALOG.ERROR.UNKNOWN',
    });
  });
});

const mockResponse: any = {
  aggs: {
    course_contents: {
      doc_count: 4,
      types: {
        buckets: [
          {
            doc_count: 2,
            key: '569cc389-ac1d-4fa0-9692-f715b475b59b',
            name: {
              buckets: [
                {
                  doc_count: 2,
                  key: 'Video',
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
          },
          {
            doc_count: 1,
            key: '0faac34b-2393-4352-8a94-a9ee0659f824',
            name: {
              buckets: [
                {
                  doc_count: 1,
                  key: 'PDF',
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
          },
          {
            doc_count: 1,
            key: '799f766c-a956-4c03-b5aa-bde9ba357de8',
            name: {
              buckets: [
                {
                  doc_count: 1,
                  key: 'Podcast',
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
    },
  },
  data: [
    {
      _id: '0c5bb415-9da5-44da-ae52-d42aa58d5b81',
      _index: 'kafka-analytics-courses-stage',
      _score: 0,
      _source: {
        allow_self_enrollment_renewal: true,
        allow_self_reproved_enrollment_renewal: true,
        assessment_type: 'CONTENT',
        contributors: [],
        course_category: {
          id: '0283295a-09ff-4d8d-a59b-3d0e037dd48c',
          name: 'Lifestyle',
          name_translated: 'Lifestyle',
        },
        course_contents: [
          {
            content_id: 'd7423182-596b-41df-82d2-c786cef1835b',
            content_name: '02.mp3',
            content_order: 1,
            content_type_id: '799f766c-a956-4c03-b5aa-bde9ba357de8',
            content_type_name: 'Podcast',
            kontent_id: 'c6ed7774-cbef-4ab1-8008-e8e4e2a07b08',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
          {
            content_id: '985c45fc-7526-46f6-953a-cfca409e4f49',
            content_name: 'blabla',
            content_order: 2,
            content_type_id: '569cc389-ac1d-4fa0-9692-f715b475b59b',
            content_type_name: 'Video',
            kontent_id: '1aca6eb7-37eb-42f9-a7a4-03d59a5db933',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
          {
            content_id: '4e3c38e3-948a-4e14-8229-c3255584585d',
            content_name: 'https://vimeo.com/913389735/fabd6709a5',
            content_order: 3,
            content_type_id: '569cc389-ac1d-4fa0-9692-f715b475b59b',
            content_type_name: 'Video',
            kontent_id: '6b6fe3a2-9cc2-404f-a591-2943b763f02a',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
          {
            content_id: '2dbd8910-c2be-4419-bd46-5b57a6ce20af',
            content_name: 'ALEXANDRE_ALMEIDA_AULA_17 (2).pdf',
            content_order: 4,
            content_type_id: '0faac34b-2393-4352-8a94-a9ee0659f824',
            content_type_name: 'PDF',
            kontent_id: '864e3bec-d259-4e09-94bf-853aef73ceb4',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
        ],
        course_model: 'INTERNAL',
        course_type: {
          id: '94176ccd-d3bd-4ee1-a4ae-c08798125617',
          name: 'Open For Workspace',
        },
        created_date: '2024-02-15T16:49:42.374088+00:00',
        description: 'Test',
        development_status: 'DONE',
        duration_time: 6552,
        expiration_date: null,
        external_course: null,
        holder_image:
          'https://media-stage.keepsdev.com/konquest/cover-image/db88f335-1d92-45e0-ab3b-e8fe46cb45ec-1920x640.png',
        id: '0c5bb415-9da5-44da-ae52-d42aa58d5b81',
        is_active: true,
        language: 'pt-BR',
        live_course: null,
        minimum_performance: 0.9,
        name: 'Mission with audio',
        points: 215,
        presential_course: null,
        required_evaluation: true,
        summary: '\n\n\n02.mp3\n\n',
        tags: [
          {
            id: '68b6970a-4f90-4234-afa8-1d28619707f6',
            name: 'algo',
            relevance: 1,
          },
          {
            id: '8062f9a7-c97b-420e-bd5b-947755007d27',
            name: 'é',
            relevance: 1,
          },
          {
            id: '2ffa8c80-c5bd-42b0-b712-f55549db3af4',
            name: 'c',
            relevance: 1,
          },
          {
            id: '70f3341e-7d42-49a2-a238-2cd8066e7b79',
            name: 'b',
            relevance: 1,
          },
          {
            id: '213df891-df77-410d-8668-4e7a61c0edf7',
            name: 'a',
            relevance: 1,
          },
        ],
        thumb_image:
          'https://media-stage.keepsdev.com/konquest/cover-image/618bf16b-5fd8-4c0d-ac25-1dadd7db8b78-400x713.png',
        updated_date: '2024-08-06T13:53:00.248284+00:00',
        user_creator: {
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/f9406145-5b5b-4049-b49b-5881f8fb1cec.jpg',
          email: 'admin@keeps.com.br',
          id: 'bbf47825-8dfb-49bc-8ad8-f8adc775f95f',
          name: 'Super Admin',
          status: true,
        },
        vertical_holder_image:
          'https://media-stage.keepsdev.com/konquest/cover-image/cbedc5a2-2697-4029-95a1-7f9199ee6f28-400x713.png',
        workspaces: [
          {
            created_date: '2024-02-15T16:49:42.432730+00:00',
            id: '8e806434-ae1c-4eb3-acc8-fe3ce80d23dd',
            minimum_performance: 0.76,
            relationship_type: 'OWNER',
            updated_date: '2024-02-15T16:49:42.432757+00:00',
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
        ],
      },
    },
  ],
  stats: {
    activities: {
      total_activity_seconds: 440.336,
    },
    answers: {
      correct_answers: 0,
      correct_ratio: 0,
      total_answers: 0,
      total_exams: 0,
      total_questions: 0,
    },
    enrollments: {
      completed: 0,
      completed_ratio: 0,
      give_up: 0,
      started: 2,
      total: 144,
    },
    nps: {
      cons: 0,
      neutrals: 0,
      pros: 0,
      total: 0,
    },
    ratings: {
      average: null,
      total: 0,
    },
  },
};

const mockExpectedValue: any = {
  aggs: {
    course_contents: {
      doc_count: 4,
      types: {
        buckets: [
          {
            doc_count: 2,
            key: '569cc389-ac1d-4fa0-9692-f715b475b59b',
            name: {
              buckets: [
                {
                  doc_count: 2,
                  key: 'Video',
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
          },
          {
            doc_count: 1,
            key: '0faac34b-2393-4352-8a94-a9ee0659f824',
            name: {
              buckets: [
                {
                  doc_count: 1,
                  key: 'PDF',
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
          },
          {
            doc_count: 1,
            key: '799f766c-a956-4c03-b5aa-bde9ba357de8',
            name: {
              buckets: [
                {
                  doc_count: 1,
                  key: 'Podcast',
                },
              ],
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
            },
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
    },
  },
  data: [
    {
      _id: '0c5bb415-9da5-44da-ae52-d42aa58d5b81',
      _index: 'kafka-analytics-courses-stage',
      _score: 0,
      _source: {
        allow_self_enrollment_renewal: true,
        allow_self_reproved_enrollment_renewal: true,
        assessment_type: 'CONTENT',
        contributors: [],
        course_category: {
          id: '0283295a-09ff-4d8d-a59b-3d0e037dd48c',
          name: 'Lifestyle',
          name_translated: 'Lifestyle',
        },
        course_contents: [
          {
            content_id: 'd7423182-596b-41df-82d2-c786cef1835b',
            content_name: '02.mp3',
            content_order: 1,
            content_type_id: '799f766c-a956-4c03-b5aa-bde9ba357de8',
            content_type_name: 'Podcast',
            kontent_id: 'c6ed7774-cbef-4ab1-8008-e8e4e2a07b08',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
          {
            content_id: '985c45fc-7526-46f6-953a-cfca409e4f49',
            content_name: 'blabla',
            content_order: 2,
            content_type_id: '569cc389-ac1d-4fa0-9692-f715b475b59b',
            content_type_name: 'Video',
            kontent_id: '1aca6eb7-37eb-42f9-a7a4-03d59a5db933',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
          {
            content_id: '4e3c38e3-948a-4e14-8229-c3255584585d',
            content_name: 'https://vimeo.com/913389735/fabd6709a5',
            content_order: 3,
            content_type_id: '569cc389-ac1d-4fa0-9692-f715b475b59b',
            content_type_name: 'Video',
            kontent_id: '6b6fe3a2-9cc2-404f-a591-2943b763f02a',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
          {
            content_id: '2dbd8910-c2be-4419-bd46-5b57a6ce20af',
            content_name: 'ALEXANDRE_ALMEIDA_AULA_17 (2).pdf',
            content_order: 4,
            content_type_id: '0faac34b-2393-4352-8a94-a9ee0659f824',
            content_type_name: 'PDF',
            kontent_id: '864e3bec-d259-4e09-94bf-853aef73ceb4',
            stage_content_type: 'CONTENT',
            stage_id: '12bb23e2-e0e9-4df9-99ee-4a988b1fcd54',
            stage_name: 'Tópico',
            stage_order: 1,
          },
        ],
        course_model: 'INTERNAL',
        course_type: {
          id: '94176ccd-d3bd-4ee1-a4ae-c08798125617',
          name: 'Open For Workspace',
        },
        created_date: '2024-02-15T16:49:42.374088+00:00',
        description: 'Test',
        development_status: 'DONE',
        duration_time: 6552,
        expiration_date: null,
        external_course: null,
        holder_image:
          'https://media-stage.keepsdev.com/konquest/cover-image/db88f335-1d92-45e0-ab3b-e8fe46cb45ec-1920x640.png',
        id: '0c5bb415-9da5-44da-ae52-d42aa58d5b81',
        is_active: true,
        language: 'pt-BR',
        live_course: null,
        minimum_performance: 0.9,
        name: 'Mission with audio',
        points: 215,
        presential_course: null,
        required_evaluation: true,
        summary: '\n\n\n02.mp3\n\n',
        tags: [
          {
            id: '68b6970a-4f90-4234-afa8-1d28619707f6',
            name: 'algo',
            relevance: 1,
          },
          {
            id: '8062f9a7-c97b-420e-bd5b-947755007d27',
            name: 'é',
            relevance: 1,
          },
          {
            id: '2ffa8c80-c5bd-42b0-b712-f55549db3af4',
            name: 'c',
            relevance: 1,
          },
          {
            id: '70f3341e-7d42-49a2-a238-2cd8066e7b79',
            name: 'b',
            relevance: 1,
          },
          {
            id: '213df891-df77-410d-8668-4e7a61c0edf7',
            name: 'a',
            relevance: 1,
          },
        ],
        thumb_image:
          'https://media-stage.keepsdev.com/konquest/cover-image/618bf16b-5fd8-4c0d-ac25-1dadd7db8b78-400x713.png',
        updated_date: '2024-08-06T13:53:00.248284+00:00',
        user_creator: {
          avatar: 'https://media-stage.keepsdev.com/myaccount/user-avatar/f9406145-5b5b-4049-b49b-5881f8fb1cec.jpg',
          email: 'admin@keeps.com.br',
          id: 'bbf47825-8dfb-49bc-8ad8-f8adc775f95f',
          name: 'Super Admin',
          status: true,
        },
        vertical_holder_image:
          'https://media-stage.keepsdev.com/konquest/cover-image/cbedc5a2-2697-4029-95a1-7f9199ee6f28-400x713.png',
        workspaces: [
          {
            created_date: '2024-02-15T16:49:42.432730+00:00',
            id: '8e806434-ae1c-4eb3-acc8-fe3ce80d23dd',
            minimum_performance: 0.76,
            relationship_type: 'OWNER',
            updated_date: '2024-02-15T16:49:42.432757+00:00',
            workspace_id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
          },
        ],
      },
    },
  ],
  stats: {
    activities: {
      total_activity_seconds: 440.336,
    },
    answers: {
      correct_answers: 0,
      correct_ratio: 0,
      total_answers: 0,
      total_exams: 0,
      total_questions: 0,
    },
    enrollments: {
      completed: 0,
      completed_ratio: 0,
      give_up: 0,
      started: 2,
      total: 144,
    },
    nps: {
      cons: 0,
      neutrals: 0,
      pros: 0,
      total: 0,
    },
    ratings: {
      average: null,
      total: 0,
    },
  },
};
