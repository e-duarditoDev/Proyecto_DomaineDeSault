package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long>{

}
