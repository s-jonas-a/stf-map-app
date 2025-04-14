package com.example.map_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.map_backend.model.UserMessage;

@Repository
public interface UserMessageRepository extends JpaRepository<UserMessage, Long> {    
}
