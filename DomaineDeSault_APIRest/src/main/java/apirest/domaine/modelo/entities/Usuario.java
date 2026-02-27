package apirest.domaine.modelo.entities;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import apirest.domaine.modelo.enumerados.EstadoUsuario;
import apirest.domaine.modelo.enumerados.Rol;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)//porque tiene ID autogenerado
@Entity
@Inheritance(strategy = InheritanceType.JOINED)// Usuario es la tabla padre, de la que heredan Cliente y Trabajador (espacificacion)
@Table(name="usuario")
public class Usuario implements Serializable, UserDetails{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "id_usuario")
	private Long idUsuario;
	
	@Column(nullable = false, unique = true)
	private Long idLogin;
	
	@Column(nullable = false)
	private String nombre;
	
	@Column(name="primer_apellido", nullable = false)
	private String primerApellido;
	
	@Column(name="segundo_apellido")//hay personas que solo tienen un apellido
	private String segundoApellido;
	
	@EqualsAndHashCode.Include //un documento indentidica la entidad
	@Column(name="documento_identidad", unique = true, nullable = false)
	private String documentoIdentidad;
	
	@EqualsAndHashCode.Include //un email identifica la entidad
	@Column(unique = true, nullable = false)
	private String email;
	
	@Column(nullable = false)
	private String password;
	
	@Column(nullable = false)
	private String telefono;
	
	@Enumerated(EnumType.STRING)
	private Rol rol;
	
	@Enumerated(EnumType.STRING)
	private EstadoUsuario estado;
	
	@OneToOne(cascade = CascadeType.ALL) //cascade, guarda cliente guarda direccion, un solo save()
	@JoinColumn(name = "id_direccion")
	private Direccion direccion;
	
	@OneToOne(mappedBy = "usuario")
	private TrabajadorBaja trabajadorBaja;
	
	@OneToOne(mappedBy = "usuario")
	private ClienteBaja clienteBaja;

	//SECURITY
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(
				new SimpleGrantedAuthority("ROLE_"+rol.name())
				);
	}

	@Override
	public String getUsername() {
		return this.email;
	}
	
}
