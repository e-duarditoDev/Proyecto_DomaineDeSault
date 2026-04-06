package apirest.domaine.modelo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ActualizarHuespedesDto {
	
	private Long idReserva;
	private int numHuespedes;
}
