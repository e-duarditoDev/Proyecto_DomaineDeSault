package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import apirest.domaine.modelo.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long>{
	boolean existsByDocumentoIdentidad(String documentoIdentidad);
	Cliente findByDocumentoIdentidad(String documentoIdentidad);
	
	//tiene que ser una consulta SQL nativa por la separacion de APIs, UsuarioLogin de la APILogin
	//que es quien crea el idUsuario, e idUsuario de Usuario de la APIRest es FK de UsuarioLogin 
	@Query (value = "select c.id_usuario "
			+ "from cliente c "
			+ "join usuario_login ul on ul.id_usuario = c.id_usuario "
			+ "where ul.email = :email",
			nativeQuery = true)
	Long findByUsuario_UsuarioLoginEmail (@Param("email") String email);
	
}
