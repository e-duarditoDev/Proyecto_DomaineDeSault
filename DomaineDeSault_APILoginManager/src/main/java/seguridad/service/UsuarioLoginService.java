package seguridad.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import seguridad.model.dto.UsuarioAltaDto;
import seguridad.model.entity.UsuarioLogin;



public interface UsuarioLoginService extends UserDetailsService {
		
	UsuarioLogin findByEmailAndPassword(String email, String contrasena);
	UsuarioLogin insertOneUsuario(UsuarioAltaDto usuAltaDto);
	UsuarioLogin insertOneUsuarioSinEncriptacion(UsuarioAltaDto usuAltaDto);
}
