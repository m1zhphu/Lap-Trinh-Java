package com.example.demo.config; // (Package của bạn)

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Banner; // Import Order
import com.example.demo.repository.BannerRepository;

@Component
@Order(3) // Chạy sau CategorySeeder (1) và ProductSeeder (2)
public class BannerSeeder implements CommandLineRunner {

    private final BannerRepository bannerRepository;

    // Spring sẽ tự động tiêm BannerRepository vào đây
    public BannerSeeder(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Chỉ chạy seeder này nếu bảng 'banners' chưa có dữ liệu
        if (bannerRepository.count() == 0) {
            System.out.println(">>>> Bắt đầu Seed dữ liệu cho Banners...");

            // Tạo các đối tượng Banner mẫu
            // Giả định rằng các file ảnh này đã tồn tại trong thư mục uploads của bạn
            Banner b1 = Banner.builder()
                    .name("Sale Mùa Hè")
                    .imageUrl("banner1.png") // Tên file ảnh tương ứng
                    .linkUrl("/collection/summer-sale")
                    .status(true)
                    .build();

            Banner b2 = Banner.builder()
                    .name("Bộ Sưu Tập Mới")
                    .imageUrl("banner2.png")
                    .linkUrl("/collection/new-arrivals")
                    .status(true)
                    .build();

            Banner b3 = Banner.builder()
                    .name("Khuyến Mãi Phụ Kiện")
                    .imageUrl("banner3.png")
                    .linkUrl("/categories/phu-kien")
                    .status(true)
                    .build();

            Banner b4 = Banner.builder()
                    .name("Banner Black Friday (Ẩn)")
                    .imageUrl("banner4.png")
                    .linkUrl("/collection/black-friday")
                    .status(false) // Banner này sẽ bị ẩn
                    .build();
            
            Banner b5 = Banner.builder()
                    .name("Free Ship Toàn Quốc")
                    .imageUrl("banner5.png")
                    .linkUrl("/shipping-policy")
                    .status(true)
                    .build();

            // Lưu các banner vào database
            bannerRepository.save(b1);
            bannerRepository.save(b2);
            bannerRepository.save(b3);
            bannerRepository.save(b4);
            bannerRepository.save(b5);

            System.out.println(">>>> Seed dữ liệu cho Banners thành công!");
        } else {
            System.out.println(">>>> Banners đã tồn tại, bỏ qua seeding.");
        }
    }
}