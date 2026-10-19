package com.example.demo.service;

import com.example.demo.dto.CourseReviewsResponse;
import com.example.demo.dto.CourseReviewsResponse.ReviewItem;
import com.example.demo.model.Course;
import com.example.demo.model.Review;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Optional<Course> findByCode(String code) {
        return courseRepository.findByCodeIgnoreCase(code.trim());
    }

    public List<Course> search(String keyword) {
        return courseRepository.findByCodeContainingIgnoreCase(keyword.trim());
    }

    // รีวิวทั้งหมดของรายวิชา + คะแนนเฉลี่ย (targetId ของรีวิว = id ของรายวิชา)
    public Optional<CourseReviewsResponse> getCourseReviews(String code) {
        return findByCode(code).map(course -> {
            List<Review> reviews = reviewRepository.findByTargetId(course.getId());

            double avg = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            avg = Math.round(avg * 10.0) / 10.0;

            List<ReviewItem> items = reviews.stream()
                    .map(r -> new ReviewItem(r.getReviewId(), r.getRating(),
                            r.getComment(), r.getCreatedAt()))
                    .toList();

            return new CourseReviewsResponse(course.getCode(), course.getName(),
                    avg, items.size(), items);
        });
    }
}