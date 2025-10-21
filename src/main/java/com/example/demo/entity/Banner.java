package com.example.demo.entity; // (Package của bạn)

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "banners") // Tên bảng trong database
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Tên banner (ví dụ: "Sale Black Friday")

    @Column(nullable = false)
    private String imageUrl; // Tên file ảnh đã lưu (ví dụ: "banner1_1678886400000.jpg")

    private String linkUrl; // Đường dẫn khi click vào banner (tùy chọn)

    @Column(nullable = false)
    private Boolean status = true; // Trạng thái (true: hiển thị, false: ẩn) - Mặc định là true
}