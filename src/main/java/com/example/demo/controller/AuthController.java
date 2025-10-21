package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.service.UserService; // <-- Import

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        try {
            String token = userService.register(request);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            // Bắt lỗi nếu username đã tồn tại
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("message", e.getMessage()));
        }
    }

    // === SỬA API ĐĂNG NHẬP (THÊM TRY-CATCH) ===
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        try {
            // Thử đăng nhập và lấy token
            String token = userService.login(request);
            // Nếu thành công, trả về token
            return ResponseEntity.ok(Map.of("token", token));
            
        } catch (BadCredentialsException e) {
            // Nếu BẮT ĐƯỢC lỗi sai mật khẩu
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "Sai username hoặc password!"));
        } catch (Exception e) {
            // Bắt các lỗi 500 khác (nếu có)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "Đã xảy ra lỗi: " + e.getMessage()));
        }
    }
}