import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateLearnContentButtonComponent } from './create-learn-content-button.component';
import { CreateLearnContentButtonService } from 'app/shared/components/create-learn-content-button/create-learn-content-button.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideRouter } from '@angular/router';

describe('CreateLearnContentButtonComponent', () => {
  let component: CreateLearnContentButtonComponent;
  let fixture: ComponentFixture<CreateLearnContentButtonComponent>;
  let createLearnContentButtonServiceMock: jest.Mocked<CreateLearnContentButtonService>;

  beforeEach(async () => {
    createLearnContentButtonServiceMock = {
      createLearnContentButtonViewModel$: of({
        canCreateGroups: true,
        canCreatePulses: true,
        canCreateMissions: true,
        canCreateTrails: true,
      }),
      createScorm: jest.fn(),
      createGroup: jest.fn(),
    } as unknown as jest.Mocked<CreateLearnContentButtonService>;

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: CreateLearnContentButtonService,
          useValue: createLearnContentButtonServiceMock,
        },
        provideRouter([]),
      ],
      imports: [CreateLearnContentButtonComponent, MatIconTestingModule, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLearnContentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call createScorm in the createLearnContentButtonService', () => {
    component.createScormCourse();
    expect(createLearnContentButtonServiceMock.createScorm).toHaveBeenCalled();
  });

  it('should call createGroup in the createLearnContentButtonService', () => {
    component.createGroup();
    expect(createLearnContentButtonServiceMock.createGroup).toHaveBeenCalled();
  });
});
