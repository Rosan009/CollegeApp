package com.collegeApp.back_end.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:19006", // Metro Bundler
                        "http://10.0.2.2:8081",   // Emulator
                        "http://192.168.1.5:8081",
                        "http://192.168.1.5:8083",
                        "https://abcd1234.ngrok.io",
                        "http://192.168.4.171:8083"
                )

                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
