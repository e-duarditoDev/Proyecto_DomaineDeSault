package apirest.domaine.modelo.repository;

import java.time.LocalDate;

//Esta proyeccion de la API Login para ser usada en el UsuarioLoginRepository
public interface UsuarioLoginProjection {
	Long getIdUsuario();
	LocalDate getFechaAlta();

}
