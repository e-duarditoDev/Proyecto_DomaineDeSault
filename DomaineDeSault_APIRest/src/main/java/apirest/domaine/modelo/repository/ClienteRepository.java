package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long>{
	boolean existsByDocumentoIdentidad(String documentoIdentidad);
	Cliente findByDocumentoIdentidad(String documentoIdentidad);

}
