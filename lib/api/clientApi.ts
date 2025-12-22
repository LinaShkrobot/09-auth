import api from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

interface RegisterPayload {
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface UpdateUserPayload {
  username?: string;
}

export async function fetchNotes({
  search,
  tag,
  page = 1,
  perPage = 12,
}: FetchNotesParams = {}): Promise<NotesResponse> {
  const params = {
    ...(search && { search }),
    ...(tag && { tag }),
    page,
    perPage,
  };

  const response = await api.get<NotesResponse>("/notes", { params });
  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const response = await api.post<User>("/auth/register", payload);
  return response.data;
}

export async function login(payload: LoginPayload): Promise<User> {
  const response = await api.post<User>("/auth/login", payload);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<boolean> {
  try {
    const response = await api.get<{ success: boolean }>("/auth/session");
    return response.data.success;
  } catch (error) {
    return false;
  }
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(payload: UpdateUserPayload): Promise<User> {
  const response = await api.patch<User>("/users/me", payload);
  return response.data;
}
