package com.example.demo.mapper;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
public class UserMapper {
    public static User toEntity(RegisterRequest dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setAddress(dto.getAddress());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole("USER"); // Mặc định là USER
        return user;
    }
}