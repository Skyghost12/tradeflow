import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiSearch, FiTrash2, FiFolder, FiTag } from "react-icons/fi";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import Input from "../components/UI/Input";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import { getNotes, createNote, updateNote, deleteNote } from "../services/noteService";
import { formatDate } from "../utils/format";
import "./Notes.css";

const Notes = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", folder: "Uncategorized", tags: "" });

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", { search, activeFolder }],
    queryFn: () => getNotes({ search: search || undefined, folder: activeFolder || undefined }),
  });

  const folders = [...new Set(notes.map((n) => n.folder))];

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", content: "", folder: "Uncategorized", tags: "" });
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setForm({ ...note, tags: note.tags.join(", ") });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      content: form.content,
      folder: form.folder || "Uncategorized",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editing) updateMutation.mutate({ id: editing._id, payload });
    else createMutation.mutate(payload);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm("Delete this note?")) deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="notes-page">
      <aside className="notes-page__sidebar">
        <button
          className={`notes-page__folder ${!activeFolder ? "notes-page__folder--active" : ""}`}
          onClick={() => setActiveFolder("")}
        >
          <FiFolder /> All notes
        </button>
        {folders.map((folder) => (
          <button
            key={folder}
            className={`notes-page__folder ${activeFolder === folder ? "notes-page__folder--active" : ""}`}
            onClick={() => setActiveFolder(folder)}
          >
            <FiFolder /> {folder}
          </button>
        ))}
      </aside>

      <div className="notes-page__main">
        <div className="notes-page__toolbar">
          <div className="journal__search">
            <FiSearch />
            <input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button icon={FiPlus} onClick={openCreate}>New note</Button>
        </div>

        {notes.length === 0 ? (
          <EmptyState title="No notes yet" message="Capture ideas, lessons, and observations here." />
        ) : (
          <div className="notes-page__grid">
            {notes.map((note) => (
              <Card key={note._id} hoverable className="note-card" onClick={() => openEdit(note)}>
                <div className="note-card__head">
                  <h4>{note.title}</h4>
                  <button onClick={(e) => handleDelete(note._id, e)} aria-label="Delete"><FiTrash2 /></button>
                </div>
                <p className="note-card__preview">{note.content?.slice(0, 140) || "No content"}</p>
                <div className="note-card__footer">
                  <span>{formatDate(note.updatedAt)}</span>
                  {note.tags.length > 0 && (
                    <span className="note-card__tags"><FiTag /> {note.tags.join(", ")}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit note" : "New note"} width="640px">
        <form className="note-form" onSubmit={handleSubmit}>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <div className="input-group">
            <label className="input-group__label">Content</label>
            <div className="input-group__field">
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write freely — lessons, observations, plans..."
              />
            </div>
          </div>
          <div className="note-form__row">
            <Input
              label="Folder"
              value={form.folder}
              onChange={(e) => setForm((f) => ({ ...f, folder: e.target.value }))}
            />
            <Input
              label="Tags (comma-separated)"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
          </div>
          <div className="trade-form__actions">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save note</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notes;
