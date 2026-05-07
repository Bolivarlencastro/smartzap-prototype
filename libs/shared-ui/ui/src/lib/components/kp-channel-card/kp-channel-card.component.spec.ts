import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpChannelCardComponent } from './kp-channel-card.component';
import { KpChannelCardModel } from './models/kp-channel-card.model';
import { MatIconTestingModule } from '@angular/material/icon/testing';

const componentData: KpChannelCardModel = {
  id: 'df2c45fb-9a14-46e4-ac2c-4bc53db39049',
  name: 'Novo Nome',
  stats: {
    subscribers_count: 1,
    pulses_count: 0,
    rating: 0,
  },

  category: 'Atendimento',
  cover_image: 'b06ae32a-3e9d-4040-9b38-5c4ef1adbcb9-1000x500.jpg',
  subscription_id: 'f44ff320-dfb5-43d8-8140-05e8b55409de',
  language: '',
  is_active: true,
  is_owner: false,
  is_contributor: false,
};

describe('KpChannelCardComponent Unit Tests', () => {
  describe('KpChannelCardComponent', () => {
    let component: KpChannelCardComponent;
    let fixture: ComponentFixture<KpChannelCardComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [getTranslocoTestingModule(), KpChannelCardComponent, MatIconTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(KpChannelCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should emit on component click', () => {
      const spy = jest.spyOn(component.clickEvent, 'emit');

      component.onClick();

      expect(spy).toHaveBeenCalledWith(component.channel);
    });

    it('should emit on enroll click', () => {
      const spy = jest.spyOn(component.subscribeEvent, 'emit');

      component.onSubscribe(new Event(''));

      expect(spy).toHaveBeenCalledWith(component.channel);
    });
  });

  describe('KpChannelCardComponent Test Host', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [TestHostComponent],
        imports: [getTranslocoTestingModule(), KpChannelCardComponent, MatIconTestingModule],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.channel).toBe(componentData);
    });

    it('should change name', () => {
      const expectedName = 'Channel Card 2';
      component.channel.name = expectedName;

      fixture.detectChanges();

      const name = fixture.nativeElement.querySelector('[data-test="kp-channel-card.channel_name"]');
      expect(name.textContent).toContain(expectedName);
      expect(component.channel.name).toBe(expectedName);
    });

    it('should exist background image', () => {
      const backgroundImage = fixture.nativeElement.querySelector('.kp-channel-card-cover').style.backgroundImage;
      expect(backgroundImage).toBe(`url(${componentData.cover_image})`);
    });

    it('should use default background image', () => {
      component.channel.cover_image = '';
      fixture.detectChanges();

      const backgroundImage = fixture.nativeElement.querySelector('.kp-channel-card-cover').style.backgroundImage;
      expect(backgroundImage).toBe('url(https://assets.keepsdev.com/images/placeholders/v2/pulse.png)');
    });

    it('should display category name', () => {
      const categoryName = fixture.nativeElement.querySelector('[data-test="kp-channel-card.category_name"]');
      expect(categoryName.textContent).toContain(component.channel.category);
    });

    it('should display total pulses and subscribers values', () => {
      const expectedTotalPulses = 10;
      const expectedSubscribers = 10;
      component.channel.stats.pulses_count = expectedTotalPulses;
      component.channel.stats.subscribers_count = expectedSubscribers;

      fixture.detectChanges();

      const totalPulses = fixture.nativeElement.querySelector('[data-test="kp-channel-card.total_pulses"]');
      const subscribers = fixture.nativeElement.querySelector('[data-test="kp-channel-card.subscribers"]');
      expect(totalPulses.textContent).toContain(expectedTotalPulses.toString());
      expect(subscribers.textContent).toContain(expectedSubscribers.toString());
    });

    it('should display total pulses and subscribers values as 0 if values are undefined', () => {
      const expectedTotalPulses = 0;
      const expectedSubscribers = 0;
      component.channel.stats.pulses_count = expectedTotalPulses;
      component.channel.stats.subscribers_count = expectedSubscribers;

      fixture.detectChanges();

      const totalPulses = fixture.nativeElement.querySelector('[data-test="kp-channel-card.total_pulses"]');
      const subscribers = fixture.nativeElement.querySelector('[data-test="kp-channel-card.subscribers"]');
      expect(totalPulses.textContent).toContain('0');
      expect(subscribers.textContent).toContain('0');
    });

    it('should display enrolled if showSubscribeButton and channel enrolled is true', () => {
      component.channel.subscription_id = 'mock_sub_id';

      fixture.detectChanges();

      const enrolledButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enrolled"]');
      const enrollButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enroll"]');
      expect(enrolledButton).toBeDefined();
      expect(enrollButton).toBeNull();
      expect(enrolledButton.innerHTML).toContain('UI.GENERAL.SUBSCRIBED');
    });

    it('should display enroll if showSubscribeButton is true and channel enrolled is false', () => {
      component.channel.subscription_id = '';

      fixture.detectChanges();

      const enrolledButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enrolled"]');
      const enrollButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enroll"]');
      expect(enrolledButton).toBeNull();
      expect(enrollButton).toBeDefined();
      expect(enrollButton.innerHTML).toContain('UI.GENERAL.SUBSCRIBE');
    });

    it('should not display buttons if is an owner', () => {
      component.channel.is_owner = true;

      fixture.detectChanges();

      const enrolledButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enrolled"]');
      const enrollButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enroll"]');
      expect(enrolledButton).toBeNull();
      expect(enrollButton).toBeNull();
    });

    it('should not display buttons if is a contributor', () => {
      component.channel.is_contributor = true;

      fixture.detectChanges();

      const enrolledButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enrolled"]');
      const enrollButton = fixture.nativeElement.querySelector('[data-test="kp-channel-card.enroll"]');
      expect(enrolledButton).toBeNull();
      expect(enrollButton).toBeNull();
    });
  });
});

@Component({
  template: ` <kp-channel-card [channel]="channel"></kp-channel-card>`,
  standalone: false,
})
class TestHostComponent {
  channel = componentData;
}
