import { KpDisableContinueMissionDirective } from './kp-disable-continue-mission.directive';

describe('KpDisableContinueMissionDirective', () => {
  let directive: KpDisableContinueMissionDirective;
  let elRefMock: any;
  let rendererMock: any;

  beforeEach(() => {
    elRefMock = { nativeElement: document.createElement('button') };
    rendererMock = { addClass: jest.fn(), setAttribute: jest.fn() };
    directive = new KpDisableContinueMissionDirective(elRefMock, rendererMock);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('hideElement', () => {
    const cases = [['LIVE'], ['PRESENTIAL']];

    it('should add the hidden class when element.hidden is true', () => {
      directive.element = { mission_model: '', status: 'ENROLLED', hidden: true, mission_status: 'DONE' };
      directive.ngAfterViewInit();
      expect(rendererMock.addClass).toHaveBeenCalledWith(elRefMock.nativeElement, 'hidden');
    });

    it('should add the hidden class when is not have element.status', () => {
      directive.element = { mission_model: '', status: undefined, hidden: true, mission_status: 'DONE' };
      directive.ngAfterViewInit();
      expect(rendererMock.addClass).toHaveBeenCalledWith(elRefMock.nativeElement, 'hidden');
    });

    test.each(cases)('should add the hidden class when mission is - %p', (mission_model) => {
      directive.element = { mission_model, status: 'STARTED', hidden: false, mission_status: 'DONE' };
      directive.ngAfterViewInit();
      expect(rendererMock.addClass).toHaveBeenCalledWith(elRefMock.nativeElement, 'hidden');
    });
  });

  describe('disableElement', () => {
    const cases = [
      ['EXPIRED'],
      ['INACTIVATED'],
      ['PENDING_VALIDATION'],
      ['REPROVED'],
      ['REQUEST_EXTENSION'],
      ['GIVE_UP'],
      ['COMPLETED'],
      ['REFUSED'],
    ];

    it('should disable element when mission status is not DONE', () => {
      directive.element = {
        mission_model: '',
        status: 'ENROLLED',
        hidden: false,
        mission_status: 'ANOTHER_MISSION_STATUS',
      };
      directive.ngAfterViewInit();
      expect(rendererMock.setAttribute).toHaveBeenCalledWith(elRefMock.nativeElement, 'disabled', 'true');
    });

    test.each(cases)('should disable element when mission status is - %p', (status) => {
      directive.element = { mission_model: 'INTERNAL', status, hidden: false, mission_status: 'DONE' };
      directive.ngAfterViewInit();
      expect(rendererMock.setAttribute).toHaveBeenCalledWith(elRefMock.nativeElement, 'disabled', 'true');
    });
  });
});
