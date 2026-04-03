package apirest.domaine.restcontroller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import apirest.domaine.modelo.dto.PagoDto;
import apirest.domaine.modelo.dto.ReservaPagoRequestDto;
import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Pago;
import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.repository.UsuarioLoginProjection;
import apirest.domaine.service.PagoService;
import apirest.domaine.service.ReservaService;
import apirest.domaine.service.UsuarioLoginService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reserva")
public class ReservasRestController {
	
	
	@Autowired
	private ReservaService resServ;
	
	@Autowired
	private UsuarioLoginService usuLoginServ;
	
	@Autowired
	private PagoService pagoServ;
	
	
	@PostMapping("/guardar-reserva")
	public ResponseEntity<?> guardarReserva (@RequestBody ReservaRequestDto reservaDto, Authentication auth) {
//		debugging
//		System.out.println("ID recibido: " + reservaDto.getIdHabitacion());
//	    System.out.println("Fecha Entrada: " + reservaDto.getFechaEntrada());
		
		try {
			//Extraer el mail del auth
			String email = auth.getName();
			
			//Recuperar el idCliente
			UsuarioLoginProjection usuarioLogin = usuLoginServ.findByEmail(email);//buscar en la tabla usuario
			if (usuarioLogin == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no registrado.");
			
			Long idCliente = usuarioLogin.getIdUsuario();
			
			
			
//	        String mensaje = "PAGAR".equalsIgnoreCase(reservaDto.getAccion())
//	                ? "Reserva pagada con éxito."
//	                : "Reserva guardada con éxito.";
	        
	        
		    resServ.guardarReserva(reservaDto, idCliente);
		    return ResponseEntity.status(HttpStatus.CREATED).body("Reserva guardada con éxito.");
	       
	 
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}		
	}
	
	@PostMapping ("/pagar-reserva")
	//se coloca @Valid para activar las validaciones del ClienteDto, devuelve http 400
	//si una validacion no pasa, lanza MethodArgumentNotValidException que es capturada por GlobalExceptionHandler
	public ResponseEntity<?> pagarReserva (@Valid @RequestBody ReservaPagoRequestDto requestDto, Authentication auth){
		
		try {
			
			String email = auth.getName();
			
			//Recuperar el idCliente
			UsuarioLoginProjection usuarioLogin = usuLoginServ.findByEmail(email);//buscar en la tabla usuario
			if (usuarioLogin == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no registrado.");
			
			Long idCliente = usuarioLogin.getIdUsuario();
			
			ReservaRequestDto reservaDto = requestDto.getReservaDto();
			PagoDto pagoDto = requestDto.getPagoDto();
			
			
			Reserva reserva = resServ.guardarReserva(reservaDto, idCliente);
			
			
			Pago pago = PagoDto.convertToEntity(pagoDto, reserva);
			pagoServ.insertOne(pago);
			
		    return ResponseEntity.status(HttpStatus.CREATED).body("Reserva pagada con éxito.");

			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}
		
	}
	
	
}
