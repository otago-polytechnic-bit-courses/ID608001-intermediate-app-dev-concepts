import { getToken } from "./auth";
import { API_BASE_URL } from "./config";

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
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

export interface Studio {
  id: number;
  name: string;
  suburb: string;
  city: string;
  created_at: string;
}

export interface StudioClass {
  id: number;
  studio: number;
  name: string;
  capacity: number;
  // Only present when fetched from /classes/ directly - the ViewSet
  // annotates it there, but the nested `classes` returned by a studio's
  // own detail endpoint goes through an un-annotated manager and won't
  // have it. Derive booked-count from capacity - spaces_left instead of
  // relying on this field, since spaces_left is reliable either way.
  booking_count?: number;
  spaces_left: number;
}

export interface StudioDetail extends Studio {
  classes: StudioClass[];
}

export type BookingStatus = "confirmed" | "waitlisted" | "cancelled";

export interface Booking {
  id: number;
  member_name: string;
  studio_class: number;
  status: BookingStatus;
  booked_at: string;
  attended: boolean;
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

export async function getBookings(): Promise<Booking[]> {
  const response = await apiFetch("/bookings/");

  if (!response.ok) {
    throw new Error("Could not load bookings");
  }

  return response.json();
}

/**
 * Creates a Booking through the through-model endpoint (module 08, section
 * 3), not by patching a many-to-many field. Throws with the API's own
 * message when the UniqueConstraint from section 4 rejects a duplicate.
 */
export async function createBooking(studioClassId: number): Promise<Booking> {
  const response = await apiFetch("/bookings/", {
    method: "POST",
    body: JSON.stringify({ studio_class: studioClassId, status: "confirmed" }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.non_field_errors?.[0] ?? "Could not create booking";
    throw new Error(message);
  }

  return response.json();
}
