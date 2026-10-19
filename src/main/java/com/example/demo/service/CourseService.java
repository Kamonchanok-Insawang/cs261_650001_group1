package com.example.demo.service;

import com.example.demo.dto.CourseReviewsResponse;
import com.example.demo.dto.CourseReviewsResponse.ReviewItem;
import com.example.demo.model.Course;
import com.example.demo.model.Review;
import com.example.demo.model.ReviewAnonymity;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.ReviewAnonymityRepository;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.OptionalDouble;
import java.util.function.Function;
import java.util.stream.Collectors;

import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewAnonymityRepository anonymityRepository;

    public Optional<Course> findByCode(String code) {
        return courseRepository.findByCodeIgnoreCase(code.trim());
    }

    public List<Course> search(String keyword) {
        return courseRepository.findByCodeContainingIgnoreCase(keyword.trim());
    }

        public Optional<CourseReviewsResponse> getCourseReviews(String code) {
        return getCourseReviews(code, null);
    }

    // currentUserId: รหัสผู้ดู (ถ้ามี) ใช้ทำเครื่องหมายรีวิวของตัวเอง ไม่ส่ง userId ออกไป
    public Optional<CourseReviewsResponse> getCourseReviews(String code, String currentUserId) {
        return findByCode(code).map(course -> {
            List<Review> reviews = reviewRepository.findByTargetId(course.getId());

            double avg = reviews.stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);
            avg = Math.round(avg * 10.0) / 10.0;

            List<Integer> ids = reviews.stream().map(Review::getReviewId).toList();
            Map<Integer, ReviewAnonymity> anon = anonymityRepository.findAllById(ids).stream()
                    .collect(Collectors.toMap(ReviewAnonymity::getReviewId, a -> a));

            List<ReviewItem> items = reviews.stream()
                    .map(r -> new ReviewItem(
                            r.getReviewId(), r.getRating(),
                            r.getDifficultyRating(), r.getWorkloadRating(), r.getInstructorRating(),
                            displayName(anon.get(r.getReviewId())),
                            r.getComment(), r.getCreatedAt(),
                            currentUserId != null
                                    && String.valueOf(r.getUserId()).equals(currentUserId)))
                    .toList();

            return new CourseReviewsResponse(course.getCode(), course.getName(), avg,
                    avgOf(reviews, Review::getDifficultyRating),
                    avgOf(reviews, Review::getWorkloadRating),
                    avgOf(reviews, Review::getInstructorRating),
                    items.size(), items);
        });
    }

    private String displayName(ReviewAnonymity a) {
        if (a == null || a.isAnonymous() || a.getAuthorName() == null) {
            return ReviewAnonymityService.ANONYMOUS_NAME;
        }
        return a.getAuthorName();
    }

    private Double avgOf(List<Review> reviews, Function<Review, Integer> field) {
        OptionalDouble o = reviews.stream().map(field).filter(Objects::nonNull)
                .mapToInt(Integer::intValue).average();
        return o.isPresent() ? Math.round(o.getAsDouble() * 10.0) / 10.0 : null;
    }
}