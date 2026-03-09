package seguridad.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.entity.UsuarioLogin;


public interface UsuarioLoginRepository extends JpaRepository<UsuarioLogin, Long>{
	
	UsuarioLogin findByEmail (String email);
	boolean existsByEmail (String email);
}
