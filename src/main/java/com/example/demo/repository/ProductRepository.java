package com.example.demo.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Product;

@Repository  // Annotation để Spring quản lý Repository này
public interface ProductRepository extends JpaRepository<Product, Integer> {
     //Thêm một phương thức mới sử dụng @Query để buộc JPA phải lấy cả Category.
     @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category")
     List<Product> findAllWithCategory();

     // 1. Tìm sản phẩm theo tên, không phân biệt hoa/thường
     List<Product> findByNameContainingIgnoreCase(String keyword);

     // 2. Tìm sản phẩm theo khoảng giá
     List<Product> findByPriceBetween(Double min, Double max);
 
     // 3. Tìm sản phẩm có số lượng lớn hơn giá trị cho trước
     List<Product> findByQuantityGreaterThan(Integer quantity);
}
