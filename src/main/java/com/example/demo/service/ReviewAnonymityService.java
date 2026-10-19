package com.example.demo.service;

import com.example.demo.dto.AnonymityResponse;
import com.example.demo.model.Review;
import com.example.demo.model.ReviewAnonymity;
import com.example.demo.repository.ReviewAnonymityRepository;
import com.example.demo.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Task23 (U8): บันทึกและอ่านสถานะการซ่อนชื่อ (เปลี่ยนได้เฉพาะเจ้าของรีวิว) */
@Service
public class ReviewAnonymityService {

    public static final String ANONYMOUS_NAME = "Anonymous";
    public static final String DEFAULT_NAME = "TU Student";

    private final ReviewRepository reviewRepository;
    private final ReviewAnonymityRepository anonymityRepository;

    public ReviewAnonymityService(ReviewRepository reviewRepository,
                                  ReviewAnonymityRepository anonymityRepository) {
        this.reviewRepository = reviewRepository;
        this.anonymityRepository = anonymityRepository;
    }

    public AnonymityResponse setAnonymity(String currentUserId, Integer reviewId,
                                          boolean anonymous, String authorName) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบรีวิว"));

        if (!String.valueOf(review.getUserId()).equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "คุณไม่ใช่เจ้าของรีวิวนี้");
        }

        ReviewAnonymity a = anonymityRepository.findById(reviewId).orElseGet(ReviewAnonymity::new);
        a.setReviewId(reviewId);
        a.setOwnerUserId(review.getUserId());
        a.setAnonymous(anonymous);
        if (anonymous) {
            a.setAuthorName(null);
        } else {
            a.setAuthorName(authorName == null || authorName.isBlank() ? DEFAULT_NAME : authorName);
        }
        anonymityRepository.save(a);
        return toResponse(a);
    }

    /** อ่านสถานะ: ถ้ายังไม่เคยตั้งค่า ถือว่าซ่อนชื่อ */
    public AnonymityResponse getAnonymity(Integer reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบรีวิว");
        }
        return anonymityRepository.findById(reviewId)
                .map(this::toResponse)
                .orElse(new AnonymityResponse(reviewId, true, ANONYMOUS_NAME));
    }

    private AnonymityResponse toResponse(ReviewAnonymity a) {
        String shown = a.isAnonymous() || a.getAuthorName() == null ? ANONYMOUS_NAME : a.getAuthorName();
        return new AnonymityResponse(a.getReviewId(), a.isAnonymous(), shown);
    }
}
