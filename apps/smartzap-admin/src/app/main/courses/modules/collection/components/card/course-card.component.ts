import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from 'app/main/courses/model';
import { KpCardModel, KpCardStatus } from 'app/shared/kp-components/kp-card';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpCardComponent } from '../../../../../../shared/kp-components/kp-card/kp-card.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
  imports: [KpCardComponent, TranslocoPipe],
})
export class CourseCardComponent implements OnInit {
  @Input() course!: Course;
  @Input() delay!: number;

  @Output() selected = new EventEmitter<string>();
  courseCard!: KpCardModel;

  ngOnInit(): void {
    this.courseCard = new CourseCard(this.course);
  }

  onClick({ id }: KpCardModel): void {
    this.selected.emit(id);
  }
}

export class CourseCard implements KpCardModel {
  id: string;
  title: string;
  description: string;
  stages!: number;
  rating!: number;
  duration!: string;
  image!: string;
  createdAt!: Date;
  views!: number;
  updatedAt!: Date;
  bookmark_id!: string;
  tags!: string[];
  progress!: number;
  avatarName: string;
  avatarImage: string;
  status!: string;
  goalDate!: Date;
  summaries: Array<any>;
  cardStatus?: KpCardStatus;
  categories?: string[];

  private readonly inactiveCardStatus = { label: 'STATUS.INACTIVE', color: '#b5b5b5' };

  constructor(course: any = {}) {
    const { status, name, description, holder_image, id, user_creator } = course;

    this.id = id;
    this.image = holder_image;
    this.description = description;
    this.title = name;
    this.cardStatus = course.is_active ? this.createCardStatus(status) : this.inactiveCardStatus;
    this.summaries = this.createSumary(course);
    this.avatarName = user_creator.name;
    this.avatarImage = user_creator.avatar;
  }

  private createSumary(course: any): any[] {
    const pipe = new KpDurationPipe();
    const { duration, total_lessons, total_users_enrolled } = course;
    return [
      {
        label: 'GENERAL.DURATION',
        icon: 'timer',
        svgIcon: true,
        value: pipe.transform(duration),
      },
      {
        label: 'GENERAL.LESSONS',
        icon: 'steps',
        svgIcon: true,
        value: total_lessons || 0,
      },
      {
        label: 'GENERAL.ENROLLMENTS',
        icon: 'people_alt',
        svgIcon: false,
        value: total_users_enrolled || 0,
      },
    ];
  }

  private createCardStatus(status: string): KpCardStatus | undefined {
    if (!status) {
      return undefined;
    }

    switch (status) {
      case 'FINISHED':
        return { label: 'STATUS.FINISHED', color: '#01d89b' };
      case 'REVIEWING':
        return { label: 'STATUS.REVIEWING', color: '#ff9706' };
      case 'PROCESSING':
        return { label: 'STATUS.PROCESSING', color: '#e1b258' };
      case 'CREATING':
        return { label: 'STATUS.CREATING', color: '#ff7152' };
      default:
        return undefined;
    }
  }
}
