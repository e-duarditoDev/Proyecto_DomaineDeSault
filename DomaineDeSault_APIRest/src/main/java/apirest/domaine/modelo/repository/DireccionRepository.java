package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.Direccion;

public interface DireccionRepository extends JpaRepository<Direccion, Long>{
}
