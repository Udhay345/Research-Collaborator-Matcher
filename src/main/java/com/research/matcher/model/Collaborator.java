package com.research.matcher.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Collaborator model for people looking for researchers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Collaborator {
    private String id;
    private String name;
    private String email;
    private String password;
    private String organization;
    private List<String> interestedFields;
    private String projectIdea;
    private String budget;
    private LocalDateTime registeredAt;
    private boolean isActive;
}