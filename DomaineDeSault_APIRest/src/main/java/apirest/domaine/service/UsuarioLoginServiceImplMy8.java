package apirest.domaine.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.repository.UsuarioLoginProjection;
import apirest.domaine.modelo.repository.UsuarioLoginRepository;

@Service
public class UsuarioLoginServiceImplMy8 implements UsuarioLoginService{

	@Autowired
	private UsuarioLoginRepository usuLoginRepo;

	@Override
	public UsuarioLoginProjection findByEmail(String email) {
		if (email == null || email.isBlank())
			throw new RuntimeException("El email no puede ser nulo.");
		
		UsuarioLoginProjection usuarioLogin = usuLoginRepo.findByEmail(email);
		
		if(usuarioLogin == null)
			throw new RuntimeException("No existe usuario registrado con el email "+email);
		
		return usuarioLogin;
	}

	
}
