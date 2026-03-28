package apirest.domaine.restcontroller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.repository.UsuarioLoginProjection;
import apirest.domaine.service.ClienteService;
import apirest.domaine.service.ReservaHabitacionesService;
import apirest.domaine.service.ReservaService;
import apirest.domaine.service.ReservaServiciosService;
import apirest.domaine.service.UsuarioLoginService;

@RestController
@RequestMapping("/api/reserva")
public class ReservasRestController {
	
	@Autowired
	private ClienteService clienteServ;
	
	@Autowired
	private ReservaService resServ;
	
	@Autowired
	private UsuarioLoginService usuLoginServ;
	
	@Autowired
	private ReservaServiciosService resServiciosServ;
	
	@Autowired
	private ReservaHabitacionesService resHabitacionesServ;
	
	
	@PostMapping("/reservar-habitacion")
	public ResponseEntity<?> crearReserva (@RequestBody ReservaRequestDto reservaDto, Authentication auth) {
//		debugging
//		System.out.println("ID recibido: " + reservaDto.getIdHabitacion());
//	    System.out.println("Fecha Entrada: " + reservaDto.getFechaEntrada());
		
		try {
			//Extraer el mail del auth
			String email = auth.getName();
			
			//Recuperar el idCliente
			UsuarioLoginProjection usuarioLogin = usuLoginServ.findByEmail(email);//buscar en la tabla usuario
			Long idCliente = usuarioLogin.getIdUsuario();
			
			
			
	        String mensaje = "PAGAR".equalsIgnoreCase(reservaDto.getAccion())
	                ? "Reserva pagada con éxito."
	                : "Reserva guardada con éxito.";
			 			
	        resServ.crearReserva(reservaDto, idCliente);

			return ResponseEntity.status(HttpStatus.CREATED).body(mensaje);
			 
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}		
	}
}
