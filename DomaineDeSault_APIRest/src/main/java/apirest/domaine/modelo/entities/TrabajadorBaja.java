package apirest.domaine.modelo.entities;

import java.time.LocalDate;

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
@Table(name = "trabajador_baja")
public class TrabajadorBaja {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idBaja;
	@ManyToOne(optional = false)
	@JoinColumn(name = "id_usuario", nullable = false)
	private Usuario usuario;
	@Column(name = "fecha_baja", nullable = false)
	private LocalDate fechaBaja;
	
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private CausaBajaTrabajador causa;
	
}
