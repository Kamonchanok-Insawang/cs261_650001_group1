package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CourseReviewsResponse(
        String code,
        String name,
        double averageRating,
        Double averageDifficulty,
        Double averageWorkload,
        Double averageInstructor,
        int reviewCount,
        List<ReviewItem> reviews) {

    // ไม่ส่ง userId กลับ; authorName มาจากระบบ anonymity (ซ่อน = "Anonymous")
        public record ReviewItem(
            Integer reviewId,
            Double rating,
            Integer difficultyRating,
            Integer workloadRating,
            Integer instructorRating,
            String authorName,
            String comment,
            LocalDateTime createdAt,
            boolean mine) {}
}