import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpSkeletonComponent } from './kp-skeleton.component';

describe('KpSkeletonComponent', () => {
  let component: KpSkeletonComponent;
  let fixture: ComponentFixture<KpSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
