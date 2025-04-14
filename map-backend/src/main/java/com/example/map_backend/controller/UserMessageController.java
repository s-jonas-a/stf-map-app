package com.example.map_backend.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.DataClassRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import com.example.map_backend.model.UserMessage;
import com.example.map_backend.repository.UserMessageRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class UserMessageController {

    private final UserMessageRepository userMessageRepository;
    private final JdbcTemplate jdbcTemplate;

    public UserMessageController(UserMessageRepository userMessageRepository, JdbcTemplate jdbcTemplate) {
        this.userMessageRepository = userMessageRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Application is running";
    }

    @GetMapping("/read-db")
    public List<UserMessage> testDb() {

        return jdbcTemplate.query("SELECT * FROM userMessages", new DataClassRowMapper<>(UserMessage.class));
    }

    @GetMapping("/dump-db")
    public String dumpDb() {

        List<Map<String, Object>> results = jdbcTemplate.queryForList("SELECT * FROM userMessages");
        results.forEach(e -> System.out.println(e.entrySet()));

        return "DB printed on console!";
    }

    @GetMapping("/message")
    public List<UserMessage> getUserMesssages() {
        return userMessageRepository.findAll();
    }

    @PostMapping("/message")
    @ResponseStatus(HttpStatus.CREATED)
    public void createUserMesssages(@RequestBody UserMessage message) {

        System.out.println("Received message: " + message.getMessage());

        userMessageRepository.save(message);
    }
}
