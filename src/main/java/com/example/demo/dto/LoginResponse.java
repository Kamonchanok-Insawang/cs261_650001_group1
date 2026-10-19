package com.example.demo.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String name;
    private String userType;
    private String studentId;

    public LoginResponse(boolean success, String message, String name, String userType) {
        this(success, message, name, userType, null);
    }

    public LoginResponse(boolean success, String message, String name, String userType, String studentId) {
        this.success = success;
        this.message = message;
        this.name = name;
        this.userType = userType;
        this.studentId = studentId;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getName() { return name; }
    public String getUserType() { return userType; }
    public String getStudentId() { return studentId; }
}