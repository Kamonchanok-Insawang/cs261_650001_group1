package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CourseReviewsResponse(
        String code,
        String name,
        double averageRating,
        int reviewCount,
        List<ReviewItem> reviews) {

    // ตั้งใจไม่ส่ง userId กลับ เพื่อให้รีวิวไม่เปิดเผยชื่อผู้เขียน (US8)
    public record ReviewItem(
            Integer reviewId,
            Integer rating,
            String comment,
            LocalDateTime createdAt) {}
}