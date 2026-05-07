import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CORE_CONFIG, KONQUEST_APP, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BehaviorSubject } from 'rxjs';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpChatbotComponent } from './kp-chatbot.component';

const GO_LEARNING_WORKSPACE_ID = 'fddf62f0-36dd-42eb-98b1-2be022429a54';
const QUINTO_ANDAR_WORKSPACE_ID = '13968cd5-0881-46aa-9153-7067cc53e9ca';

const CHATBOT_SRC_MAP: Record<string, string> = {
  [GO_LEARNING_WORKSPACE_ID]: 'https://www.chatbase.co/chatbot-iframe/EDUp9XhpZOAC75z1He8eb',
  [QUINTO_ANDAR_WORKSPACE_ID]: 'https://www.chatbase.co/chatbot-iframe/O9t1djKa2f8CjJCTMiNqW',
};

const STANDARD_CHATBOT_SRC = 'https://www.chatbase.co/chatbot-iframe/LpBjvqOyYvJtUVnwMqSG1';

class MockWorkspaceService {
  private workspaceSubject = new BehaviorSubject<{ id: string }>(null);
  currentWorkspace$ = this.workspaceSubject.asObservable();

  setWorkspaceId(id: string) {
    this.workspaceSubject.next({ id });
  }
}

describe('KpChatbotComponent', () => {
  let component: KpChatbotComponent;
  let fixture: ComponentFixture<KpChatbotComponent>;
  const mockWorkspaceService = new MockWorkspaceService();
  const mockCoreConfig = { appId: KONQUEST_APP.id };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), KpChatbotComponent],
      providers: [
        { provide: CORE_CONFIG, useValue: mockCoreConfig },
        { provide: WorkspaceService, useValue: mockWorkspaceService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KpChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('setChatbotSrc', () => {
    const cases = [
      { appId: KONQUEST_APP.id, workspaceId: 'another_workspace_id', expectedValue: STANDARD_CHATBOT_SRC },
      {
        appId: KONQUEST_APP.id,
        workspaceId: GO_LEARNING_WORKSPACE_ID,
        expectedValue: CHATBOT_SRC_MAP[GO_LEARNING_WORKSPACE_ID],
      },
      {
        appId: KONQUEST_APP.id,
        workspaceId: QUINTO_ANDAR_WORKSPACE_ID,
        expectedValue: CHATBOT_SRC_MAP[QUINTO_ANDAR_WORKSPACE_ID],
      },
      { appId: 'another_app_id', workspaceId: GO_LEARNING_WORKSPACE_ID, expectedValue: STANDARD_CHATBOT_SRC },
      { appId: 'another_app_id', workspaceId: QUINTO_ANDAR_WORKSPACE_ID, expectedValue: STANDARD_CHATBOT_SRC },
      { appId: 'another_app_id', workspaceId: 'another_workspace_id', expectedValue: STANDARD_CHATBOT_SRC },
    ];

    test.each(cases)(
      'should set chatbotSrc to $expectedValue according to workspaceId $workspaceId',
      ({ appId, workspaceId, expectedValue }, done) => {
        mockWorkspaceService.setWorkspaceId(workspaceId);
        mockCoreConfig.appId = appId;
        fixture.detectChanges();

        component.chatbotSrc$.subscribe((value) => {
          expect(value).toBe(expectedValue);
          done();
        });
      },
    );
  });
});
