package apirest.domaine.service;




import java.util.List;

import apirest.domaine.modelo.dto.ActualizarHuespedesDto;
import apirest.domaine.modelo.dto.EliminarHabitacionReservaDto;
import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Reserva;

public interface ReservaService extends IntCrudGenerico <Reserva, Long>{
	
	Reserva guardarReserva (ReservaRequestDto reservaRequestDto, Long idCliente);
	
	List <Reserva> findByClienteIdUsuario (Long idUsuario);
	
	Boolean eliminarHabitacion (EliminarHabitacionReservaDto habitacionDto);
	
	Boolean actualizarHuespedes (ActualizarHuespedesDto datosDto);
		
	
}