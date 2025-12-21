import { Note } from "@/types/note";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  note: Note;
}

export default function NotePreview({ note }: NotePreviewProps) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>
        <p className={css.content}>{note.content}</p>
        <div className={css.date}>
          <div>Created: {new Date(note.createdAt).toLocaleDateString()}</div>
          <div>Updated: {new Date(note.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
