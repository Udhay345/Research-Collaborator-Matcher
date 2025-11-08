package com.research.matcher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot application class for Research Collaborator and Interest Matcher
 */
@SpringBootApplication
public class ResearchMatcherApplication {

    /**
     * Main method to start the Spring Boot application
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(ResearchMatcherApplication.class, args);
        System.out.println("🚀 Research Matcher API is running at http://localhost:8080");
        System.out.println("📋 Try: http://localhost:8080/api/match?interest=AI");
        System.out.println("💚 Health check: http://localhost:8080/api/health");
    }
}