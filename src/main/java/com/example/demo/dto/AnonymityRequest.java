package com.example.demo.dto;

/** authorName ใช้เมื่อ anonymous = false (ชื่อที่จะแสดง) */
public record AnonymityRequest(boolean anonymous, String authorName) {}
