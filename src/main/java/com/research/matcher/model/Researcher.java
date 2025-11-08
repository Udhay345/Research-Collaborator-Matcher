package com.research.matcher.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Researcher model representing a research collaborator
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Researcher {
    private String id;
    private String name;
    private String email;
    private String password;
    private String field; // AI, PHYSICS, SCIENCE, ML, CLOUD, AEROSPACE, etc.
    private String institution;
    private String projectTitle;
    private String projectDescription;
    private String experience; // Years of experience
    private String location;
    private String contactNumber;
    private List<String> skills;
    private LocalDateTime registeredAt;
    private boolean isActive;
}