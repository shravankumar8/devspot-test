export interface BaseApiResponse<T> {
  data: T;
  message: string;
}

export interface ListResponse<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
