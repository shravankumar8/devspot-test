import axios from "axios";
import { useEffect, useRef } from "react";
import useSWRInfinite, { SWRInfiniteKeyedMutator } from "swr/infinite";

// shape of a paginated response
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UseInfiniteScrollResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  totalCount: number;
  mutate?: SWRInfiniteKeyedMutator<PaginatedResponse<T>[]>;
  error: any;
}

/**
 * A generic infinite scroll hook built on SWR and IntersectionObserver.
 * @param endpoint base URL (e.g. "/api/items")
 * @param pageSize  number of items per page (default: 10)
 * @param search_term search term to filter items by
 */
export function useInfiniteScroll<T>(
  endpoint: string,
  pageSize = 10,
  search_term?: string
): UseInfiniteScrollResult<T> {
  const getKey = (pageIndex: number, prev: PaginatedResponse<T> | null) =>
    prev && !prev.hasNextPage
      ? null
      : `${endpoint}?page=${pageIndex + 1}&page_size=${pageSize}${
          search_term ? `&search_term=${encodeURIComponent(search_term)}` : ""
        }`;

  const {
    data: pages,
    error,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite<PaginatedResponse<T>>(
    getKey,
    (url) => axios.get(url).then((r) => r.data.data as PaginatedResponse<T>),
    {
      onErrorRetry: () => {}, // disable SWR retries
    }
  );

  const data = pages ? pages.flatMap((p) => p.items) : [];
  const isLoading = !error && !pages;
  const isLoadingMore =
    isLoading ||
    (size > 0 && pages !== undefined && pages[size - 1] === undefined);
  const isReachingEnd = pages ? !pages[pages.length - 1].hasNextPage : false;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || isReachingEnd || error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isValidating && !error) {
          setSize(size + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, isReachingEnd, isValidating, size, error]);

  return {
    data,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMoreRef,
    totalCount: pages?.[0]?.totalItems ?? 0,
    mutate,
    error,
  };
}
