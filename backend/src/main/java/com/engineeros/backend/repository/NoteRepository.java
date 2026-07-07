package com.engineeros.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.engineeros.backend.entity.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserId(Long userId);
    List<Note> findByUserIdAndTopic(Long userId, String topic);
    Optional<Note> findByIdAndUserId(Long id, Long userId);
}