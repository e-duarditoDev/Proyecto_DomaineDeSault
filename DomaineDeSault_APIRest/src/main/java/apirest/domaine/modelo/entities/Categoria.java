package apirest.domaine.modelo.entities;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name="categoria")
public class Categoria {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_categoria")
	private Long idCategoria;
	@Column(unique = true, nullable = false)
	private String nombre;
	@Column(name = "salario_base", nullable = false, precision = 8, scale = 3)
	private BigDecimal salarioBase;
	
	@OneToMany (mappedBy = "categoria")//OneToMany siempre devuelve coleccion
	private List<Trabajador>trabajadores;

}
