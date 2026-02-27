package apirest.domaine.modelo.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import apirest.domaine.modelo.enumerados.EstadoHabitacion;
import apirest.domaine.modelo.enumerados.TipoHabitacion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name="habitacion")
public class Habitacion implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_habitacion")
	private Long idHabitacion;
	@Column(nullable = false, unique = true)
	private String nombre;
	@Column(nullable = false)
	private int capacidad; 
	@Column(name="precio_noche", precision = 7, scale = 3, nullable = false)
	private BigDecimal precioNoche;
	@Column(length = 500)
	private String descripcion;
	
	@OneToMany (mappedBy = "habitacion")
	private List<ReservaHabitacion> reservaHabitaciones;
	
	
	@Enumerated(EnumType.STRING)
	@Builder.Default
	@Column(nullable = false)
	private TipoHabitacion tipo = TipoHabitacion.DOBLE;
	
	@Enumerated(EnumType.STRING)
	@Builder.Default
	@Column(nullable = false)
	private EstadoHabitacion estado = EstadoHabitacion.DISPONIBLE;
	
	
}
