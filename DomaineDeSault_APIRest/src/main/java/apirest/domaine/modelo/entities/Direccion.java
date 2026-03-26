package apirest.domaine.modelo.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter //No ponemos Data porque genera problemas de comparacion y comportamientos raros
@Builder
@Entity
@Table(name="direccion")
public class Direccion implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_direccion")
	private Long idDireccion;
	
	@Column(nullable = false, length = 80)
	private String calle;
	@Column(nullable = false, length = 10)
	private String numero;
	@Column(name="codigo_postal")
	private Integer codigoPostal; //Integer porque si viene vacion es null, si int seria 0 que no seria CP valido
	@Column(nullable = false, length = 30)
	private String provincia;
	@Column(nullable = false, length = 30)
	private String localidad;
	
//	@OneToOne (mappedBy = "direccion")
//	private Cliente cliente;
	
	@OneToOne (mappedBy = "direccion", orphanRemoval = true)
	private Usuario usuario;
	
	
}
