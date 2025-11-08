package com.research.matcher.controller;

import com.research.matcher.model.Researcher;
import com.research.matcher.model.Collaborator;
import com.research.matcher.service.ResearchMatcherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * REST controller for research matcher API endpoints
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResearchMatcherController {
    
    private final ResearchMatcherService researchMatcherService;
    
    /**
     * Register a new researcher
     */
    @PostMapping("/researcher/register")
    public ResponseEntity<Map<String, Object>> registerResearcher(@RequestBody Map<String, Object> request) {
        try {
            Researcher researcher = new Researcher();
            researcher.setName((String) request.get("name"));
            researcher.setEmail((String) request.get("email"));
            researcher.setPassword((String) request.get("password"));
            researcher.setField((String) request.get("field"));
            researcher.setInstitution((String) request.get("institution"));
            researcher.setProjectTitle((String) request.get("projectTitle"));
            researcher.setProjectDescription((String) request.get("projectDescription"));
            researcher.setExperience((String) request.get("experience"));
            researcher.setLocation((String) request.get("location"));
            researcher.setContactNumber((String) request.get("contactNumber"));
            
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) request.get("skills");
            researcher.setSkills(skills);
            
            String id = researchMatcherService.registerResearcher(researcher);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "researcherId", id,
                "message", "Researcher registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Registration failed: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Register a new collaborator
     */
    @PostMapping("/collaborator/register")
    public ResponseEntity<Map<String, Object>> registerCollaborator(@RequestBody Map<String, Object> request) {
        try {
            Collaborator collaborator = new Collaborator();
            collaborator.setName((String) request.get("name"));
            collaborator.setEmail((String) request.get("email"));
            collaborator.setPassword((String) request.get("password"));
            collaborator.setOrganization((String) request.get("organization"));
            collaborator.setProjectIdea((String) request.get("projectIdea"));
            collaborator.setBudget((String) request.get("budget"));
            
            @SuppressWarnings("unchecked")
            List<String> interestedFields = (List<String>) request.get("interestedFields");
            collaborator.setInterestedFields(interestedFields);
            
            String id = researchMatcherService.registerCollaborator(collaborator);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "collaboratorId", id,
                "message", "Collaborator registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Registration failed: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Researcher sign-in
     */
    @PostMapping("/researcher/signin")
    public ResponseEntity<Map<String, Object>> researcherSignIn(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Researcher researcher = researchMatcherService.authenticateResearcher(email, password);
        
        if (researcher != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "researcher", researcher,
                "message", "Sign-in successful"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid credentials"
            ));
        }
    }
    
    /**
     * Collaborator sign-in
     */
    @PostMapping("/collaborator/signin")
    public ResponseEntity<Map<String, Object>> collaboratorSignIn(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Collaborator collaborator = researchMatcherService.authenticateCollaborator(email, password);
        
        if (collaborator != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "collaborator", collaborator,
                "message", "Sign-in successful"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Invalid credentials"
            ));
        }
    }
    
    /**
     * Get all researchers for collaborators to browse
     */
    @GetMapping("/researchers")
    public ResponseEntity<Map<String, Object>> getAllResearchers() {
        List<Researcher> researchers = researchMatcherService.getAllResearchers();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "researchers", researchers,
            "count", researchers.size()
        ));
    }
    
    /**
     * Get researcher details by ID
     */
    @GetMapping("/researcher/{id}")
    public ResponseEntity<Map<String, Object>> getResearcherById(@PathVariable String id) {
        Researcher researcher = researchMatcherService.getResearcherById(id);
        if (researcher != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "researcher", researcher
            ));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Search researchers
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchResearchers(@RequestParam(required = false) String keyword) {
        List<Researcher> researchers = researchMatcherService.searchResearchers(keyword);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "researchers", researchers,
            "count", researchers.size(),
            "keyword", keyword != null ? keyword : "all"
        ));
    }
    
    /**
     * Get available research fields
     */
    @GetMapping("/fields")
    public ResponseEntity<Map<String, Object>> getResearchFields() {
        List<String> fields = Arrays.asList(
            "AI", "PHYSICS", "SCIENCE", "ML", "CLOUD", "AEROSPACE", 
            "BIOTECHNOLOGY", "CHEMISTRY", "MATHEMATICS", "ROBOTICS"
        );
        return ResponseEntity.ok(Map.of(
            "success", true,
            "fields", fields
        ));
    }
    
    /**
     * Debug: Get all stored researchers
     */
    @GetMapping("/debug/researchers")
    public ResponseEntity<Map<String, Object>> debugGetAllResearchers() {
        List<Researcher> researchers = researchMatcherService.getAllResearchers();
        return ResponseEntity.ok(Map.of(
            "researchers", researchers,
            "count", researchers.size()
        ));
    }
    
    /**
     * Debug: Get all stored collaborators
     */
    @GetMapping("/debug/collaborators")
    public ResponseEntity<Map<String, Object>> debugGetAllCollaborators() {
        return ResponseEntity.ok(Map.of(
            "message", "Collaborators stored in memory",
            "note", "Use researcher registration to test"
        ));
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Research Matcher API"));
    }
}