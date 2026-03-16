package seguridad.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter //No @Data para que no genere EqualAndHashCode
@Builder
@Entity
@Table(name = "verificacion_mail")
public class VerificacionMail {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "email", nullable = false, unique = true, length = 255)
	private String email;
	
	@Column(name = "password",nullable = false, length = 255)
	private String password;
	
	@Column(name = "token",nullable = false, unique = true, length = 255)
	private String token;
	
	@Column(name = "alta",nullable = false)
	private LocalDateTime alta;
	
	@Column(name = "expiracion",nullable = false)
	private LocalDateTime expiracion;
	
}
