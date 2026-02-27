package apirest.domaine.modelo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ServicioDto {

	private Long idServicio;
	private String nombre; 
	private String descripcion;
	private double precio;
}
