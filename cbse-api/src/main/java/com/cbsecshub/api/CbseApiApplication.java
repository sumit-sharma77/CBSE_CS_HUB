package com.cbsecshub.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CbseApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CbseApiApplication.class, args);
    }
}
