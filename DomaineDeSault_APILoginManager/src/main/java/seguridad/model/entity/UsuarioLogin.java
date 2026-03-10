package seguridad.model.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import enumerados.Rol;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter //evita generar el equal
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)//porque tiene ID autogenerado\
@Table(name ="usuario_login")
public class UsuarioLogin implements Serializable, UserDetails{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_usuario", nullable = false)
	private Long idUsuario;
	
	@EqualsAndHashCode.Include //un email identifica la entidad
	@Column(nullable = false, unique = true)
	private String email;
	
	@Column(nullable = false)
	private String password; 
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol;
	
	@Column(nullable = false)
	private LocalDate alta;
	
	

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(
				new SimpleGrantedAuthority("ROLE_"+rol.name())
				);
	}

	@Override
	public @Nullable String getPassword() {
		return this.password;
	}

	@Override
	public String getUsername() {
		return this.email;
	}
	

}
