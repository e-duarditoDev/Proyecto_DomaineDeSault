package apirest.domaine.service;




import java.util.List;

import apirest.domaine.modelo.dto.ReservaIdHabitacionFechasDto;
import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Reserva;

public interface ReservaService extends IntCrudGenerico <Reserva, Long>{
	
	Reserva guardarReserva (ReservaRequestDto dto, Long idCliente);

	List <Reserva> findByClienteIdUsuario (Long idUsuario);

	List<ReservaIdHabitacionFechasDto> getFechasOcupadasPorHabitacion (Long idHabitacion);

	List<ReservaIdHabitacionFechasDto> getTodasFechasOcupadas ();}
		
