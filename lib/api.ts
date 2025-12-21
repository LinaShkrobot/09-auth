import axios from "axios";
import { Note } from "../types/note";

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

const BASE_URL = process.env.NEXT_PUBLIC_NOTEHUB_URL;

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchNotes({
  search,
  tag,
  page = 1,
  perPage,
}: FetchNotesParams = {}): Promise<NotesResponse> {
  const config = {
    params: {
      ...(search && { search }),
      ...(tag && { tag }),
      page,
      ...(perPage && { perPage }),
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const response = await axios.get<NotesResponse>(`${BASE_URL}/notes`, config);
  return response.data;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export async function createNote(payload: CreateNotePayload) {
  const config = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post<Note>(`${BASE_URL}/notes`, payload, config);
  return response.data;
}

export async function deleteNote(noteId: string) {
  const config = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const response = await axios.delete<Note>(
    `${BASE_URL}/notes/${noteId}`,
    config
  );
  return response.data;
}

export async function fetchNoteById(noteId: Note["id"]) {
  const config = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };
  const { data } = await axios.get<Note>(`${BASE_URL}/notes/${noteId}`, config);
  return data;
}
