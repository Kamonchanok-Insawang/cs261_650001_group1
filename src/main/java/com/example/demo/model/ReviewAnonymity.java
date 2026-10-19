package com.example.demo.model;

import jakarta.persistence.*;

/** Task33 (U8): เก็บสถานะซ่อนชื่อ คู่กับเจ้าของรีวิว (1 แถวต่อ 1 รีวิว) */
@Entity
@Table(name = "ReviewAnonymity")
public class ReviewAnonymity {

    @Id
    @Column(name = "ReviewID")
    private Integer reviewId;

    /** เจ้าของรีวิว: เก็บเสมอ แต่ห้ามส่งออก API */
    @Column(name = "OwnerUserID", nullable = false)
    private Long ownerUserId;

    @Column(name = "IsAnonymous", nullable = false)
    private boolean anonymous = true;

    /** เก็บเฉพาะเมื่อเลือก "Show my name" */
    @Column(name = "AuthorName", length = 100)
    private String authorName;

    /** กันชื่อหลุด: ถ้าซ่อนชื่อ จะล้างชื่อก่อนบันทึกเสมอ */
    @PrePersist
    @PreUpdate
    public void normalizeAuthorName() {
        if (anonymous) {
            authorName = null;
        }
    }

    public ReviewAnonymity() {}

    public Integer getReviewId() { return reviewId; }
    public void setReviewId(Integer reviewId) { this.reviewId = reviewId; }

    public Long getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }

    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
}