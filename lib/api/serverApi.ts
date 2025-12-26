import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { Note } from "@/types/note";
import { User } from "@/types/user";

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

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

async function getCookiesHeader() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader;
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

  const cookieHeader = await getCookiesHeader();

  const response = await axios.get<NotesResponse>(`${baseURL}/notes`, {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const cookieHeader = await getCookiesHeader();

  const response = await axios.get<Note>(`${baseURL}/notes/${noteId}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookiesHeader();

  const response = await axios.get<User>(`${baseURL}/users/me`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
}

export async function checkSession(): Promise<AxiosResponse> {
  const cookieHeader = await getCookiesHeader();

  const response = await axios.get(`${baseURL}/auth/session`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response;
}
