package apirest.domaine.service;



import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Reserva;

public interface ReservaService extends IntCrudGenerico <Reserva, Long>{
	
	Reserva guardarReserva (ReservaRequestDto dto, Long idCliente);
		
}
