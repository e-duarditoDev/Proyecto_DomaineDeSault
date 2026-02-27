package seguridad.restcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.model.dto.UsuarioAltaDto;
import seguridad.model.dto.UsuarioLoginDto;
import seguridad.model.entity.UsuarioLogin;
import seguridad.security.JwtSecurityService;
import seguridad.service.UsuarioService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class HomeRestController {

	@Autowired
	private UsuarioService userService;
	
	@Autowired
	private JwtSecurityService jwtSecurityService;

	
	@GetMapping ("/")
	ResponseEntity<?> home (){
		return ResponseEntity.ok("Te doy la bienvenida.");
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login (@RequestBody UsuarioLoginDto usuDto){
		
		UsuarioLogin usuarioLogin = userService.findByEmailAndPassword(
				usuDto.getEmail(), usuDto.getPassword());

		
		if (usuarioLogin == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
		}
		

		String token = jwtSecurityService.generateToken(usuarioLogin.getEmail(), usuarioLogin.getAuthorities());
		//System.out.println(token);
		return ResponseEntity.ok(token);
		
		}
	
	@PostMapping("/alta-cliente")
	public ResponseEntity<?> login (@RequestBody UsuarioAltaDto usuAltaDto){
		UsuarioLogin usuLogin = userService.insertOneCliente(usuAltaDto);
		
		return ResponseEntity.ok().build();
		
		}
	
	
	
}
