package com.example.demo.dto;

/** ไม่มี userId โดยเจตนา (U8). displayName คือชื่อที่คนอื่นจะเห็น */
public record AnonymityResponse(Integer reviewId, boolean anonymous, String displayName) {}
