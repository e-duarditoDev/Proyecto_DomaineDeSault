package apirest.domaine.modelo.entities;



import java.math.BigDecimal;

import apirest.domaine.modelo.enumerados.EstadoTrabajador;
import apirest.domaine.modelo.enumerados.Turno;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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
@Table(name="trabajador")
public class Trabajador extends Usuario{

	private static final long serialVersionUID = 1L;
	
	@Column (name="num_seguridad_social", unique = true, nullable = false)
	private String numSeguridadSocial;
	@ManyToOne(optional = false)
	@JoinColumn(name="id_categoria", nullable = false)
	private Categoria categoria;
	@ManyToOne(optional = false)
	@JoinColumn(name="id_ocupacion", nullable = false)
	private OcupacionTrabajador ocupacionTrabajador;
	@ManyToOne(optional = false)
	@JoinColumn(name="id_departamento", nullable = false)
	private Departamento departamento;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Turno turno;
	@Column(name = "salario_base", nullable = false, precision = 8, scale = 3)
	private BigDecimal salarioBase;
	@Column(nullable = false, precision = 8, scale = 3)
	private BigDecimal complemento;
	
	//insetable y updatable = false porque es autogenerado en la bbdd. Suma de salarioBase + complemento
	@Column(name = "salario_total", insertable = false, updatable = false, precision = 8, scale = 3)
	private BigDecimal salarioTotal;
	
	@Column(name="estado_trabajador", nullable = false)
	@Enumerated(EnumType.STRING) 
	private EstadoTrabajador estadoTrabajador;
 
}
