package com.example.demo.repository;

import com.example.demo.model.ReviewAnonymity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewAnonymityRepository extends JpaRepository<ReviewAnonymity, Integer> {
}
