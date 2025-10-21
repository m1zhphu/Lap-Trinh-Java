package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Sử dụng Lombok cho constructor
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users") // Đổi đường dẫn cơ sở thành /api/users
@RequiredArgsConstructor // Tự động tạo constructor với các final fields
public class UserController {

    private final UserRepository userRepository; // Chỉ cần UserRepository ở đây

    // API lấy tất cả người dùng
    @GetMapping // Đường dẫn sẽ là GET /api/users
    @PreAuthorize("hasRole('ADMIN')") // Vẫn yêu cầu quyền ADMIN
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();

        // Chuyển đổi sang DTO (Nhớ tạo UserDTO)
        List<UserDto> userDTOs = users.stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDTOs);
    }

}