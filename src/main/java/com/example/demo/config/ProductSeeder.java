package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order; // Import Order
import org.springframework.stereotype.Component;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;

@Component
@Order(2) // 2. ĐÁNH DẤU ƯU TIÊN: Chạy file này sau file CategorySeeder
public class ProductSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public ProductSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Chỉ chạy seeder này nếu đã có danh mục và chưa có sản phẩm nào
        if (categoryRepository.count() > 0 && productRepository.count() == 0) {
            // Lấy lại các đối tượng Category từ database để liên kết
            Category ao = categoryRepository.findByName("Áo").orElseThrow();
            Category quan = categoryRepository.findByName("Quần").orElseThrow();
            Category vayDam = categoryRepository.findByName("Váy Đầm").orElseThrow();
            Category giayDep = categoryRepository.findByName("Giày Dép").orElseThrow();
            Category phuKien = categoryRepository.findByName("Phụ Kiện").orElseThrow();

            // Tạo các sản phẩm
            Product p1 = Product.builder().name("Áo Sơ Mi Oxford Dài Tay").description("Chất liệu cotton thoáng mát...").price(450000.0).salePrice(399000.0).quantity(30).category(ao).image("ao-so-mi-oxford.jpg").status(true).build();
            Product p2 = Product.builder().name("Áo Thun Cotton Cổ Tròn").description("Vải co giãn 4 chiều...").price(250000.0).quantity(50).category(ao).image("ao-thun-cotton.jpg").status(true).build(); // Không có giá giảm
            Product p3 = Product.builder().name("Quần Jeans Skinny Fit").description("Form ôm tôn dáng...").price(550000.0).quantity(40).category(quan).image("quan-jeans-skinny.jpg").status(true).build(); // Không có giá giảm
            Product p4 = Product.builder().name("Quần Kaki Chino Dáng Suông").description("Thoải mái và lịch sự...").price(490000.0).salePrice(450000.0).quantity(35).category(quan).image("quan-kaki-chino.jpg").status(true).build();
            Product p5 = Product.builder().name("Váy Hoa Nhí Vintage").description("Thiết kế tay bồng...").price(650000.0).salePrice(590000.0).quantity(25).category(vayDam).image("vay-hoa-nhi.jpg").status(true).build();
            Product p6 = Product.builder().name("Chân Váy Chữ A Công Sở (Ẩn)").description("Chất liệu kaki dày dặn...").price(390000.0).quantity(30).category(vayDam).image("chan-vay-chu-a.jpg").status(false).build(); // Sản phẩm bị ẩn
            Product p7 = Product.builder().name("Giày Sneaker Da Trắng").description("Đế cao su êm ái...").price(890000.0).quantity(20).category(giayDep).image("giay-sneaker-da-trang.jpg").status(true).build(); // Không có giá giảm
            Product p8 = Product.builder().name("Giày Cao Gót Mũi Nhọn").description("Thiết kế mũi nhọn sang trọng...").price(750000.0).salePrice(699000.0).quantity(15).category(giayDep).image("giay-cao-got.jpg").status(true).build();
            Product p9 = Product.builder().name("Túi Xách Tote Da").description("Không gian rộng rãi...").price(1200000.0).quantity(18).category(phuKien).image("tui-xach-tote.jpg").status(true).build(); // Không có giá giảm
            Product p10 = Product.builder().name("Kính Mát Gọng Tròn").description("Tròng kính chống tia UV400...").price(500000.0).salePrice(350000.0).quantity(22).category(phuKien).image("kinh-mat-gong-tron.jpg").status(true).build();

            productRepository.save(p1);
            productRepository.save(p2);
            productRepository.save(p3);
            productRepository.save(p4);
            productRepository.save(p5);
            productRepository.save(p6);
            productRepository.save(p7);
            productRepository.save(p8);
            productRepository.save(p9);
            productRepository.save(p10);

            System.out.println(">>>> Seed dữ liệu cho Products thành công!");
        }
    }
}