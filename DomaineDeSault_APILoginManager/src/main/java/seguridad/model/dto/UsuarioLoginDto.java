package seguridad.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import seguridad.model.entity.UsuarioLogin;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UsuarioLoginDto {
	private String email; 
	private String password;
	
}
