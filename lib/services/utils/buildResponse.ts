// utils/buildListResponse.ts

import { ListResponse } from "@/types/api";

type BuildResponseData<T> = ListResponse<T> | T;

export function build_response<T>(message: string, data: BuildResponseData<T>) {
  return {
    message,
    data: data,
  };
}
