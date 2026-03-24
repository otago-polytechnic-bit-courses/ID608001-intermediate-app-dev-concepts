interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export type { PaginationResult };