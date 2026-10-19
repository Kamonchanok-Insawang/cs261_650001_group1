package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Optional<Course> findByCode(String code) {
        return courseRepository.findByCodeIgnoreCase(code.trim());
    }

    public List<Course> search(String keyword) {
        return courseRepository.findByCodeContainingIgnoreCase(keyword.trim());
    }
}