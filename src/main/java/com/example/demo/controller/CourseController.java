package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // GET /api/courses/CS261
    @GetMapping("/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        return courseService.findByCode(code)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "ไม่พบรายวิชา")));
    }

    // GET /api/courses?keyword=CS
    @GetMapping
    public ResponseEntity<List<Course>> search(@RequestParam(defaultValue = "") String keyword) {
        return ResponseEntity.ok(courseService.search(keyword));
    }

        // GET /api/courses/CS261/reviews  (header X-User-Id ไม่บังคับ ใช้ทำเครื่องหมายรีวิวของตัวเอง)
    @GetMapping("/{code}/reviews")
    public ResponseEntity<?> getReviews(
            @PathVariable String code,
            @RequestHeader(value = "X-User-Id", required = false) String currentUserId) {
        return courseService.getCourseReviews(code, currentUserId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "ไม่พบรายวิชา")));
    }
}