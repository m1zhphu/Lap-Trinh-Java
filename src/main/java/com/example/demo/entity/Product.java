package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private Double price;
    private Integer quantity;

    @Column(name = "sale_price") // Ánh xạ tới cột sale_price trong DB
    private Double salePrice;

    private String image;
    
    private boolean status;
    // Mỗi sản phẩm thuộc về một danh mục
    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("products") // <-- tránh vòng lặp ngược
    private Category category;
}
