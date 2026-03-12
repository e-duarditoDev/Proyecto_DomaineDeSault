package apirest.domaine.modelo.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.enumerados.EstadoReserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long>{
		
		//Optional es la mejor forma de devolver un objeto que puede ser null
		Optional <Reserva> findByClienteIdUsuarioAndFechaEntradaAndFechaSalidaAndEstadoReserva ( 
				Long idCliente,
				LocalDate fechaEntrada,
				LocalDate fechaSalida,
				EstadoReserva estadoReserva
				); 
		

}
