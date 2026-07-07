import { useState, useEffect } from "react";
import { getAllNotes, createNote, updateNote, deleteNote } from "../api/notes";

function emptyForm() {
  return { title: "", content: "", topic: "" };
}

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  function loadNotes() {
    setLoading(true);
    getAllNotes()
      .then(setNotes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    const action = editingId ? updateNote(editingId, form) : createNote(form);

    action
      .then(() => {
        setForm(emptyForm());
        setEditingId(null);
        loadNotes();
      })
      .catch((err) => setError(err.message));
  }

  function handleEdit(note) {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content, topic: note.topic || "" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function handleDelete(id) {
    deleteNote(id)
      .then(loadNotes)
      .catch((err) => setError(err.message));
  }

  if (loading) return <p style={{ fontFamily: "var(--font-mono)" }}>Loading notes...</p>;
  if (error) return <p style={{ color: "var(--color-accent)" }}>Error: {error}</p>;

  return (
    <div>
      <form className="note-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="topic"
          placeholder="Topic (optional, e.g. Sliding Window)"
          value={form.topic}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Write your note..."
          value={form.content}
          onChange={handleChange}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">{editingId ? "Update note" : "Add note"}</button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ background: "transparent", color: "var(--color-ink-muted)", border: "1px solid rgba(220,238,255,0.25)" }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {notes.length === 0 && (
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink-muted)" }}>
          No notes yet — add your first one above.
        </p>
      )}

      {notes.map((note) => (
        <div className="note-card" key={note.id}>
          <div className="note-card__header">
            <span className="note-card__title">{note.title}</span>
            {note.topic && <span className="note-card__topic">{note.topic}</span>}
          </div>
          <div className="note-card__content">{note.content}</div>
          <div className="note-card__actions">
            <button onClick={() => handleEdit(note)}>Edit</button>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notes;