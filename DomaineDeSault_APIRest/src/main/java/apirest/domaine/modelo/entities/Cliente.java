package apirest.domaine.modelo.entities;

import java.time.LocalDate;
import java.util.List;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter //Data compara mas de lo necesario y genera problemas con el equalAndHashcode y el ToString, usar @getter y @setter
@Entity
@Table(name="cliente")
@PrimaryKeyJoinColumn(name = "id_usuario")//hibernate lo deduce pero asi queda mas explicito
public class Cliente extends Usuario{
	

	
	@Column(name="fecha_alta", nullable = false, updatable = false)
	private LocalDate fechaAlta;
	
	@OneToMany(mappedBy = "cliente")
	private List<Reserva> reservas;
	
}
