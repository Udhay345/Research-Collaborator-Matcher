package com.research.matcher.service;

import com.research.matcher.model.Researcher;
import com.research.matcher.model.Collaborator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service class for researcher and collaborator management
 */
@Service
public class ResearchMatcherService {
    
    // In-memory storage
    private final ConcurrentHashMap<String, Researcher> researchers = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Collaborator> collaborators = new ConcurrentHashMap<>();
    
    /**
     * Register a new researcher
     */
    public String registerResearcher(Researcher researcher) {
        String id = UUID.randomUUID().toString();
        researcher.setId(id);
        researcher.setRegisteredAt(LocalDateTime.now());
        researcher.setActive(true);
        researchers.put(id, researcher);
        return id;
    }
    
    /**
     * Register a new collaborator
     */
    public String registerCollaborator(Collaborator collaborator) {
        String id = UUID.randomUUID().toString();
        collaborator.setId(id);
        collaborator.setRegisteredAt(LocalDateTime.now());
        collaborator.setActive(true);
        collaborators.put(id, collaborator);
        return id;
    }
    
    /**
     * Authenticate researcher
     */
    public Researcher authenticateResearcher(String email, String password) {
        return researchers.values().stream()
            .filter(r -> r.getEmail().equals(email) && r.getPassword().equals(password))
            .findFirst()
            .orElse(null);
    }
    
    /**
     * Authenticate collaborator
     */
    public Collaborator authenticateCollaborator(String email, String password) {
        return collaborators.values().stream()
            .filter(c -> c.getEmail().equals(email) && c.getPassword().equals(password))
            .findFirst()
            .orElse(null);
    }
    
    /**
     * Get all active researchers
     */
    public List<Researcher> getAllResearchers() {
        return researchers.values().stream()
            .filter(Researcher::isActive)
            .collect(Collectors.toList());
    }
    
    /**
     * Get researchers by field
     */
    public List<Researcher> getResearchersByField(String field) {
        return researchers.values().stream()
            .filter(r -> r.isActive() && r.getField().equalsIgnoreCase(field))
            .collect(Collectors.toList());
    }
    
    /**
     * Get researcher by ID
     */
    public Researcher getResearcherById(String id) {
        return researchers.get(id);
    }
    
    /**
     * Get collaborator by ID
     */
    public Collaborator getCollaboratorById(String id) {
        return collaborators.get(id);
    }
    
    /**
     * Search researchers by keyword
     */
    public List<Researcher> searchResearchers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllResearchers();
        }
        
        String searchTerm = keyword.toLowerCase().trim();
        return researchers.values().stream()
            .filter(r -> r.isActive() && (
                r.getName().toLowerCase().contains(searchTerm) ||
                r.getField().toLowerCase().contains(searchTerm) ||
                r.getProjectTitle().toLowerCase().contains(searchTerm) ||
                r.getInstitution().toLowerCase().contains(searchTerm) ||
                r.getSkills().stream().anyMatch(skill -> skill.toLowerCase().contains(searchTerm))
            ))
            .collect(Collectors.toList());
    }
}