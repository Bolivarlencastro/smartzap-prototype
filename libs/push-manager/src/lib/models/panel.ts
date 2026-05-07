export interface PanelViewModel {
  data: PanelData;
  loading: boolean;
}

export interface PanelData {
  summary: SummaryModel;
  upcomingAppointments: AppointmentModel[];
  pushHistory: PushModel[];
}

export interface SummaryModel {
  pushCount: number;
  totalInvestiment: number;
  roiEnrollment: number;
}

export interface AppointmentModel {
  id: string;
  campaign: string;
  date: string;
  contacts: number;
}

export interface PushModel {
  id: string;
  courseName: string;
  date: string;
  pushCount: number;
  totalCost: string;
}
