import { of } from 'rxjs';
import { SmartzapAPI } from '@core/api';
import { CoursesService } from './courses.service';
import { Course } from '../model';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let smartzapApi: SmartzapAPI;

  beforeEach(() => {
    smartzapApi = {
      get: jest.fn().mockReturnValue(of({})),
      delete: jest.fn().mockReturnValue(of({})),
      patch: jest.fn().mockReturnValue(of({})),
      post: jest.fn().mockReturnValue(of({})),
      postFormData: jest.fn().mockReturnValue(of({})),
    } as any;
    coursesService = new CoursesService(smartzapApi);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('fetchCourses', () => {
    it('should request courses', (done) => {
      const sort = 'name';
      const coursePage = {
        page: 1,
        per_page: 10,
        count: 0,
        total_pages: 1,
      };
      const fetchCoursesResponse = {
        page: coursePage.page,
        per_page: coursePage.per_page,
        count: 0,
        total_pages: 1,
        result: [],
      };
      const fetchCoursesSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchCoursesResponse));
      const expectedFilter = {
        page: coursePage.page,
        per_page: coursePage.per_page,
        sort,
      };
      const expectedResponse = {
        page: {
          count: fetchCoursesResponse.count,
          per_page: fetchCoursesResponse.per_page,
          page: fetchCoursesResponse.page,
          total_pages: fetchCoursesResponse.total_pages,
        },
        collection: fetchCoursesResponse.result,
      };

      coursesService.fetchCourses(coursePage, null, null, sort).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(fetchCoursesSpy).toHaveBeenCalledWith('/course', expectedFilter);
        done();
      });
    });

    it('should request courses with search term params', (done) => {
      const coursePage = {
        page: 1,
        per_page: 10,
        count: 0,
        total_pages: 1,
      };
      const searchTerm = 'searchTerm';
      const fetchCoursesResponse = {
        page: coursePage.page,
        per_page: coursePage.per_page,
        count: 0,
        total_pages: 1,
        result: [],
      };
      const fetchCoursesSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchCoursesResponse));
      const expectedFilter = {
        page: coursePage.page,
        per_page: coursePage.per_page,
        name__ilike: searchTerm,
      };
      const expectedResponse = {
        page: {
          count: fetchCoursesResponse.count,
          per_page: fetchCoursesResponse.per_page,
          page: fetchCoursesResponse.page,
          total_pages: fetchCoursesResponse.total_pages,
        },
        collection: fetchCoursesResponse.result,
      };

      coursesService.fetchCourses(coursePage, undefined, searchTerm).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(fetchCoursesSpy).toHaveBeenCalledWith('/course', expectedFilter);
        done();
      });
    });

    it('should request courses with status filter params', (done) => {
      const coursePage = {
        page: 1,
        per_page: 10,
        count: 0,
        total_pages: 1,
      };
      const filters = {
        categories: [],
        languages: [],
        statuses: ['CREATING', 'FINISHED'],
      };
      const fetchCoursesResponse = {
        page: coursePage.page,
        per_page: coursePage.per_page,
        count: 3,
        total_pages: 1,
        result: [
          { id: '1', status: 'CREATING', category_id: 'cat-1', lang: 'pt-br' },
          { id: '2', status: 'FINISHED', category_id: 'cat-2', lang: 'en' },
          { id: '3', status: 'REVIEWING', category_id: 'cat-3', lang: 'es' },
        ],
      };
      const fetchCoursesSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchCoursesResponse));
      const expectedFilter = {
        page: coursePage.page,
        per_page: coursePage.per_page,
        status__in: 'CREATING,FINISHED',
      };

      coursesService.fetchCourses(coursePage, filters).subscribe((response) => {
        expect(fetchCoursesSpy).toHaveBeenCalledWith('/course', expectedFilter);
        expect(response.collection).toHaveLength(2);
        expect(response.collection.map((course) => course.id)).toEqual(['1', '2']);
        done();
      });
    });
  });

  describe('fetchCourse', () => {
    it('should request course by id', (done) => {
      const courseId = 'courseId';
      const fetchCourseSpy = jest.spyOn(smartzapApi, 'get');

      coursesService.fetchCourse(courseId).subscribe(() => {
        expect(fetchCourseSpy).toHaveBeenCalledWith(`/course/${courseId}`);
        done();
      });
    });
  });

  describe('fetchLessons', () => {
    it('should request lessons by course id', (done) => {
      const courseId = 'courseId';
      const fetchLessonsResponse = { result: [] };
      const fetchLessonsSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchLessonsResponse));

      coursesService.fetchLessons(courseId).subscribe((response) => {
        expect(response).toEqual(fetchLessonsResponse.result);
        expect(fetchLessonsSpy).toHaveBeenCalledWith(`/course/${courseId}/lesson`, { page: 1, per_page: 999 });
        done();
      });
    });
  });

  describe('saveCourse', () => {
    it('should request save course when course id exists', (done) => {
      const course = { id: 'courseId', name: 'name' } as Course;
      const saveCourseSpy = jest.spyOn(coursesService, 'updateCourse');

      coursesService.saveCourse(course).subscribe(() => {
        expect(saveCourseSpy).toHaveBeenCalledWith(course.id, course);
        done();
      });
    });

    it('should request save course when course id does not exists', (done) => {
      const course = { name: 'name' } as Course;
      const saveCourseSpy = jest.spyOn(coursesService, 'createCourse');

      coursesService.saveCourse(course).subscribe(() => {
        expect(saveCourseSpy).toHaveBeenCalledWith(course);
        done();
      });
    });
  });

  describe('deleteCourse', () => {
    it('should request delete course by id', (done) => {
      const courseId = 'courseId';
      const deleteCourseSpy = jest.spyOn(smartzapApi, 'delete');

      coursesService.deleteCourse(courseId).subscribe(() => {
        expect(deleteCourseSpy).toHaveBeenCalledWith(`/course/${courseId}`);
        done();
      });
    });
  });

  describe('uploadImage', () => {
    it('should request upload image', (done) => {
      const file = new File([], 'test.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('image_type', 'holder');

      const uploadImageResponse = { url: 'url' };
      const uploadImageSpy = jest.spyOn(smartzapApi, 'postFormData').mockReturnValue(of(uploadImageResponse));

      coursesService.uploadImage(file, 'holder_image').subscribe((response) => {
        expect(response).toEqual(uploadImageResponse.url);
        expect(uploadImageSpy).toHaveBeenCalledWith('/upload/image', formData);
        done();
      });
    });
  });

  describe('fetchEnrollments', () => {
    it('should request fetch enrollments', (done) => {
      const courseId = 'courseId';
      const pageData = {
        page: 1,
        per_page: 10,
        total_pages: 0,
        count: 0,
      };
      const term = '';
      const sort = '';
      const fetchEnrollmentsResponse = {
        page: pageData.page,
        per_page: pageData.per_page,
        total_pages: 0,
        count: 0,
        result: [],
      };
      const fetchEnrollmentsSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchEnrollmentsResponse));
      const expectedResponse = {
        page: {
          count: fetchEnrollmentsResponse.count,
          per_page: fetchEnrollmentsResponse.per_page,
          page: fetchEnrollmentsResponse.page,
          total_pages: fetchEnrollmentsResponse.total_pages,
        },
        collection: fetchEnrollmentsResponse.result,
      };
      const expectedParams = {
        page: pageData.page,
        per_page: pageData.per_page,
      };

      coursesService.fetchEnrollments(courseId, pageData, term, sort).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(fetchEnrollmentsSpy).toHaveBeenCalledWith(`/course/${courseId}/enrollment`, expectedParams);
        done();
      });
    });

    it('should request fetch enrollments with search term param', (done) => {
      const courseId = 'courseId';
      const pageData = {
        page: 1,
        per_page: 10,
        total_pages: 0,
        count: 0,
      };
      const term = 'search term';
      const sort = '';
      const fetchEnrollmentsResponse = {
        page: pageData.page,
        per_page: pageData.per_page,
        total_pages: 0,
        count: 0,
        result: [],
      };
      const fetchEnrollmentsSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchEnrollmentsResponse));
      const expectedResponse = {
        page: {
          count: fetchEnrollmentsResponse.count,
          per_page: fetchEnrollmentsResponse.per_page,
          page: fetchEnrollmentsResponse.page,
          total_pages: fetchEnrollmentsResponse.total_pages,
        },
        collection: fetchEnrollmentsResponse.result,
      };
      const expectedParams = {
        page: pageData.page,
        per_page: pageData.per_page,
        user__name__ilike: term,
      };

      coursesService.fetchEnrollments(courseId, pageData, term, sort).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(fetchEnrollmentsSpy).toHaveBeenCalledWith(`/course/${courseId}/enrollment`, expectedParams);
        done();
      });
    });

    it('should request fetch enrollments with sort param', (done) => {
      const courseId = 'courseId';
      const pageData = {
        page: 1,
        per_page: 10,
        total_pages: 0,
        count: 0,
      };
      const term = '';
      const sort = 'id:asc';
      const fetchEnrollmentsResponse = {
        page: pageData.page,
        per_page: pageData.per_page,
        total_pages: 0,
        count: 0,
        result: [],
      };
      const fetchEnrollmentsSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchEnrollmentsResponse));
      const expectedResponse = {
        page: {
          count: fetchEnrollmentsResponse.count,
          per_page: fetchEnrollmentsResponse.per_page,
          page: fetchEnrollmentsResponse.page,
          total_pages: fetchEnrollmentsResponse.total_pages,
        },
        collection: fetchEnrollmentsResponse.result,
      };
      const expectedParams = {
        page: pageData.page,
        per_page: pageData.per_page,
        sort,
      };

      coursesService.fetchEnrollments(courseId, pageData, term, sort).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(fetchEnrollmentsSpy).toHaveBeenCalledWith(`/course/${courseId}/enrollment`, expectedParams);
        done();
      });
    });

    it('should request fetch enrollments with filter param', (done) => {
      const courseId = 'courseId';
      const pageData = {
        page: 1,
        per_page: 10,
        total_pages: 0,
        count: 0,
      };
      const term = '';
      const sort = '';
      const filter = { customFilter: 'foo' };
      const fetchEnrollmentsResponse = {
        page: pageData.page,
        per_page: pageData.per_page,
        total_pages: 0,
        count: 0,
        result: [],
      };
      const fetchEnrollmentsSpy = jest.spyOn(smartzapApi, 'get').mockReturnValue(of(fetchEnrollmentsResponse));
      const expectedResponse = {
        page: {
          count: fetchEnrollmentsResponse.count,
          per_page: fetchEnrollmentsResponse.per_page,
          page: fetchEnrollmentsResponse.page,
          total_pages: fetchEnrollmentsResponse.total_pages,
        },
        collection: fetchEnrollmentsResponse.result,
      };
      const expectedParams = {
        page: pageData.page,
        per_page: pageData.per_page,
        ...filter,
      };

      coursesService.fetchEnrollments(courseId, pageData, term, sort, filter).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
        expect(fetchEnrollmentsSpy).toHaveBeenCalledWith(`/course/${courseId}/enrollment`, expectedParams);
        done();
      });
    });
  });

  describe('transferOwnership', () => {
    it('should request transfer ownership', (done) => {
      const courseId = 'courseId';
      const userId = 'userId';
      const transferOwnershipSpy = jest.spyOn(smartzapApi, 'post');

      coursesService.transferOwnership(courseId, userId).subscribe(() => {
        expect(transferOwnershipSpy).toHaveBeenCalledWith(`/course/${courseId}/transfer-ownership/${userId}`, {});
        done();
      });
    });

    describe('updateSummary', () => {
      it('should request update summary by course id', (done) => {
        const courseId = 'courseId';
        const summary = 'New summary';
        const updateSummarySpy = jest.spyOn(smartzapApi, 'patch');

        coursesService.updateSummary(courseId, summary).subscribe(() => {
          expect(updateSummarySpy).toHaveBeenCalledWith(`/course/${courseId}`, { description: summary });
          done();
        });
      });
    });
  });
});
