package seguridad.service;

import java.util.Optional;

import seguridad.model.entity.VerificacionMail;

public interface VerificacionMailService extends IntCrudGenerico<VerificacionMail, Long> {
	Optional<VerificacionMail> findByToken	(String token);
	boolean existsByEmail(String mail);
	
}
