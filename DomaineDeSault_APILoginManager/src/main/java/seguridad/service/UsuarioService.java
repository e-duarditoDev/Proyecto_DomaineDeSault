package seguridad.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import seguridad.model.dto.UsuarioAltaDto;
import seguridad.model.entity.UsuarioLogin;



public interface UsuarioService extends UserDetailsService {
		
	UsuarioLogin findByEmailAndPassword(String email, String contrasena);
	UsuarioLogin insertOneCliente(UsuarioAltaDto usuAltaDto);
}
