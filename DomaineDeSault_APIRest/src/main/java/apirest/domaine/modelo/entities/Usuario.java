package apirest.domaine.modelo.entities;


import apirest.domaine.modelo.enumerados.EstadoUsuario;
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
@Entity
@Inheritance(strategy = InheritanceType.JOINED)// Usuario es la tabla padre, de la que heredan Cliente y Trabajador (espacificacion)
@Table(name="usuario")
public class Usuario{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "id_usuario")
	private Long idUsuario;
	
	//se crea una FK desde workbench porque UsuarioLogin pertenece a la API Login
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
	
	@Column(nullable = false)
	private String telefono;
	
	@Enumerated(EnumType.STRING)
	private EstadoUsuario estado;
	
	@OneToOne(cascade = CascadeType.ALL) //cascade, guarda cliente guarda direccion, un solo save()
	@JoinColumn(name = "id_direccion")
	private Direccion direccion;
	
	@OneToOne(mappedBy = "usuario")
	private TrabajadorBaja trabajadorBaja;
	
	@OneToOne(mappedBy = "usuario")
	private ClienteBaja clienteBaja;

	
}
