package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TuAuthResponse {
    private boolean status;
    private String message;

    @JsonProperty("type")
    private String type;

    @JsonProperty("username")
    private String username;

    @JsonProperty("displayname_th")
    private String displayNameTh;

    @JsonProperty("displayname_en")
    private String displayNameEn;

    @JsonProperty("email")
    private String email;

    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayNameTh() { return displayNameTh; }
    public void setDisplayNameTh(String displayNameTh) { this.displayNameTh = displayNameTh; }

    public String getDisplayNameEn() { return displayNameEn; }
    public void setDisplayNameEn(String displayNameEn) { this.displayNameEn = displayNameEn; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}