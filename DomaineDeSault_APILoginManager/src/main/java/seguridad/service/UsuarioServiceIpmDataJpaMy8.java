package seguridad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import enumerados.Rol;
import seguridad.model.dto.UsuarioAltaDto;
import seguridad.model.entity.UsuarioLogin;
import seguridad.model.repository.UsuarioLoginRepository;


@Service
public class UsuarioServiceIpmDataJpaMy8 implements UsuarioService{ 

	@Autowired
	private UsuarioLoginRepository usuRepo;
	
	@Autowired //toma el @Bean del security.config
	private PasswordEncoder passwordEncoder;


	@Override 	//con esto se crea un usuario que viene de la bbdd, es de la UserDetailsService
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	    UsuarioLogin usuarioLogin = usuRepo.findByEmail(email);

	    if (usuarioLogin == null) {
	        throw new UsernameNotFoundException(
	            "Email" + email + "no registrado."
	        );
	    }

	    return usuarioLogin;
	}


	@Override
	public UsuarioLogin findByEmailAndPassword(String email, String password) {
		//Recuperar el usuario por email
		UsuarioLogin usuarioLogin = usuRepo.findByEmail(email);
		
		//Comparar las contraseñas en plano desencriptando con PasswordEncoder
		if (usuarioLogin != null && passwordEncoder.matches(password, usuarioLogin.getPassword())) {
			return usuarioLogin;
		}
		
		return null;
	}
	
	@Override
	public UsuarioLogin insertOneCliente (UsuarioAltaDto usuAltaDto) {
		
		UsuarioLogin usuario = UsuarioAltaDto.converToEntity(usuAltaDto);
		
		usuario.setRol(Rol.CLIENTE);
		
		usuario.setPassword(
				passwordEncoder.encode(usuario.getPassword())
				);
		
		return usuRepo.save(usuario);
	}


}
