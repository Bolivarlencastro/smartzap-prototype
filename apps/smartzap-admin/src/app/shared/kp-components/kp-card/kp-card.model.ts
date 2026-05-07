export interface KpCardModel {
  id: string;
  title: string;
  description: string;
  stages: number;
  rating: number;
  duration: string;
  image: string;
  createdAt: Date;
  views: number;
  updatedAt: Date;
  bookmark_id: string;
  tags: string[];
  progress: number;
  avatarName: string;
  avatarImage: string;
  status: string;
  goalDate: Date;
  summaries: Array<KpCardSummaryModel>;
  cardStatus?: KpCardStatus;
  categories?: string[];
}

export interface KpCardSummaryModel {
  icon: string;
  value: string | number;
  label: string;
  svgIcon?: boolean;
  iconClass?: boolean;
}
export interface KpCardStatus {
  label: string;
  color: string;
}
