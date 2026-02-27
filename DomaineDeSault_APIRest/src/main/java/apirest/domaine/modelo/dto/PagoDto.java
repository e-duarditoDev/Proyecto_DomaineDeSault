package apirest.domaine.modelo.dto;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PagoDto {

	private Long idPago;
	private int idReserva;
	private String metodo;
	private double cantidad;
	private LocalDateTime fechaPago;
	private String estado;
}
