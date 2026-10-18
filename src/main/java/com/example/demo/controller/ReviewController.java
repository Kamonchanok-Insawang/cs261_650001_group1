package com.example.demo.controller;

import com.example.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // API สำหรับลบรีวิว
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable("id") Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) String currentUserId) {

        if (currentUserId == null || currentUserId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "กรุณาเข้าสู่ระบบก่อนทำรายการ"));
        }

        String result = reviewService.deleteReviewProcess(reviewId, currentUserId);

        if ("UNAUTHORIZED".equals(result)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "คุณไม่มีสิทธิ์ลบรีวิวนี้"));
        } else if ("REVIEW_NOT_FOUND".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "ไม่พบรีวิวที่ต้องการลบ"));
        } else if (result.startsWith("SUCCESS:")) {
            double newAvg = Double.parseDouble(result.split(":")[1]);
            return ResponseEntity.ok(Map.of(
                    "message", "ลบรีวิวเรียบร้อยแล้ว",
                    "newAverageRating", newAvg
            ));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "เกิดข้อผิดพลาดในการลบรีวิว"));
    }
}