export interface FetchTransfersParams {
  page: number;
  per_page: number;
  search?: string;
  ordering?: string;
  source?: string;
  receiver?: string;
  date?: string;
  owner?: string;
  action?: string;
}
