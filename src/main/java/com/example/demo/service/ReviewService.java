package com.example.demo.service;

import com.example.demo.model.Review;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.example.demo.dao.ReviewDao;
import com.example.demo.model.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private ReviewDao reviewDao;

    public String deleteReviewProcess(Long reviewId, String currentUserId) {
        Optional<Review> reviewOpt = reviewDao.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            return "REVIEW_NOT_FOUND";
        }

        Review review = reviewOpt.get();

        if (!review.getUserId().equals(currentUserId)) {
            return "UNAUTHORIZED";
        }

        String courseId = review.getCourseId();

        boolean deleted = reviewDao.deleteById(reviewId);

        if (deleted) {
            double newAvgRating = reviewDao.calculateAverageRating(courseId);

            return "SUCCESS:" + newAvgRating;
        }

        return "DELETE_FAILED";
    }
}