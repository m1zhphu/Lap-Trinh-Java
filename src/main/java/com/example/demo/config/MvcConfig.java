package com.example.demo.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    // Lấy đường dẫn thư mục upload từ file application.properties
    @Value("${upload.path.base}")
    private String uploadPath;

    /**
     * Cấu hình này ánh xạ các yêu cầu URL bắt đầu bằng "/uploads/**"
     * tới các file nằm trong thư mục upload trên hệ thống file.
     * Ví dụ: URL http://localhost:8080/uploads/ten-file.jpg
     * sẽ trỏ đến file tại <project-folder>/uploads/ten-file.jpg
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(uploadPath);
        String uploadAbsolutePath = uploadDir.toFile().getAbsolutePath();

        // Dòng này rất quan trọng:
        // Nó tạo một URL công khai là "/uploads/**"
        // và ánh xạ nó tới thư mục vật lý được định nghĩa trong upload.path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/" + uploadAbsolutePath + "/");
    }
}