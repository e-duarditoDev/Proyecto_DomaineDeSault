package seguridad.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.entity.VerificacionMail;

public interface VerificacionMailRepository extends JpaRepository<VerificacionMail, Long>{
	Optional<VerificacionMail> findByToken	(String token);
	boolean existsByEmail(String mail);
}
