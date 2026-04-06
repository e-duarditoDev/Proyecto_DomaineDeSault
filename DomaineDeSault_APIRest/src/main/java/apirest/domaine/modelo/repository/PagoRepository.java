package apirest.domaine.modelo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import apirest.domaine.modelo.entities.Pago;
import jakarta.transaction.Transactional;

public interface PagoRepository extends JpaRepository<Pago, Long>{
	
	//para hacer transacciones bulk (delete/update) necesita de las anotaciones Modifying y Transactional.
	//Ojo int, porque delete devuelve el numero de filas borradas.
	@Modifying(
			clearAutomatically = true, //sicroniza la transaccion
			flushAutomatically = true //limpia el contexto para que Hibernate no trabaje con entidades borradas
			) 
	@Transactional
	@Query("""
			delete from Pago p 
			where p.reserva.idReserva = ?1
			""")
	int elimarPorIdReserva (Long idReserva);
	
	boolean existsByReservaIdReserva (Long idReserva);
	
}
