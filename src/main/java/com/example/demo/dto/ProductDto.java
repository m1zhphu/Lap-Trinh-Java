package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho Product - dùng để truyền dữ liệu ra/vào API
 * Tách biệt với Entity để tránh lộ thông tin nội bộ DB
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Integer id;
    private String name;
    private String description;
    private Double price;
    private Double salePrice;
    private Integer quantity;
    private Integer categoryId;
    private String categoryName;
    private String image;
    private boolean status;
}
