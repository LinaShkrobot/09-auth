import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawTag = slug[0];
  const displayTag =
    rawTag === "all"
      ? "All Notes"
      : rawTag.charAt(0).toUpperCase() + rawTag.slice(1).toLowerCase();

  return {
    title: `${displayTag} - NoteHub`,
    description: `Browse and manage ${displayTag.toLowerCase()} notes`,
    openGraph: {
      title: `${displayTag} - NoteHub`,
      description: `Browse and manage ${displayTag.toLowerCase()} notes`,
      url: `http://localhost:3000/notes/filter/${rawTag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub - Smart note organization",
        },
      ],
      type: "website",
    },
  };
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;
  const rawTag = slug[0];
  const normalizedTag =
    rawTag === "all"
      ? undefined
      : rawTag.charAt(0).toUpperCase() + rawTag.slice(1).toLowerCase();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", normalizedTag, 1, ""],
    queryFn: () =>
      fetchNotes({ tag: normalizedTag, page: 1, perPage: 12, search: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={normalizedTag} />
    </HydrationBoundary>
  );
}
