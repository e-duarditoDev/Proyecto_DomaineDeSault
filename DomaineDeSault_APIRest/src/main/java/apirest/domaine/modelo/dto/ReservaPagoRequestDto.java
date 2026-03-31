package apirest.domaine.modelo.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ReservaPagoRequestDto {

	@NotNull //Spring valida no sea null
	@Valid //Valida el objeto interno, cada atributo
	private ReservaRequestDto reservaDto;
	@NotNull
	@Valid
	private PagoDto pagoDto;
}

// Este envolvente sirve para que pagar-reserva reciba la reserva ya http cuando 
// se manda un JSON desde React tiene un solo body. Con esto convierte la el dto de reserva 
// y pago en uno solo.