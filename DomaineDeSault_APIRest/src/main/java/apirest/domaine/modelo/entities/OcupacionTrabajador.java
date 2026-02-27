package apirest.domaine.modelo.entities;

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
@Table(name="ocupacion")
public class OcupacionTrabajador {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_ocupacion")
	private Long idOcupacion;
	@Column(nullable = false, unique = true)
	private String nombre;
	
	@OneToMany(mappedBy = "ocupacionTrabajador")//OneToMany siempre devuelve coleccion
	private List<Trabajador>trabajadores;

}
