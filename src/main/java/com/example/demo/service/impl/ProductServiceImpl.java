package com.example.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.ProductDto;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductService;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductDto addProduct(ProductDto productDto) {
        Product saved = productRepository.save(ProductMapper.toEntity(productDto));
        return ProductMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAllWithCategory()
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductMapper.toDto(p);
    }

    @Override
    public ProductDto updateProduct(Integer id, ProductDto productDto) {
        // 1. Tải sản phẩm hiện có từ DB
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // 2. Cập nhật các trường thông tin
        existing.setName(productDto.getName());
        existing.setDescription(productDto.getDescription());
        existing.setPrice(productDto.getPrice());
        existing.setQuantity(productDto.getQuantity());

        // Cập nhật category
        if (productDto.getCategoryId() != null) {
            Category category = new Category();
            category.setId(productDto.getCategoryId());
            existing.setCategory(category);
        } else {
            existing.setCategory(null);
        }

        // 3. >>> THÊM DÒNG NÀY ĐỂ CẬP NHẬT HÌNH ẢNH <<<
        // Dòng này sẽ ghi đè tên ảnh cũ bằng tên ảnh mới từ DTO gửi lên
        existing.setImage(productDto.getImage());

        // THÊM DÒNG NÀY ĐỂ CẬP NHẬT GIÁ KHUYẾN MÃI
        existing.setSalePrice(productDto.getSalePrice());

        // THÊM DÒNG NÀY ĐỂ CẬP NHẬT TRẠNG THÁI
        existing.setStatus(productDto.isStatus());
        
        // 4. Lưu lại sản phẩm đã được cập nhật đầy đủ
        Product updatedProduct = productRepository.save(existing);
        
        // 5. Chuyển đổi và trả về kết quả
        return ProductMapper.toDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // Query 1: Search by name
    @Override
    public List<ProductDto> searchByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    // Query 2: Search by price range
    @Override
    public List<ProductDto> searchByPriceRange(Double min, Double max) {
        return productRepository.findByPriceBetween(min, max)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    // Query 3: Search by quantity
    @Override
    public List<ProductDto> searchByQuantityGreaterThan(Integer quantity) {
        return productRepository.findByQuantityGreaterThan(quantity)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }
}
