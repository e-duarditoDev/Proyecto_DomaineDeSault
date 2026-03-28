package apirest.domaine.modelo.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ReservaIdHabitacionFechasDto {

	private Long idHabitacion;
	private LocalDate fechaEntrada;
	private LocalDate fechaSalida;	

}

//este dto para el new de ReservaRepository, para hacer la jpql que devuelve
//la lista de fechas en las que una habitacion esta reservada