package apirest.domaine.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI domaineDeSaultOpenAPI() {
		final String securitySchemeName = "bearerAuth";

		return new OpenAPI()
				.info(new Info()
						.title("Domaine de Sault API")
						.version("v1")
						.description("API REST para gestion de reservas, clientes y habitaciones del proyecto Domaine de Sault.")
						.contact(new Contact()
								.name("Equipo Domaine de Sault")
								.email("equipo@domainedesault.local")
								.url("https://domainedesault.duckdns.org")))
				.addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
				.schemaRequirement(securitySchemeName, new SecurityScheme()
						.name(securitySchemeName)
						.type(SecurityScheme.Type.HTTP)
						.scheme("bearer")
						.bearerFormat("JWT"));
	}
}