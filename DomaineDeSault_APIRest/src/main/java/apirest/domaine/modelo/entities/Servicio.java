package apirest.domaine.modelo.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name="SERVICIO")
public class Servicio implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_servicio")
	private Long idServicio;
	@Column(nullable = false, unique = true)
	private String nombre;
	@Column(length = 200)
	private String descripcion;
	@Column(nullable = false, precision = 7, scale = 3)
	private BigDecimal precio;
	
	@OneToMany(mappedBy = "servicio", orphanRemoval = true)
	private List<ReservaServicio> reservaServicio;
	
}
