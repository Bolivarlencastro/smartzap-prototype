export interface FixtureContent {
  addContentStage: {
    content_type?: string;
    content_type_id: string;
    created_date: string;
    description: string;
    genially_content_type_id: string;
    id: string;
    learn_content_uuid: string;
    mission: string;
    name: string;
    order: string;
    stage: string;
    updated_date: string;
  };
  link: {
    youtube: {
      name: string;
      link: string;
    };
    vimeo: {
      name: string;
      link: string;
    };
    soundcloud: {
      name: string;
      link: string;
    };
    googledrive: {
      doc: {
        name: string;
        link: string;
      };
      sheet: {
        name: string;
        link: string;
      };
      presentation: {
        name: string;
        link: string;
      };
    };
  };
  image: {
    path: string;
    name: string;
    fileName: string;
  };
  video: {
    path: string;
    name: string;
    fileName: string;
  };
  audio: {
    path: string;
    name: string;
    fileName: string;
  };
  docx: {
    path: string;
    name: string;
    fileName: string;
  };
  pdf: {
    path: string;
    name: string;
    fileName: string;
  };
  pptx: {
    path: string;
    name: string;
    fileName: string;
  };
  xls: {
    name: string;
    fileName: string;
  };
  xlsx: {
    path: string;
    name: string;
    fileName: string;
  };
  exam: {
    stage: string;
    title: string;
  };
  genially: {
    time: string;
    link: string;
  };
  exam_questions: {
    exam_question: string;
    id: string;
    options: [
      {
        id: null;
        option: string;
        correct_answer: boolean;
      },
      {
        id: null;
        option: string;
        correct_answer: boolean;
      },
      {
        id: null;
        option: string;
        correct_answer: boolean;
      },
      {
        id: null;
        option: string;
        correct_answer: boolean;
      },
    ];
    points: 5;
    question_type: string;
  };
  statusEnrollment: {
    finish: string;
  };
}
