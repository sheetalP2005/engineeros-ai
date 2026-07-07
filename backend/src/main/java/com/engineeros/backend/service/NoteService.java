package com.engineeros.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.engineeros.backend.config.CurrentUserService;
import com.engineeros.backend.entity.Note;
import com.engineeros.backend.entity.User;
import com.engineeros.backend.repository.NoteRepository;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final CurrentUserService currentUserService;

    public NoteService(NoteRepository noteRepository, CurrentUserService currentUserService) {
        this.noteRepository = noteRepository;
        this.currentUserService = currentUserService;
    }

    public Note createNote(Note note) {
        note.setUser(currentUserService.getCurrentUser());
        note.setCreatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    public List<Note> getAllNotes() {
        User currentUser = currentUserService.getCurrentUser();
        return noteRepository.findByUserId(currentUser.getId());
    }

    public Optional<Note> getNoteById(Long id) {
        User currentUser = currentUserService.getCurrentUser();
        return noteRepository.findByIdAndUserId(id, currentUser.getId());
    }

    public List<Note> getNotesByTopic(String topic) {
        User currentUser = currentUserService.getCurrentUser();
        return noteRepository.findByUserIdAndTopic(currentUser.getId(), topic);
    }

    public Note updateNote(Long id, Note updatedNote) {
        User currentUser = currentUserService.getCurrentUser();

        Note existing = noteRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        existing.setTitle(updatedNote.getTitle());
        existing.setContent(updatedNote.getContent());
        existing.setTopic(updatedNote.getTopic());

        return noteRepository.save(existing);
    }

    public void deleteNote(Long id) {
        User currentUser = currentUserService.getCurrentUser();

        Note existing = noteRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        noteRepository.delete(existing);
    }
}