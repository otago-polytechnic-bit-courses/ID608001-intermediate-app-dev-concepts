import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./config";

const ACCESS_KEY = "fittrack.access";

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
}

export async function login(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL.replace(/\/api$/, "")}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  const data: { access: string; refresh: string } = await response.json();
  await saveToken(data.access);
}
