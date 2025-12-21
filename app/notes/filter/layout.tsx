import { ReactNode } from "react";
import css from "./LayoutNotes.module.css";

type Props = {
  sidebar: ReactNode;
  children: ReactNode;
};

const NotesLayout = ({ sidebar, children }: Props) => {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
};

export default NotesLayout;
