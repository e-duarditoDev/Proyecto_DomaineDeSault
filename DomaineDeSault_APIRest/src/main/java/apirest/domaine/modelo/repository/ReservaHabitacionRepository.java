package apirest.domaine.modelo.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.ReservaHabitacion;
import apirest.domaine.modelo.entities.ReservaHabitacionId;

public interface ReservaHabitacionRepository extends JpaRepository<ReservaHabitacion, ReservaHabitacionId>{

	//para comprobar si ya existe la misma reserva PENDIENTE
	boolean existsByReservaHabitacionIdIdReservaAndReservaHabitacionIdIdHabitacion(Long idReserva, Long idHabitacion);
	
	List <ReservaHabitacion> findByReservaIdReserva (Long idReserva);
	
}
