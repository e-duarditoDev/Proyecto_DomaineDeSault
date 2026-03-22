package apirest.domaine.service;

import apirest.domaine.modelo.repository.UsuarioLoginProjection;

public interface UsuarioLoginService {
	UsuarioLoginProjection findByEmail (String email);
}
