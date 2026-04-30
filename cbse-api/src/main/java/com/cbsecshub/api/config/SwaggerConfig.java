package com.cbsecshub.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "springdoc.swagger-ui.enabled", havingValue = "true", matchIfMissing = false)
public class SwaggerConfig {

    @Value("${spring.application.name:CBSE CS Hub API}")
    private String appName;

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title(appName)
                .description("CBSE CS Hub REST API — JWT via httpOnly cookie")
                .version("1.0.0")
                .contact(new Contact().name("CBSE CS Hub").url("https://cbsecshub.com")))
            .addSecurityItem(new SecurityRequirement().addList("CookieAuth"))
            .components(new Components()
                .addSecuritySchemes("CookieAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.APIKEY)
                    .in(SecurityScheme.In.COOKIE)
                    .name("access_token")));
    }
}
