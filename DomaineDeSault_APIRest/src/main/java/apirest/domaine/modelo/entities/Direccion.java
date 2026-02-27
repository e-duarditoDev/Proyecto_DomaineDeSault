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
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="direccion")
public class Direccion implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_direccion")
	private Long idDireccion;
	
	@Column(nullable = false)
	private String calle;
	@Column(nullable = false)
	private String numero;
	@Column(name="codigo_postal")
	private int codigoPostal;
	@Column(nullable = false)
	private String provincia;
	@Column(nullable = false)
	private String localidad;
	
//	@OneToOne (mappedBy = "direccion")
//	private Cliente cliente;
	
	@OneToOne (mappedBy = "direccion", orphanRemoval = true)
	private Usuario usuario;
	
	
}
