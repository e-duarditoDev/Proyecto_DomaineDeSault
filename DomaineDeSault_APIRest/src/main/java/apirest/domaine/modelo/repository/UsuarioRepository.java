package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
	Usuario findByEmail(String email);
}
