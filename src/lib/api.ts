export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "")
).replace(/\/$/, "");

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

export const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `API returned ${contentType || "an unexpected response"} (${response.status}). Check NEXT_PUBLIC_API_URL.`
    );
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(`API returned invalid JSON (${response.status}). Check NEXT_PUBLIC_API_URL.`);
  }
};