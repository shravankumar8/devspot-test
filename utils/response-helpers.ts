import { NextResponse } from "next/server";

export function successResponse<T = any>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}
