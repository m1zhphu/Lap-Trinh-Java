package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerDto {
    private Long id;
    private String name;
    private String imageUrl;
    private String linkUrl;
    private Boolean status;
    // Không cần constructor đặc biệt nếu dùng @AllArgsConstructor
}