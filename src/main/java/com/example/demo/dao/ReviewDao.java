package com.example.demo.dao;

import com.example.demo.model.Review;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ReviewDao {
    private final List<Review> reviewList = new ArrayList<>();

    public Optional<Review> findById(Long id) {
        return reviewList.stream().filter(r -> r.getId().equals(id)).findFirst();
    }

    public List<Review> findByCourseId(String courseId) {
        return reviewList.stream()
                .filter(r -> r.getCourseId().equalsIgnoreCase(courseId))
                .collect(Collectors.toList());
    }

    public boolean deleteById(Long id) {
        return reviewList.removeIf(r -> r.getId().equals(id));
    }

    public double calculateAverageRating(String courseId) {
        List<Review> reviews = findByCourseId(courseId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        double sum = 0;
        for (Review r : reviews) {
            sum += r.getRating();
        }
        return Math.round((sum / reviews.size()) * 10.0) / 10.0; // ปัดเศษ 1 ตำแหน่ง
    }
}