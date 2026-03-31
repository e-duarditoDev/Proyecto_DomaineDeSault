package apirest.domaine.modelo.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import apirest.domaine.modelo.entities.Pago;
import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.enumerados.EstadoPago;
import apirest.domaine.modelo.enumerados.MetodoPago;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PagoDto {

	private Long idReserva;
	
	@NotBlank (message = "No se ha recuperado el metodo de pago.")
	private String metodo;
	@NotNull (message = "No se ha recuperado la cantidad a recuperar.")
	private BigDecimal cantidad;
	@NotNull (message = "No se ha recuperado la fecha de pago.")
	private LocalDateTime fechaPago;
	@NotNull (message = "No se ha recuperado el estado.")
	private String estado;
	
	public static Pago convertToEntity (PagoDto dto, Reserva reserva) {
		Pago pago = new Pago(); 
				
		pago.setCantidad(dto.getCantidad());
		pago.setEstadoPago(EstadoPago.valueOf(dto.getEstado()));
		pago.setFechaPago(dto.getFechaPago());
		pago.setMetodoPago(MetodoPago.valueOf(dto.getMetodo()));
		pago.setReserva(reserva);
		
		return pago;
	}
}

