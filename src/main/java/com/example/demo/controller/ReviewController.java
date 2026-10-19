package com.example.demo.controller;

import com.example.demo.model.Review;
import com.example.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*") // อนุญาตให้ Frontend ดึงข้อมูลได้
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // API บันทึกรีวิวใหม่ (POST /api/reviews)
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review savedReview = reviewService.createReview(review);
        return ResponseEntity.ok(savedReview);
    }

    // API ดึงรีวิวทั้งหมด (GET /api/reviews)
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // API ดึงรีวิวตาม TargetID (GET /api/reviews/target/{targetId})
    @GetMapping("/target/{targetId}")
    public ResponseEntity<List<Review>> getReviewsByTargetId(@PathVariable Integer targetId) {
        return ResponseEntity.ok(reviewService.getReviewsByTargetId(targetId));
    }
}