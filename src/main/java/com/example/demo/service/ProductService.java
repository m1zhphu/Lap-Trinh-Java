package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.ProductDto;

public interface ProductService {
    ProductDto addProduct(ProductDto productDto);
    List<ProductDto> getAllProducts();
    ProductDto getProductById(Integer id);
    ProductDto updateProduct(Integer id, ProductDto productDto);
    void deleteProduct(Integer id);

    // Query 1
    List<ProductDto> searchByName(String keyword);

    // Query 2
    List<ProductDto> searchByPriceRange(Double min, Double max);

    // Query 3
    List<ProductDto> searchByQuantityGreaterThan(Integer quantity);

}
