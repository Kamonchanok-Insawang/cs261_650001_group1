package com.example.demo.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String name;
    private String userType;

    public LoginResponse(boolean success, String message, String name, String userType) {
        this.success = success;
        this.message = message;
        this.name = name;
        this.userType = userType;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getName() { return name; }
    public String getUserType() { return userType; }
}