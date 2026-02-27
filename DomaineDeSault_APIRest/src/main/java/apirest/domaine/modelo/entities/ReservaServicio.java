package apirest.domaine.modelo.entities;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.Column;
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
@Table(name="reserva_servicio")
public class ReservaServicio implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	//Define la id de la entidad cuando la PK es compuesta en una entidad independiente
	@EmbeddedId
	private ReservaServicioId idResevasServicios;
	
	//MapsId define este atributo como parte de la PK compuesta
	@MapsId("idReserva")
	@ManyToOne(optional = false)
	@JoinColumn(name="id_reserva", nullable = false)
	private Reserva reserva;
	
	@MapsId("idServicio")
	@ManyToOne(optional = false)
	@JoinColumn(name="id_servicio", nullable = false)
	private Servicio servicio;
	
	@Column(name="precio_total", precision = 4, scale = 2)
	private BigDecimal precioTotal;
	
}
