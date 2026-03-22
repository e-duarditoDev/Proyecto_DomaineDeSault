package apirest.domaine.modelo.dto;

import java.time.LocalDate;

import apirest.domaine.modelo.enumerados.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UsuarioLoginDto {

	private Long idUsuario;
	private LocalDate fechaAlta;
}
