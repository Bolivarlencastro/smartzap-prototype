export interface ApiResponse<T> {
  data: {
    count: number;
    page: number;
    result: T[];
  };
}
