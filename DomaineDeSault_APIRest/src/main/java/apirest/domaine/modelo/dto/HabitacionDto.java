package apirest.domaine.modelo.dto;


import java.math.BigDecimal;

import apirest.domaine.modelo.entities.Habitacion;
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
	private int capacidad;
	private BigDecimal precioNoche;
	private String estado;
	
    public static HabitacionDto convertToDto (Habitacion habitacion) {
        HabitacionDto dto = new HabitacionDto();

        dto.setCapacidad(habitacion.getCapacidad());
        dto.setEstado(habitacion.getEstado().name());
        dto.setIdHabitacion(habitacion.getIdHabitacion());
        dto.setNombre(habitacion.getNombre());
        dto.setPrecioNoche(habitacion.getPrecioNoche());
        dto.setTipo(habitacion.getTipo().name());

        return dto;

    }
	
}
