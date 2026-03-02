package seguridad.restcontroller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import enumerados.Rol;
import seguridad.model.dto.UsuarioAltaDto;
import seguridad.model.dto.UsuarioLoginDto;
import seguridad.model.entity.UsuarioLogin;
import seguridad.model.entity.VerificacionMail;
import seguridad.security.JwtSecurityService;
import seguridad.security.SecurityConfig;
import seguridad.service.EmailService;
import seguridad.service.UsuarioLoginService;
import seguridad.service.VerificacionMailService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class HomeRestController {

    //private final SecurityConfig securityConfig;

	@Autowired
	private UsuarioLoginService userService;
	
	@Autowired
	private JwtSecurityService jwtSecurityService;
	
	@Autowired
	private VerificacionMailService veriServ;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EmailService emailServ;

	/*
	 * HomeRestController(SecurityConfig securityConfig) { this.securityConfig =
	 * securityConfig; }
	 */
	
//forma alternativa, sin @Autowired (en teoria mas robusta)
//    private final VerificationTokenRepository verificationRepo;
//    private final PasswordEncoder passwordEncoder;
//
//	  //Con este constructor Spring hace inyeccion de dependencias
//    public AuthController(VerificationTokenRepository verificationRepo,
//                          PasswordEncoder passwordEncoder) {
//        this.verificationRepo = verificationRepo;
//        this.passwordEncoder = passwordEncoder;
//    }

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
		

		String token = jwtSecurityService.generateToken(
				usuarioLogin.getEmail(), 
				usuarioLogin.getAuthorities());
		//System.out.println(token)
		
		//construir un el JSON para React
		Map<String, String> response = new HashMap<>();
		response.put("token", token);
		
		return ResponseEntity.ok(response);
		
		}
	
	@PostMapping("/registro-email")
	public ResponseEntity<?>registroMail(@RequestBody UsuarioAltaDto dto){
		
		//Verificar si existe el usuario
		if (veriServ.existsByEmail(dto.getEmail()))
			return ResponseEntity.badRequest().body("Peticion en curso. Revisa tu email.");
		
		//Generar token aleatorio para el link del mail(no tiene que ver con el del usuario)
		String token = UUID.randomUUID().toString();
		
		//Objeto para capturar los datos del dto del POST
		VerificacionMail vm = new VerificacionMail();
        vm.setEmail(dto.getEmail());
        vm.setPassword(passwordEncoder.encode(dto.getPassword())); //encriptar password
        vm.setToken(token);
        vm.setExpiracion(LocalDateTime.now().plusMinutes(10)); //caducidad del token del link 10 min, agnade 10 min a la hora actual
		
        //guardar datos en tabla verificacion_mail
        veriServ.insertOne(vm);
        
        // Link de confirmación se envia al mail con el token en el header
        String link = "http://localhost:8082/auth/alta-cliente?token=" + token;
        //String link = "https://domainedesault.duckdns.org/auth/confirm?token=" + token;
        
        System.out.println("Enviando mail a: " + dto.getEmail());
        emailServ.sendEmailEs(dto.getEmail(), link);
        
        
		return ResponseEntity.ok(link);
	}
	
	
	@GetMapping("/alta-cliente")
	public ResponseEntity<?> altaCliente (@RequestParam String token){
		
		//buscar el token temporal en la tabla de verificacion_mail
		VerificacionMail vm = veriServ.findByToken(token).orElse(null);
		
		if(vm == null)
			return ResponseEntity.badRequest().body("Token incorrecto");
		
		//verificar expiracion token, si expirado limpia tabla
		if (vm.getExpiracion().isBefore(LocalDateTime.now())) { //si la hora de registro es anterior
			veriServ.deleteOne(vm.getId());
			return ResponseEntity.badRequest().body("Token expirado. Vuelve a registar el email.");
		}
		
		//construir el dto final para alta cliente
		UsuarioAltaDto dto = new UsuarioAltaDto();
		dto.setPassword(vm.getPassword());
		dto.setEmail(vm.getEmail());
		dto.setRol(Rol.CLIENTE); //segun el metodo por donde entre
		
		//Este insertOne ya no tiene el encoder porque ya la contrasegna viene encodeada de verificacio_mail
		userService.insertOneUsuarioSinEncriptacion(dto);
		
		//higiene de la tabla verificacion_token
		veriServ.deleteOne(vm.getId());
		
		return ResponseEntity.ok("Cuenta creada con exito.");
		
		}
	
	
	
}
