package apirest.domaine.modelo.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import apirest.domaine.modelo.enumerados.EstadoPago;
import apirest.domaine.modelo.enumerados.MetodoPago;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@Table(name="PAGO")
public class Pago implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_pago")
	private Long idPago;
	
	@OneToOne()
	@JoinColumn(name="id_reserva", nullable = false, unique = true)
	private Reserva reserva;
	
	@Enumerated(EnumType.STRING)
	@Builder.Default
	@Column(name = "metodo_pago", nullable = false)
	private MetodoPago metodoPago = MetodoPago.TARJETA;//metodo de pago por default
	
	@Column(name="fecha_pago", nullable = false, updatable = false)
	private LocalDateTime fechaPago;
	
	@Column(nullable = false, precision = 8, scale = 3)
	private BigDecimal cantidad;
	
	@Enumerated(EnumType.STRING)
	@Builder.Default
	@Column(name = "estado_pago", nullable = false)
	private EstadoPago estadoPago = EstadoPago.PENDIENTE;//estado por default

}
