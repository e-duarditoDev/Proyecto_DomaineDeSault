package apirest.domaine.modelo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class HabitacionDto {

	private Long idHabitacion;
	private String nombre;
	private String tipo;
	private String descripcion;
	private int capacidad;
	private double precioNoche;
	private String estado;
	
}
