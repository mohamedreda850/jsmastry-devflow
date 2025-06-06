import { ActionResponse } from "@/types/global";
import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http-errors";

interface FetchOptions extends RequestInit {
  timeout?: number;
}
function isError(error: unknown): error is Error {
  return error instanceof Error;
}
export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {
    timeout = 100000,
    headers: customHeaders = {},
    ...restOptions
  } = options;
  const controler = new AbortController();
  const id = setTimeout(() => controler.abort(), timeout);
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controler.signal,
  };
  try {
    const response = await fetch(url, config);
    clearTimeout(id);
    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error:${response.status}`);
    }
    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");
    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out after ${timeout}ms`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }
    return handleError(error) as ActionResponse<T>;
  }
}
