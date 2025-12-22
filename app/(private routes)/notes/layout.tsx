import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function NotesLayout({ children }: Props) {
  return <>{children}</>;
}
