package apirest.domaine.modelo.entities;

import java.io.Serializable;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="reserva_habitacion")
public class ReservaHabitacion implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	//Define la id de la entidad cuando la PK es compuesta en una entidad independiente
	@EmbeddedId
	private ReservaHabitacionId reservaHabitacionId;
	
	//MapsId define este atributo como parte de la PK compuesta
	@MapsId("idHabitacion")
	@ManyToOne(optional = false)
	@JoinColumn(name = "id_habitacion", nullable = false)
	private Habitacion habitacion;
	
	@MapsId("idReserva")
	@ManyToOne(optional = false)
	@JoinColumn(name = "id_reserva", nullable = false)
	private Reserva reserva;
	
	
}
