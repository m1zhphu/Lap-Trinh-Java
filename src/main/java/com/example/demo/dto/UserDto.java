package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; // Nên thêm cả NoArgsConstructor

@Data 
@AllArgsConstructor 
@NoArgsConstructor // Thêm constructor không tham số (tốt cho JSON)
public class UserDto {
    private Long id; 
    private String username; 
    
    private String name;    // Thêm trường name
    private String email;   // Thêm trường email
    
    private String role; 
}