import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateNotePayload } from "@/lib/api";

interface Draft {
  title: string;
  content: string;
  tag: CreateNotePayload["tag"];
}
const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    }
  )
);

export default useNoteStore;
