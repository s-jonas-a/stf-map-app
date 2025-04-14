package com.example.map_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "userMessages")
public class UserMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "message")
    private String message;

    @Column(name = "observationDate")
    private LocalDate observationDate;

    @Column(name = "observationLng")
    private Double observationLng;

    @Column(name = "observationLat")
    private Double observationLat;

    // Default constructor
    public UserMessage() {
    }

    // Parameterized constructor
    public UserMessage(String message, LocalDate observationDate, Double observationLng, Double observationLat) {
        this.message = message;
        this.observationDate = observationDate;
        this.observationLng = observationLng;
        this.observationLat = observationLat;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDate getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(LocalDate observationDate) {
        this.observationDate = observationDate;
    }

    public Double getObservationLng() {
        return observationLng;
    }

    public void setObservationLng(Double observationLng) {
        this.observationLng = observationLng;
    }

    public Double getObservationLat() {
        return observationLat;
    }

    public void setObservationLat(Double observationLat) {
        this.observationLat = observationLat;
    }
}





// package com.example.map_backend.model;

// import jakarta.persistence.*;
// import java.time.LocalDate;

// @Entity
// @Table(name = "userMessages")
// public record UserMessage(
//         @Id
//         @GeneratedValue(strategy = GenerationType.IDENTITY)
//         @Column(name = "id")
//         Long id,
//         @Column(name = "message")
//         String message,
//         @Column(name = "observationDate")
//         LocalDate observationDate,
//         @Column(name = "observationLng")
//         Double observationLng,
//         @Column(name = "observationLat")
//         Double observationLat
// )  {

//     // Custom constructor for JPA
//     public UserMessage() {
//         this(null, null, null, null, null);
//     }

// }
