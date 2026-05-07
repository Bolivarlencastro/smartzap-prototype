import { createSelector } from '@ngrx/store';
import { courseListFeature } from './course-list.feature';
import { enrollmentsFeature } from './enrollments.feature';
import {
  CaixaCourse,
  CaixaSmartZapCourseEnrollmentDto,
  EnrollmentStatuses,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { LearnContentCardActionId, LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';

function getCaixaCourseEnrollmentStatusTag(enrollmentStatus: EnrollmentStatuses): LearnContentCardTag {
  if (!enrollmentStatus) {
    return undefined;
  }

  if (enrollmentStatus === EnrollmentStatuses.COMPLETED) {
    return { label: 'Concluído', dotColor: '#008fec' };
  }

  return { label: 'Iniciado', dotColor: '#81d5d4' };
}

function courseToLearnContent(
  courses: CaixaCourse[],
  enrollments: Record<string, CaixaSmartZapCourseEnrollmentDto>,
): LearnContentCardData[] {
  return courses.map((course) => {
    const enrollment = enrollments[course.id];
    const tags: LearnContentCardTag[] = [];
    const enrollmentStatusTag = getCaixaCourseEnrollmentStatusTag(enrollment?.status);
    const actions: LearnContentCardActionId[] = ['details', 'share'];

    if (enrollmentStatusTag) {
      tags.push(enrollmentStatusTag);
    }

    if (!enrollment) {
      actions.unshift('enroll');
    }

    return {
      backgroundImage: course.thumb_image,
      contentId: course.id,
      language: '',
      title: course.name,
      duration: course.duration,
      tags,
      actions: actions,
      categoryLabel: course.category?.name,
    };
  });
}

export const selectCoursesWithEnrollments = createSelector(
  courseListFeature.selectCourses,
  enrollmentsFeature.selectEnrollments,
  (courses, enrollments) => {
    if (!courses?.length) {
      return [];
    }
    return courseToLearnContent(courses, enrollments);
  },
);

export const selectCurrentOpenCourseEnrollment = createSelector(
  courseListFeature.selectOpenCourse,
  enrollmentsFeature.selectEnrollments,
  (course, enrollments) => {
    const enrollment = enrollments[course?.id];

    if (!enrollment) {
      return undefined;
    }

    return { enrollment: enrollments[course?.id], tag: getCaixaCourseEnrollmentStatusTag(enrollment?.status) };
  },
);
