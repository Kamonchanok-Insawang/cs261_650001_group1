package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.TuAuthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final String tuAuthUrl = "https://restapi.tu.ac.th/api/v1/auth/Ad/verify";

    @Value("${tu.api.application-key:TU_API_KEY_PLACEHOLDER}")
    private String applicationKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LoginResponse(false, "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน", null, null));
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Application-Key", applicationKey);

            Map<String, String> tuBody = new HashMap<>();
            tuBody.put("UserName", request.getUsername());
            tuBody.put("PassWord", request.getPassword());

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(tuBody, headers);

            ResponseEntity<TuAuthResponse> response = restTemplate.postForEntity(
                    tuAuthUrl,
                    entity,
                    TuAuthResponse.class
            );

            TuAuthResponse result = response.getBody();

            if (result != null && result.isStatus()) {
                 return ResponseEntity.ok(new LoginResponse(
                        true,
                        "เข้าสู่ระบบสำเร็จ",
                        result.getDisplayNameTh(),
                        result.getType(),
                        request.getUsername().trim()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "ชื่อผู้ใช้หรือรหัสผ่าน มธ. ไม่ถูกต้อง", null, null));
            }

        } catch (HttpClientErrorException.Unauthorized e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "ชื่อผู้ใช้หรือรหัสผ่าน มธ. ไม่ถูกต้อง", null, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "เกิดข้อผิดพลาดในการเชื่อมต่อ TU API: " + e.getMessage(), null, null));
        }
    }
}