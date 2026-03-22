package apirest.domaine.modelo.repository;



import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;


import apirest.domaine.modelo.entities.Usuario;

public interface UsuarioLoginRepository extends Repository<Usuario, Long>{
	
//	//Cuando ejecuta la query, devuelve un objeto tenga estos getter, ya tengo creada aparte, pero se puede meter aqui
//	interface UsuarioLoginProjection {
//		Long getIdUsuario();
//		LocalDate getFechaAlta();
//	}
	
	//tiene que ser una consulta SQL nativa por la separacion de APIs, UsuarioLogin de la APILogin
	//que es quien crea el idUsuario, e idUsuario de Usuario de la APIRest es FK de UsuarioLogin 
	//al tener la proyeccion fuera, hay que usar alias para mejor mapeo
	@Query(value = 
			"select u.id_usuario as idUsuario, u.fecha_alta as fechaAlta "
			+ "from usuario_login u "
			+ "where u.email = :email",
			nativeQuery = true)
	UsuarioLoginProjection findByEmail (@Param ("email") String email); 

}
