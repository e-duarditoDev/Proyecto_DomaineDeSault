package apirest.domaine.modelo.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

//Representa la PK de la tabla reserva_servicio, cuando la PK es compuesta
@Embeddable
public class ReservaServicioId implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Column(name="id_reserva")
	private Long idReserva;
	@Column(name="id_servicio")
	private Long idServicio;
}
