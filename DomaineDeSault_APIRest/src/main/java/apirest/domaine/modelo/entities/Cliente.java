package apirest.domaine.modelo.entities;

import java.time.LocalDate;
import java.util.List;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter //Data compara mas de lo necesario y genera problemas con el equalAndHashcode y el ToString, usar @getter y @setter
@Entity
@Table(name="cliente")
public class Cliente extends Usuario{
	
	private static final long serialVersionUID = 1L;

	
	@Column(name="fecha_registro", nullable = false, updatable = false)
	private LocalDate fechaRegistro;
	
	@OneToMany(mappedBy = "cliente")
	private List<Reserva> reservas;
	
}
