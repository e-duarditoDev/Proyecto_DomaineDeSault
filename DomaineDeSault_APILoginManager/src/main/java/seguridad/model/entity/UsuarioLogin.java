package seguridad.model.entity;

import java.io.Serializable;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter //evita generar el equal
@Builder
@Table(name ="usuario_login")
public class UsuarioLogin implements Serializable, UserDetails{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_login", nullable = false)
	private Long idLogin;
	@Column(nullable = false)
	private String email;
	@Column(nullable = false)
	private String password; 
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol;
	

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(
				new SimpleGrantedAuthority("ROLE_"+rol.name())//he tenido que meter ROLE_ porque no me cogia los roles
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
