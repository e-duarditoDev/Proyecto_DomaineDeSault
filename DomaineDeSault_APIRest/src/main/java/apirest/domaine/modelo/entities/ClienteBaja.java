package apirest.domaine.modelo.entities;

import java.time.LocalDate;

import apirest.domaine.modelo.enumerados.CausaBajaCliente;
import apirest.domaine.modelo.enumerados.CausaBajaTrabajador;
import apirest.domaine.modelo.enumerados.Rol;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "cliente_baja")
public class ClienteBaja {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idBaja;
	@ManyToOne //porque un cliente puede darse de baja, volver a dar de alta, y volver a borrarse
	@JoinColumn(name = "id_usuario", unique = true, nullable = false)
	private Usuario usuario;
	@Column(nullable = false)
	private LocalDate fechaBaja;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CausaBajaCliente causa;
	
}
