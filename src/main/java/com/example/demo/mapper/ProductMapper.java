package com.example.demo.mapper;

import com.example.demo.dto.ProductDto;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;

public class ProductMapper {

    // Chuyển Entity → DTO (Gửi dữ liệu cho React)
    public static ProductDto toDto(Product product) {
        if (product == null) return null;
        
        Integer categoryId = (product.getCategory() != null) ? product.getCategory().getId() : null;
        String categoryName = (product.getCategory() != null) ? product.getCategory().getName() : null;

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .categoryId(categoryId)
                .categoryName(categoryName)
                .image(product.getImage())
                .salePrice(product.getSalePrice())
                .status(product.isStatus()) 
                .build();
    }

    // Chuyển DTO → Entity (Nhận dữ liệu từ React)
    public static Product toEntity(ProductDto dto) {
        if (dto == null) return null;

        Category category = new Category();
        if(dto.getCategoryId() != null) {
            category.setId(dto.getCategoryId());
        } else {
            category = null;
        }

        return Product.builder()
                // .id(dto.getId()) // Không set ID khi tạo mới
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .category(category)
                .image(dto.getImage())
                .salePrice(dto.getSalePrice())
                .status(dto.isStatus())
                .build();
    }
}