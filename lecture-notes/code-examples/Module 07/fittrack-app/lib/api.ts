import { getToken } from "./auth";
import { API_BASE_URL } from "./config";

async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

export interface StudioClass {
  id: number;
  studio: number;
  name: string;
}

export interface Studio {
  id: number;
  name: string;
  suburb: string;
  city: string;
  created_at: string;
}

export interface StudioDetail extends Studio {
  classes: StudioClass[];
}

export async function getStudios(): Promise<Studio[]> {
  const response = await apiFetch("/studios/");

  if (!response.ok) {
    throw new Error("Could not load studios");
  }

  return response.json();
}

export async function getStudio(id: string): Promise<StudioDetail> {
  const response = await apiFetch(`/studios/${id}/`);

  if (!response.ok) {
    throw new Error("Could not load studio");
  }

  return response.json();
}

export async function createStudio(
  studio: Omit<Studio, "id" | "created_at">,
): Promise<Studio> {
  const response = await apiFetch("/studios/", {
    method: "POST",
    body: JSON.stringify(studio),
  });

  if (!response.ok) {
    throw new Error("Could not create studio");
  }

  return response.json();
}
