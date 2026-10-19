package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reviews")
public class Review {

    public Review(long userId, int targetId, int rating, String comment) {
    this.userId = userId;
    this.targetId = targetId;
    this.rating = (double) rating;
    this.comment = comment;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReviewID")
    private Integer reviewId;

    @Column(name = "UserID", nullable = false)
    private Long userId;

    @Column(name = "TargetID", nullable = false)
    private Integer targetId;

    /** คะแนนรวม = ค่าเฉลี่ยของ 3 ด้าน (คำนวณใน ReviewService) */
    @Column(name = "Rating", nullable = false)
    private Double rating;

    @Column(name = "DifficultyRating")
    private Integer difficultyRating;

    @Column(name = "WorkloadRating")
    private Integer workloadRating;

    @Column(name = "InstructorRating")
    private Integer instructorRating;

    @Column(name = "Comment", length = 1000)
    private String comment;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Integer getReviewId() { return reviewId; }
    public void setReviewId(Integer reviewId) { this.reviewId = reviewId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getTargetId() { return targetId; }
    public void setTargetId(Integer targetId) { this.targetId = targetId; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getDifficultyRating() { return difficultyRating; }
    public void setDifficultyRating(Integer v) { this.difficultyRating = v; }

    public Integer getWorkloadRating() { return workloadRating; }
    public void setWorkloadRating(Integer v) { this.workloadRating = v; }

    public Integer getInstructorRating() { return instructorRating; }
    public void setInstructorRating(Integer v) { this.instructorRating = v; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}