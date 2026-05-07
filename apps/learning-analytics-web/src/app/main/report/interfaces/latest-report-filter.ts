export interface LatestReportFilter {
  user_creator_name__ilike?: string;
  user_creator_id?: string;
  created__gte?: string;
  created__lte?: string;
  status__in?: string[];
  page?: number;
  per_page?: number;
  sort?: LatestReportsFilterSort;
}

export enum LatestReportsFilterSort {
  CREATION_DATE_ASC = 'created',
  CREATION_DATE_DESC = '-created',
}
