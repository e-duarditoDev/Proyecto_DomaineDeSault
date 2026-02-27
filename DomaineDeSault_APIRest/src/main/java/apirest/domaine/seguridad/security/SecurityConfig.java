package apirest.domaine.seguridad.security;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	
	@Value("${jwt.secret}")// @Value de la dependencia [..] beans.factory.annotation.Value NO la del Lombok
	private String secret;// mismo secret que en el loginManager
	
	@Bean
	public JwtDecoder jwtDecoder() {
		byte[] keyBytes = Decoders.BASE64.decode(secret);
		SecretKey key = Keys.hmacShaKeyFor(keyBytes);
		
		return NimbusJwtDecoder
				.withSecretKey(key)
				.macAlgorithm(MacAlgorithm.HS256)//si login firma con HS256 aqui tambien
				.build();
	}
	
//	public JwtAuthenticationConverter jwtAuthenticationConverter() {
//		JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
//		
//		grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
//		grantedAuthoritiesConverter.setAuthorityPrefix("");//añade prefijo ROLE_
//		
//		JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
//		authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
//		
//		return authenticationConverter;
//	}
	
	@Bean
	SecurityFilterChain filterChain	(HttpSecurity http) throws Exception{
		
		JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
		
		grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
		grantedAuthoritiesConverter.setAuthorityPrefix("");//añade prefijo ROLE_
		
		JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
		authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
		
		http 
			.csrf(csrf -> csrf.disable())
			.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.cors(c -> {})
			.authorizeHttpRequests(auth -> auth 
					
					//PUBLICAS 
	            	.requestMatchers("/auth/**").permitAll()
	            	
					//DOCUMENTATION SWAGGER
	        		.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html/**").permitAll()
					
					//CLIENTES
					.requestMatchers(HttpMethod.GET, "/cliente/**").hasRole("CLIENTE")
					
					//TRABAJADORES
					.requestMatchers(HttpMethod.GET, "/trabajador/**").hasRole("TRABAJADOR")
					
					//ADMIN
					
					
			.anyRequest().authenticated()
			
					)
			.oauth2ResourceServer(oauth2 -> oauth2 //autenticacion por token, ignora UserDetailsService
					.jwt(jwt -> jwt.jwtAuthenticationConverter(authenticationConverter))
					);
		
		return http.build();
			
	}
	
	
}
