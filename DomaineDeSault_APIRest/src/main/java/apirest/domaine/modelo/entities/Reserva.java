package apirest.domaine.modelo.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import apirest.domaine.modelo.enumerados.EstadoReserva;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table(name="reserva")
public class Reserva implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_reserva")
	private Long idReserva;
	
	@OneToMany(mappedBy = "reserva", orphanRemoval = true)
	private List<ReservaHabitacion> reservaHabitaciones;
	
	@OneToMany(mappedBy = "reserva", orphanRemoval = true)
	private List<ReservaServicio> reservaServicio;
	
	@ManyToOne(optional = false)
	@JoinColumn(name="id_cliente", nullable = false)
	private Cliente cliente;
	
	@OneToOne(mappedBy = "reserva")
	private Pago pago;
	
	@Column(name="fecha_entrada", nullable = false)
	private LocalDate fechaEntrada;
	
	@Column(name="fecha_salida", nullable = false)
	private LocalDate fechaSalida;
	
	@Column(name="precio_total", nullable = false, precision = 4, scale = 2)
	private BigDecimal precioTotal;
	
	@Builder.Default
	@Enumerated(EnumType.STRING)
	@Column(name="estado_reserva", nullable = false)
	private EstadoReserva estadoReserva = EstadoReserva.PENDIENTE;
	
	
}
