export const USER_API_URL = "https://functions.poehali.dev/146ab50e-a590-41c0-b1e9-056d65b91709";

export interface User {
  id: number;
  username: string;
  color: string;
  avatar_url: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  user: string;
  color: string;
  text: string;
  created_at: string;
  avatar_url: string;
}

export function userApi(action: string, body: object = {}, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Session-Token"] = token;
  return fetch(USER_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...body }),
  }).then((r) => r.json());
}
