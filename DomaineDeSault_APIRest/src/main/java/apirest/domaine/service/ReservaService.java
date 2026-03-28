package apirest.domaine.service;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.Query;

import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Reserva;

public interface ReservaService extends IntCrudGenerico <Reserva, Long>{
	
	Reserva crearReserva (ReservaRequestDto dto, Long idCliente);
		

}
