package apirest.domaine.modelo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Reservas_ServiciosDto {

	private Long idReserva;
	private Long idServicio;
	private int cantidad;
	private double precioTotal;
	
}
