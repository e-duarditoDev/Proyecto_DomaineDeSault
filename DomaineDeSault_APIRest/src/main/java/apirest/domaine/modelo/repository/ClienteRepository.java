package apirest.domaine.modelo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import apirest.domaine.modelo.dto.MisReservasDto;
import apirest.domaine.modelo.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long>{
	boolean existsByDocumentoIdentidad(String documentoIdentidad);
	
	Cliente findByDocumentoIdentidad(String documentoIdentidad);
	
	@Query(
			"""
			select new apirest.domaine.modelo.dto.MisReservasDto (
				r.fechaEntrada,
				r.fechaSalida,
				r.precioTotal,
				r.idReserva,
				r.estado,
				h.nombre,
				h.tipo)
			from Reserva r 
			join r.reservaHabitaciones rh
			join rh.habitacion h
			where r.cliente.idUsuario = ?1				
			"""
			)
	List <MisReservasDto> misReservas (Long idUsuario);
	

	
}
