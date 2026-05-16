export const API_URL = "https://functions.poehali.dev/19344b39-39c2-40ec-a9b5-ada84b47a266";

export type Tab = "stream" | "schedule" | "donates" | "chat";

export interface StreamStatus {
  is_live: boolean;
  title: string;
  game: string;
  viewers: number;
  stream_key: string;
}

export interface ScheduleRow {
  id: number;
  day: string;
  time: string;
  game: string;
  is_active: boolean;
}

export interface Donate {
  id: number;
  name: string;
  amount: number;
  msg: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatMsg {
  id: number;
  user: string;
  color: string;
  text: string;
  is_hidden: boolean;
  created_at: string;
}

export function api(action: string, token: string, extra: object = {}) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: JSON.stringify({ action, ...extra }),
  }).then((r) => r.json());
}
