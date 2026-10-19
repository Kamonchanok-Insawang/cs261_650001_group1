package com.example.demo.config;

import com.example.demo.model.Course;
import com.example.demo.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedCourses(CourseRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Course("CS261", "Introduction to Software Engineering", "Science and Technology"));
                repo.save(new Course("CS233", "Computer Architecture and Operating Systems", "Science and Technology"));
                repo.save(new Course("CS100", "Intro to Web Applications", "Science and Technology"));
                repo.save(new Course("CS216", "Data Structures and Algorithms", "Science and Technology"));
            }
        };
    }
}