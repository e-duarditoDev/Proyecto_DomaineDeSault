package apirest.domaine.modelo.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ReservaDto {

	private Long idReserva;
	private Long idCliente;
	private Long idHabitacion;
	private LocalDate fechaEntrada;
	private LocalDate fechaSalida;
	private double precioTotal;
	private String estado;
	
}
