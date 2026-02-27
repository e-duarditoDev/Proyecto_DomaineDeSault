package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long>{

}
