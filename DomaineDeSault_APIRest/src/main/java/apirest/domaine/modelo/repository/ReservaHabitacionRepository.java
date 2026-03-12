package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.ReservaServicioId;
import apirest.domaine.modelo.entities.ReservaHabitacion;
import apirest.domaine.modelo.entities.ReservaHabitacionId;
import apirest.domaine.modelo.entities.ReservaServicio;

public interface ReservaHabitacionRepository extends JpaRepository<ReservaHabitacion, ReservaHabitacionId>{

	//para comprobar si ya existe la misma reserva PENDIENTE
	boolean existsByReservaHabitacionIdIdReservaAndReservaHabitacionIdIdHabitacion(Long idReserva, Long idHabitacion);
}
