package seguridad.model.dto;

import enumerados.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import seguridad.model.entity.UsuarioLogin;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UsuarioAltaDto {
	private String email; 
	private String password;
	private Rol rol;
	
	public static UsuarioLogin converToEntity (UsuarioAltaDto usuarioAlta ) {
		UsuarioLogin usuLogin = new UsuarioLogin();
		
		usuLogin.setEmail(usuarioAlta.getEmail());
		usuLogin.setPassword(usuarioAlta.getPassword());
		usuLogin.setRol(usuarioAlta.getRol());
		
		return usuLogin;
	}
	
}
