package com.example.demo.controller;

import com.example.demo.dto.AnonymityRequest;
import com.example.demo.service.ReviewAnonymityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** Task23 (U8): PATCH และ GET /api/reviews/{id}/anonymity */
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewAnonymityController {

    private final ReviewAnonymityService service;

    public ReviewAnonymityController(ReviewAnonymityService service) {
        this.service = service;
    }

    @PatchMapping("/{id}/anonymity")
    public ResponseEntity<?> setAnonymity(
            @PathVariable("id") Integer reviewId,
            @RequestHeader(value = "X-User-Id", required = false) String currentUserId,
            @RequestBody AnonymityRequest req) {

        if (currentUserId == null || currentUserId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "กรุณาเข้าสู่ระบบก่อนทำรายการ"));
        }
        return ResponseEntity.ok(
                service.setAnonymity(currentUserId, reviewId, req.anonymous(), req.authorName()));
    }

    @GetMapping("/{id}/anonymity")
    public ResponseEntity<?> getAnonymity(@PathVariable("id") Integer reviewId) {
        return ResponseEntity.ok(service.getAnonymity(reviewId));
    }
}
