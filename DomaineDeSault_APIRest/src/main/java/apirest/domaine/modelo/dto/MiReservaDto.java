package apirest.domaine.modelo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import apirest.domaine.modelo.enumerados.EstadoReserva;
import apirest.domaine.modelo.enumerados.TipoHabitacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MiReservaDto {
	
	private LocalDate fechaEntrada; //mismo orden estan en la @Query de ClienteRepository por usar @AllArgsConstructor
	private LocalDate fechaSalida;
	private BigDecimal precioTotal;
	private Long idReserva;
	private EstadoReserva estadoReserva;
	private int numHuespedes;
	private String nombreHabitacion;
	private TipoHabitacion tipoHabitacion;
	private Long idHabitacion;
	private int capacidad;
}

