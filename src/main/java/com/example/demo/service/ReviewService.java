package com.example.demo.service;

import com.example.demo.model.Review;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(Review review) {
        List<Integer> parts = Stream.of(
                        review.getDifficultyRating(),
                        review.getWorkloadRating(),
                        review.getInstructorRating())
                .filter(Objects::nonNull)
                .toList();

        if (parts.size() != 3 || parts.stream().anyMatch(v -> v < 1 || v > 5)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "กรุณาให้คะแนนครบทั้ง 3 ด้าน (1-5 ดาว)");
        }

        double avg = parts.stream().mapToInt(Integer::intValue).average().orElse(0.0);
        review.setRating(Math.round(avg * 100.0) / 100.0);
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

        if (!String.valueOf(review.getUserId()).equals(currentUserId)) {
            return "UNAUTHORIZED";
        }

        Integer targetId = review.getTargetId();
        reviewRepository.deleteById(reviewId);

        double avg = reviewRepository.findByTargetId(targetId).stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
        avg = Math.round(avg * 10.0) / 10.0;

        return "SUCCESS:" + avg;
    }
}