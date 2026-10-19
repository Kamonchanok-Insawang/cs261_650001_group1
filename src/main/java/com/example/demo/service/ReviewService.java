package com.example.demo.service;

import com.example.demo.model.Review;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByTargetId(Integer targetId) {
        return reviewRepository.findByTargetId(targetId);
    }

    public String deleteReviewProcess(Integer reviewId, String currentUserId) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            return "REVIEW_NOT_FOUND";
        }

        Review review = reviewOpt.get();

        // ตรวจสิทธิ์: ต้องเป็นเจ้าของรีวิว
        if (!String.valueOf(review.getUserId()).equals(currentUserId)) {
            return "UNAUTHORIZED";
        }

        Integer targetId = review.getTargetId();
        reviewRepository.deleteById(reviewId);

        // คำนวณคะแนนเฉลี่ยใหม่หลังลบ
        double avg = reviewRepository.findByTargetId(targetId).stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        avg = Math.round(avg * 10.0) / 10.0;

        return "SUCCESS:" + avg;
    }
}