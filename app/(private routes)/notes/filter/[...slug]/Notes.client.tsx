"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Link from "next/link";
interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const perPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", tag, page, debouncedSearch],
    queryFn: () => fetchNotes({ tag, page, perPage, search: debouncedSearch }),
  });

  const notes = data?.notes ?? [];

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <div>
      <header>
        <SearchBox value={search} onChange={setSearch} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create">Create note +</Link>
      </header>

      <h1>Notes List</h1>
      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
