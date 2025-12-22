"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, CreateNotePayload } from "@/lib/api/clientApi";
import { toast } from "react-hot-toast";
import useNoteStore from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();
  const { title, content, tag } = draft;

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    tag: "",
  });

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      onCancel();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const validateForm = (): boolean => {
    const newErrors = { title: "", content: "", tag: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Required";
      isValid = false;
    } else if (title.length < 3) {
      newErrors.title = "Too short";
      isValid = false;
    } else if (title.length > 50) {
      newErrors.title = "Too long";
      isValid = false;
    }

    if (content.length > 500) {
      newErrors.content = "Too long";
      isValid = false;
    }

    if (!tag) {
      newErrors.tag = "Required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: CreateNotePayload = {
      title: title.trim(),
      content: content.trim(),
      tag,
    };

    mutation.mutate(payload);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={title}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={content}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={(e) =>
            setDraft({ tag: e.target.value as CreateNotePayload["tag"] })
          }
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
