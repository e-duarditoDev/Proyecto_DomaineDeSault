package apirest.domaine.modelo.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import apirest.domaine.modelo.dto.ReservaIdHabitacionFechasDto;
import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.enumerados.EstadoReserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long>{
		
		//Optional es la mejor forma de devolver un objeto que puede ser null
		Optional <Reserva> findByClienteIdUsuarioAndFechaEntradaAndFechaSalidaAndEstado ( 
				Long idCliente,
				LocalDate fechaEntrada,
				LocalDate fechaSalida,
				EstadoReserva estadoReserva
				); 
		
		//esta query me devuelve la lista de fechas en las que una habitacion esta reservada
		//para verificar al reserva, si no existe un conflicto de fechas
		@Query("""
				select new apirest.domaine.modelo.dto.ReservaIdHabitacionFechasDto (
						rh.habitacion.idHabitacion,
						r.fechaEntrada,
						r.fechaSalida
				)
				from ReservaHabitacion rh
				join rh.reserva r
				where rh.habitacion.idHabitacion = ?1
				""")
		List <ReservaIdHabitacionFechasDto> findByHabitacionConFechas (Long idHabitacion);

		// Devuelve las fechas ocupadas de TODAS las habitaciones
		@Query("""
				select new apirest.domaine.modelo.dto.ReservaIdHabitacionFechasDto (
						rh.habitacion.idHabitacion,
						r.fechaEntrada,
						r.fechaSalida
				)
				from ReservaHabitacion rh
				join rh.reserva r
				""")
		List <ReservaIdHabitacionFechasDto> findTodasFechasOcupadas ();

		List <Reserva> findByClienteIdUsuario (Long idUsuario);
	
}
