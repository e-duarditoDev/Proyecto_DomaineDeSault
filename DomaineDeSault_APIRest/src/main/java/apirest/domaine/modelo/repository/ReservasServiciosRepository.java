package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.ReservaServicioId;
import apirest.domaine.modelo.entities.ReservaServicio;

public interface ReservasServiciosRepository extends JpaRepository<ReservaServicio, ReservaServicioId>{

}
