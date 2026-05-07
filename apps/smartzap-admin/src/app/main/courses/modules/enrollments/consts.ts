export enum ActionType {
  GENERATE = 'GENERATE',
  DOWNLOAD = 'DOWNLOAD',
  APPROVE = 'APPROVE',
  RESTART = 'RESTART',
  DELETE = 'DELETE',
  EXTEND = 'EXTEND',
  REPROVE = 'REPROVE',
  HISTORIC = 'HISTORIC',
  EXTERNAL = 'EXTERNAL',
  APPROVE_CERTIFICATE = 'APPROVE_CERTIFICATE',
  REJECT_CERTIFICATE = 'REJECT_CERTIFICATE',
  DETAIL = 'DETAIL',
}

export enum EnrollmentStatuses {
  STARTED = 'STARTED',
  REFUSED = 'REFUSED',
  WAITING = 'WAITING',
}

export const ENROLLMENT_STATUS_COLORS: Record<string, string> = {
  STARTED: '#293D98',
  REFUSED: '#E4524D',
  WAITING: '#FFB100',
};

export const GetEnrollmentStatusColor = (status: string): string => {
  return ENROLLMENT_STATUS_COLORS[status] || '#CCC';
};
