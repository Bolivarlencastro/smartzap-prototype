import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionDetailTagsComponent } from './mission-detail-tags.component';
import { By } from '@angular/platform-browser';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionDetailTagsComponent', () => {
  let component: MissionDetailTagsComponent;
  let fixture: ComponentFixture<MissionDetailTagsComponent>;
  let inputElement: HTMLInputElement;
  let addTagSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionDetailTagsComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionDetailTagsComponent);
    component = fixture.componentInstance;
    component.isEnabled = true;
    fixture.detectChanges();

    inputElement = fixture.debugElement.query(By.css('#input-mission-detail-add-tag')).nativeElement;
    addTagSpy = jest.spyOn(component.addTag, 'emit');
  });

  it('should emit addTag event with tags when bulkTagCreation is called and value contains separator', () => {
    inputElement.value = 'tag1,tag2;tag3';
    inputElement.dispatchEvent(new Event('input'));

    const expectedTags = ['tag1', 'tag2', 'tag3'];
    expect(addTagSpy).toHaveBeenCalledWith(expectedTags);
    expect(inputElement.value).toEqual('');
  });

  it('should not emit addTag event when bulkTagCreation is called and value not contains separator', () => {
    inputElement.value = 'tag1-tag2';
    inputElement.dispatchEvent(new Event('input'));

    expect(addTagSpy).not.toHaveBeenCalled();
  });
});
