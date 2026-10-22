/**
 * Frontend auth utilities.
 * Stores JWT tokens in localStorage (access + refresh).
 * All API calls go through apiFetch() which attaches the Bearer token
 * and automatically refreshes on 401.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ⚠️ DEMO MODE: Set to true to bypass login/register pages entirely
export const DEMO_MODE = false;

// ⚠️ TEST MODE: Set to true to show login/register but accept any input without validation
export const TEST_MODE = true;

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: "STUDENT" | "CLIENT" | "STAFF";
  date_joined: string;
}

/* ─── Token storage (browser-only) ──────────────────── */
export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem("pin_access",  tokens.access);
  localStorage.setItem("pin_refresh", tokens.refresh);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pin_access");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pin_refresh");
}

export function clearTokens() {
  localStorage.removeItem("pin_access");
  localStorage.removeItem("pin_refresh");
  localStorage.removeItem("pin_user");
}

export function saveUser(user: AuthUser) {
  localStorage.setItem("pin_user", JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("pin_user");
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

/* ─── Token refresh ─────────────────────────────────── */
async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/login/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) { clearTokens(); return null; }
    const data = await res.json() as { access: string };
    localStorage.setItem("pin_access", data.access);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

/* ─── Authenticated fetch ───────────────────────────── */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) return apiFetch<T>(path, options, false);
    throw new Error("SESSION_EXPIRED");
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw Object.assign(new Error("API_ERROR"), { status: res.status, body: errBody });
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/* ─── Auth API calls ────────────────────────────────── */
export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; access: string; refresh: string }> {
  const data = await apiFetch<{ access: string; refresh: string; user: AuthUser }>(
    "/api/auth/login/",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false,
  );
  saveTokens({ access: data.access, refresh: data.refresh });
  saveUser(data.user);
  return data;
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
  return apiFetch<AuthUser>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
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
    "/api/auth/google/",
    { method: "POST", body: JSON.stringify({ credential, role }) },
    false,
  );
  saveTokens({ access: data.access, refresh: data.refresh });
  saveUser(data.user);
  return data;
}

export async function logout(refresh: string) {
  await apiFetch("/api/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  }).catch(() => {});
  clearTokens();
}

/* ─── Role-based portal redirect ───────────────────── */
export function portalHomeForRole(role: AuthUser["role"]): string {
  switch (role) {
    case "STUDENT": return "/portal/student";
    case "CLIENT":  return "/portal/client";
    case "STAFF":   return "/admin-portal";
    default:        return "/portal/training";
  }
}
