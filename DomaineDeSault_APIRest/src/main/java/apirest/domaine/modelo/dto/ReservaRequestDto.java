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
public class ReservaRequestDto {

	private Long idHabitacion;
	private LocalDate fechaEntrada;
	private LocalDate fechaSalida;
	private int numHuespedes;
	private String accion; //detectar que boton ha pulsado el usuario (aceptar o pagar)
	
}
