import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { fetchNoteById } from "../../../lib/api";
import NoteDetails from "./NoteDetails.client";
import type { Metadata } from "next";
interface NoteProp {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteProp): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title} - NoteHub`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `${note.title} - NoteHub`,
      description: note.content.slice(0, 100),
      url: `http://localhost:3000/notes/${id}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: "article",
    },
  };
}

async function Note({ params }: NoteProp) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails />
    </HydrationBoundary>
  );
}

export default Note;
