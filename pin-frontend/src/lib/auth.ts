/**
 * Frontend auth utilities. Authentication credentials stay in HttpOnly cookies;
 * only non-sensitive display data is cached in localStorage.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

// ⚠️ DEMO MODE: Set to true to bypass login/register pages entirely
export const DEMO_MODE = false;

// Local mock mode must be explicitly enabled and can never be enabled in production.
export const TEST_MODE = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_TEST_MODE === "true";

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: "STUDENT" | "CLIENT" | "STAFF" | "ADMIN";
  date_joined?: string;
  created_at?: string;
}

let csrfToken: string | null = null;

// Kept as no-op adapters while older portal components migrate away from bearer tokens.
export function saveTokens(_tokens: { access: string; refresh: string }) {}
export function getAccessToken(): string | null { return null; }
export function getRefreshToken(): string | null { return null; }

export function clearTokens() {
  localStorage.removeItem("pin_access");
  localStorage.removeItem("pin_refresh");
  localStorage.removeItem("pin_user");
  csrfToken = null;
}

export function saveUser(user: AuthUser) {
  const normalized = {
    ...user,
    phone_number: user.phone_number ?? "",
    date_joined: user.date_joined ?? user.created_at ?? new Date().toISOString(),
  };
  localStorage.setItem("pin_user", JSON.stringify(normalized));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("pin_user");
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

async function getCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  try {
    const response = await fetch(`${API_BASE}/api/v1/auth/csrf`, { credentials: "include", cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json() as { csrf_token: string };
    csrfToken = data.csrf_token;
    return csrfToken;
  } catch {
    return null;
  }
}

/* ─── Authenticated fetch ───────────────────────────── */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const isPublicAuth = path === "/api/v1/auth/login" || path === "/api/v1/auth/register";
  if (!isPublicAuth && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const token = await getCsrfToken();
    if (token) headers.set("X-CSRF-Token", token);
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, method, headers, credentials: "include" });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    if (res.status === 401) clearTokens();
    throw Object.assign(new Error("API_ERROR"), { status: res.status, body: errBody });
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiDownload(path: string, filename: string): Promise<void> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    if (response.status === 401) clearTokens();
    throw Object.assign(new Error("DOWNLOAD_ERROR"), { status: response.status, body: errorBody });
  }
  const objectUrl = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/* ─── Auth API calls ────────────────────────────────── */
export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser }> {
  const user = await apiFetch<AuthUser>(
    "/api/v1/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
  saveUser(user);
  csrfToken = null;
  await getCsrfToken();
  return { user };
}

export async function register(payload: {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: "STUDENT" | "CLIENT";
}): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Exchange a Google ID token (from Google Identity Services) for PIN JWT tokens.
 * The backend verifies the token with Google, then creates or signs in the account.
 *
 * @param credential  The ID token string returned by Google's signIn callback
 * @param role        Only used when creating a NEW account (default: STUDENT)
 */
export async function googleAuth(
  credential: string,
  role: "STUDENT" | "CLIENT" = "STUDENT",
): Promise<{ user: AuthUser; access: string; refresh: string; created: boolean }> {
  const data = await apiFetch<{
    access: string;
    refresh: string;
    user: AuthUser;
    created: boolean;
  }>(
    "/api/v1/auth/google",
    { method: "POST", body: JSON.stringify({ credential, role }) },
  );
  saveTokens({ access: data.access, refresh: data.refresh });
  saveUser(data.user);
  return data;
}

export async function logout(_refresh?: string) {
  await apiFetch("/api/v1/auth/logout", {
    method: "POST",
  }).catch(() => {});
  clearTokens();
}

/* ─── Role-based portal redirect ───────────────────── */
export function portalHomeForRole(role: AuthUser["role"]): string {
  switch (role) {
    case "STUDENT": return "/portal/student";
    case "CLIENT":  return "/portal/client";
    case "STAFF":
    case "ADMIN": return "/admin/dashboard";
    default:        return "/portal/training";
  }
}
