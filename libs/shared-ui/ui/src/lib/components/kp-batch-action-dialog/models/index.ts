import { BatchAction } from '@keeps-platform-frontend-workspace/kp-keeps';

export type BatchActionDialogStep = 'initial' | 'submit';

export interface BatchActionDialogModel {
  action: BatchAction;
  total: number;
}

export interface BatchActionDialogConfig {
  id: BatchAction;
  title: string;
  initialStep: InitialStep;
  submitStep: SubmitStep;
}

interface InitialStep {
  subtitle: string;
  positiveButtonLabel: string;
  inputLabel?: string;
  inputIcon?: string;
  options?: string;
}

interface SubmitStep {
  subtitle: string;
  inputLabel: string;
}

export const DIALOG_CONFIG: Partial<Record<BatchAction, BatchActionDialogConfig>> = {
  APPROVE_ENROLLMENT: {
    id: 'APPROVE_ENROLLMENT',
    title: 'UI.BATCH_ACTIONS.DIALOG.APPROVE_ENROLLMENT.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.APPROVE_ENROLLMENT.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.APPROVE_ENROLLMENT.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.APPROVE_ENROLLMENT.INITIAL_STEP.INPUT_LABEL',
      inputIcon: 'school',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.APPROVE_ENROLLMENT.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.APPROVE_ENROLLMENT.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  RESTART_ENROLLMENT: {
    id: 'RESTART_ENROLLMENT',
    title: 'UI.BATCH_ACTIONS.DIALOG.RESTART_ENROLLMENT.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.RESTART_ENROLLMENT.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.RESTART_ENROLLMENT.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.RESTART_ENROLLMENT.INITIAL_STEP.INPUT_LABEL',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.RESTART_ENROLLMENT.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.RESTART_ENROLLMENT.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  RE_ENROLL_ENROLLMENT: {
    id: 'RE_ENROLL_ENROLLMENT',
    title: 'UI.BATCH_ACTIONS.DIALOG.RE_ENROLL_ENROLLMENT.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.RE_ENROLL_ENROLLMENT.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.RE_ENROLL_ENROLLMENT.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.RE_ENROLL_ENROLLMENT.INITIAL_STEP.INPUT_LABEL',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.RE_ENROLL_ENROLLMENT.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.RE_ENROLL_ENROLLMENT.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  DELETE_ENROLLMENT: {
    id: 'DELETE_ENROLLMENT',
    title: 'UI.BATCH_ACTIONS.DIALOG.DELETE_ENROLLMENT.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.DELETE_ENROLLMENT.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.DELETE_ENROLLMENT.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.DELETE_ENROLLMENT.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.DELETE_ENROLLMENT.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  REJECT_CERTIFICATE: {
    id: 'REJECT_CERTIFICATE',
    title: 'UI.BATCH_ACTIONS.DIALOG.REJECT_CERTIFICATE.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.REJECT_CERTIFICATE.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.REJECT_CERTIFICATE.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.REJECT_CERTIFICATE.INITIAL_STEP.INPUT_LABEL',
      inputIcon: 'edit',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.REJECT_CERTIFICATE.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.REJECT_CERTIFICATE.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  GOAL_DATE_ENROLLMENT: {
    id: 'GOAL_DATE_ENROLLMENT',
    title: 'UI.BATCH_ACTIONS.DIALOG.GOAL_DATE_ENROLLMENT.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.GOAL_DATE_ENROLLMENT.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.GOAL_DATE_ENROLLMENT.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.GOAL_DATE_ENROLLMENT.INITIAL_STEP.INPUT_LABEL',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.GOAL_DATE_ENROLLMENT.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.GOAL_DATE_ENROLLMENT.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  INVITE_USERS: {
    id: 'INVITE_USERS',
    title: 'UI.BATCH_ACTIONS.DIALOG.INVITE_USERS.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.INVITE_USERS.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.INVITE_USERS.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.INVITE_USERS.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.INVITE_USERS.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  ACTIVATE_USERS: {
    id: 'ACTIVATE_USERS',
    title: 'UI.BATCH_ACTIONS.DIALOG.ACTIVATE_USERS.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.ACTIVATE_USERS.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.ACTIVATE_USERS.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.ACTIVATE_USERS.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.ACTIVATE_USERS.SUBMIT_STEP.INPUT_LABEL',
    },
  },
  DEACTIVATE_USERS: {
    id: 'DEACTIVATE_USERS',
    title: 'UI.BATCH_ACTIONS.DIALOG.DEACTIVATE_USERS.TITLE',
    initialStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.DEACTIVATE_USERS.INITIAL_STEP.SUBTITLE',
      positiveButtonLabel: 'UI.BATCH_ACTIONS.DIALOG.DEACTIVATE_USERS.INITIAL_STEP.POSITIVE_BUTTON_LABEL',
    },
    submitStep: {
      subtitle: 'UI.BATCH_ACTIONS.DIALOG.DEACTIVATE_USERS.SUBMIT_STEP.SUBTITLE',
      inputLabel: 'UI.BATCH_ACTIONS.DIALOG.DEACTIVATE_USERS.SUBMIT_STEP.INPUT_LABEL',
    },
  },
};

export const REFERENCE_VALUE_CONFIG: Partial<Record<BatchAction, Record<string, string>>> = {
  APPROVE_ENROLLMENT: {
    en: 'complete',
    es: 'finalizar',
    'pt-BR': 'finalizar',
    'pt-PT': 'finalizar',
  },
  RESTART_ENROLLMENT: {
    en: 'restart',
    es: 'reiniciar',
    'pt-BR': 'reiniciar',
    'pt-PT': 'reiniciar',
  },
  RE_ENROLL_ENROLLMENT: {
    en: 're-enroll',
    es: 'rematricular',
    'pt-BR': 'rematricular',
    'pt-PT': 'rematricular',
  },
  DELETE_ENROLLMENT: {
    en: 'delete',
    es: 'eliminar',
    'pt-BR': 'excluir',
    'pt-PT': 'excluir',
  },
  REJECT_CERTIFICATE: {
    en: 'reject',
    es: 'rechazar',
    'pt-BR': 'rejeitar',
    'pt-PT': 'rejeitar',
  },
  GOAL_DATE_ENROLLMENT: {
    en: 'set target date',
    es: 'establecer fecha objetivo',
    'pt-BR': 'definir data meta',
    'pt-PT': 'definir data meta',
  },
  INVITE_USERS: {
    en: 'send',
    es: 'enviar',
    'pt-BR': 'enviar',
    'pt-PT': 'enviar',
  },
  ACTIVATE_USERS: {
    en: 'activate',
    es: 'activar',
    'pt-BR': 'ativar',
    'pt-PT': 'ativar',
  },
  DEACTIVATE_USERS: {
    en: 'deactivate',
    es: 'desactivar',
    'pt-BR': 'desativar',
    'pt-PT': 'desativar',
  },
};

export const ACTION_PARAMS = new Map<BatchAction, (value: any) => Record<string, any>>([
  ['APPROVE_ENROLLMENT', (value) => ({ performance: value * 0.01 })],
  ['REJECT_CERTIFICATE', (value) => ({ reject_approve: value, approved: false })],
  ['RESTART_ENROLLMENT', (value) => ({ goal_date: value })],
  ['RE_ENROLL_ENROLLMENT', (value) => ({ goal_date: value })],
  ['GOAL_DATE_ENROLLMENT', (value) => ({ new_goal_date: value })],
  ['ACTIVATE_USERS', () => ({ status: true })],
  ['DEACTIVATE_USERS', () => ({ status: false })],
]);
