# Quiz Creation Flow — Konquest Application

> Research document for DEV-34143 (quiz v2 library scaffolding). Describes how quizzes are currently created across all three entry points.

---

## Key Entry Points

Quiz creation happens in three distinct contexts, but all three share the same underlying `KpQuizDialogComponent` and the same API endpoint pattern.

---

## Entry Point 1: Channel Detail — Create Pulse Quiz

**Effects file:** `apps/konquest-web/src/app/main/channel/pages/detail/store/effects/channel-detail-pulses.effects.ts`
**Actions file:** `apps/konquest-web/src/app/main/channel/pages/detail/store/actions/channel-detail-pulses.actions.ts`
**Service:** `apps/konquest-web/src/app/main/channel/pages/detail/channel-detail.service.ts`

### Action chain

```
User clicks "Create Pulse"
  → openPulseCreateDialog  (user action)
  → openPulseCreateDialog$ effect
      Opens content-type dialog via ChannelDetailService.openPulseCreateDialog()
      If contentFormData.type === 'QUIZ':
        dispatch openPulseQuizForm { name, channelId }

  → openPulseQuizForm$ effect (line 92–114)
      Calls ChannelDetailService.openQuizForm(name)
      Opens KpQuizDialogComponent (disableClose: true)
      On close with quiz data:
        payload = QuizService.buildPulseQuiz(quiz)
        dispatch addPulseQuiz { payload, id: channelId }

  → addPulseQuiz$ effect (line 116–129)
      Calls ChannelAPI.postPulseQuiz(payload, channelId)
      → POST /channels/{channelId}/pulses/exams
      On success: dispatch addPulseQuizSuccess

  → addPulseQuizSuccess$ effect (line 131–141)
      Gets channel detail from store
      Builds PulseCardDto
      dispatch createNewPulseUploadSuccess  →  UI list updated
```

### Data transformation — `QuizService.buildPulseQuiz(quiz)`

```
Input:  quiz { title, questions: UntypedFormGroup[] }
Output: PulseRequest {
  name: quiz.title,
  exam: {
    title: quiz.title,
    questions: [
      {
        id,
        exam_question: question.name,
        points: 5,
        question_type: 'correct_choices',
        options: [{ id, option: text, correct_answer: boolean }]
      }
    ]
  }
}
```

---

## Entry Point 2: Channel Pulses Management

**Effects file:** `apps/konquest-web/src/app/main/channel-pulses-management/store/effects/channel-pulses-management.effects.ts`
**Actions file:** `apps/konquest-web/src/app/main/channel-pulses-management/store/actions/channel-pulses-management.actions.ts`
**Service:** `apps/konquest-web/src/app/main/channel-pulses-management/services/channel-pulses-create.service.ts`

### Action chain

```
User initiates pulse creation
  → createPulse  (action)
  → openPulseCreateDialog$ effect (line 117–136)
      Opens content-type dialog
      If type === 'QUIZ':
        dispatch openPulseQuizForm

  → openPulseQuizForm$ effect (line 150–171)
      Calls ChannelPulsesCreateService.openQuizForm(name)
      Opens KpQuizDialogComponent { title: name, isEditing: false }
      On close with quiz data:
        dispatch addPulseQuiz { payload, channelId }

  → addPulseQuiz$ effect (line 173–184)
      Calls ChannelPulsesCreateService.postPulseQuiz(payload, channelId)
        → delegates to ChannelAPI.postPulseQuiz(payload, channelId)
        → POST /channels/{channelId}/pulses/exams
      On success: dispatch createPulseSuccess

  → reloadAfterMutation$ effect (line 186–197)
      On createPulseSuccess: dispatch loadPulses()  →  list refreshed
```

---

## Entry Point 3: Mission Create — Stage Quiz

**Effects file:** `apps/konquest-web/src/app/main/mission/pages/mission-create/store/effects/stages.effects.ts`
**Actions file:** `apps/konquest-web/src/app/main/mission/pages/mission-create/store/actions/content.actions.ts`
**Service:** `apps/konquest-web/src/app/main/mission/pages/mission-create/services/content-create.service.ts`

### Action chain

```
User triggers quiz creation on a stage
  → openQuizForm { stage, result: ContentFormData, question }  (action)
  → openQuizForm$ effect (line 160–177)
      Calls ContentCreateService.openQuizForm(result.name)
      Opens KpQuizDialogComponent { title: name }
      Maps dialog result to:
        dispatch createQuiz { stageId, order, content, quiz }

  → createQuiz$ effect (line 179–199)
      Step 1: ContentCreateService.createExam(stageId, order, content)
              → Creates exam as MissionStageContent
              → Returns { learn_content_uuid }   ← this is the quiz/exam ID
      Step 2: For each question in quiz:
              MissionExamService.createExamQuestion(learn_content_uuid, question)
              Transforms via ContentCreateService.buildQuizQuestion(question)
      Step 3: dispatch createQuizSuccess

  → createQuizSuccess effect (line 201–206)
      dispatch MissionStageActions.loadStages()  →  UI refreshed
```

### Data transformation — `ContentCreateService.buildQuizQuestion(question)` (line 70–82)

```
Input:  UntypedFormGroup
Output: Question {
  id: string,
  exam_question: string,
  points: '5',
  question_type: 'correct_choices',
  options: [{ id, option: text, correct_answer: boolean }]
}
```

### Key difference from channel flow

The mission flow is **two-step**: first create the exam container (`createExam`), get back a `learn_content_uuid`, then POST each question individually. Channel flows send everything in a single payload.

---

## Quiz Library (`libs/quiz`) — Current State

**Providers:** `libs/quiz/src/lib/quiz.providers.ts`  
**Actions:** `libs/quiz/src/lib/store/quiz/quiz.actions.ts`  
**Effects:** `libs/quiz/src/lib/store/quiz/quiz.effects.ts`  
**Dialog component:** `libs/quiz/src/lib/components/create-quiz-dialog/create-quiz-dialog.component.ts`  
**Dialog service:** `libs/quiz/src/lib/services/create-quiz-dialog/create-quiz-dialog.service.ts`

The library currently implements only the **first step** of a quiz creation wizard:

```
dispatch openCreateQuizDialog
  → openCreateQuizDialog$ effect
      Calls CreateQuizDialogService.open()
      Opens CreateQuizDialogComponent (2-step wizard)
        Step 1: Select type → 'assessment' | 'research'
        Step 2: Select creation method → 'manual' | 'ai_assisted'
      On submit: dispatch createQuizDialogCompleted { quizType, creationMethod }
      On cancel: dispatch createQuizDialogCancelled
```

This dialog result does **not yet** trigger any API call — the next steps (building form, calling API) are not yet implemented in the library.

---

## Shared Components Involved

| Component                   | Path                                                                        | Role                                                                    |
| --------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `KpQuizDialogComponent`     | `apps/konquest-web/src/app/shared/components/kp-components/kp-quiz-dialog/` | The quiz question builder dialog (existing, used by all 3 entry points) |
| `CreateQuizDialogComponent` | `libs/quiz/src/lib/components/create-quiz-dialog/`                          | New type/method selector dialog (in quiz library)                       |
| `KpQuizFormComponent`       | `libs/shared-ui/ui/src/lib/components/kp-quiz-form/`                        | Reusable quiz form UI                                                   |
| `KpQuizComponent`           | `libs/shared-ui/ui/`                                                        | Quiz rendering                                                          |

---

## API Endpoints

| Endpoint                           | Method | Context                            | Response                        |
| ---------------------------------- | ------ | ---------------------------------- | ------------------------------- |
| `POST /channels/{id}/pulses/exams` | POST   | Channel detail + pulses management | Pulse with `learn_content_uuid` |
| `POST /exams/{examId}/questions`   | POST   | Mission stage (per question)       | Question object                 |
| `GET /exams/{examId}`              | GET    | Fetch exam                         | `CourseExam`                    |
| `GET /exams/{examId}/questions`    | GET    | Fetch questions                    | `Pagination<Question>`          |
| `POST /exams/{examId}/answers`     | POST   | Submit answer                      | `Answer`                        |

**Core API service:** `libs/core/src/lib/konquest-sdk/apis/course-exams-api.service.ts` (`CourseExamsApi`)

---

## Core Models

**Source:** `libs/core/src/lib/konquest-sdk/models/exam.models.ts`

```typescript
CourseExam { id, title, correct_answer, stage, channel, pulse, questions, user_answers }
Question    { id, exam_question, question_type, points, options: QuestionOption[] }
QuizQuestion { id?, title, name, options: QuizOption[] }   // form-layer model
QuizOption   { id?, correct, text, selected? }
Answer       { id, correct_options, options, is_ok, exam_has_question, user, exam }
QuestionType = 'correct_choices' | 'correct_essay' | 'correct_fill_the_blank_order'
```

---

## ID Generation

- **Quiz/Exam ID** (`learn_content_uuid`): Always generated by backend. Frontend receives it in the API response.
- **Channel association**: Via `channelId` in the API call URL.
- **Stage association**: Via `stageId` passed to `createExam()`.
- **Pulse association**: Via the returned `Pulse` object that contains `learn_content_uuid`.

---

## Critical Observations for Quiz v2 Library Work

1. **Three isolated, duplicated flows** exist today — each feature has its own service + effects for quiz creation. The v2 library should consolidate this.

2. **`KpQuizDialogComponent`** (in app/shared) is the existing full quiz builder. The new `CreateQuizDialogComponent` (in the library) is a lighter upstream selector for type + creation method.

3. **The library's `openCreateQuizDialog` action** is the natural integration point: after type/method selection, the library (or the consuming effect) should open the actual quiz builder and call the appropriate API.

4. **Two API patterns** need to be supported:
   - Single payload (channel): build full quiz object → one POST
   - Two-step (mission): create exam first → POST each question individually

5. **`QuizService.buildPulseQuiz()`** and **`ContentCreateService.buildQuizQuestion()`** are the existing transform utilities; the library may want to centralize these.
