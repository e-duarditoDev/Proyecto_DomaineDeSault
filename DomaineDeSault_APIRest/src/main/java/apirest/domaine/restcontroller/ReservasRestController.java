package apirest.domaine.restcontroller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import apirest.domaine.modelo.dto.ActualizarHuespedesDto;
import apirest.domaine.modelo.dto.EliminarHabitacionReservaDto;
import apirest.domaine.modelo.dto.PagoDto;
import apirest.domaine.modelo.dto.ReservaPagoRequestDto;
import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Pago;
import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.entities.ReservaHabitacion;
import apirest.domaine.modelo.entities.ReservaHabitacionId;
import apirest.domaine.modelo.enumerados.EstadoPago;
import apirest.domaine.modelo.enumerados.EstadoReserva;
import apirest.domaine.modelo.enumerados.MetodoPago;
import apirest.domaine.modelo.repository.UsuarioLoginProjection;
import apirest.domaine.service.PagoService;
import apirest.domaine.service.ReservaHabitacionesService;
import apirest.domaine.service.ReservaService;
import apirest.domaine.service.UsuarioLoginService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/reserva")
public class ReservasRestController {
	
	
	@Autowired
	private ReservaService resServ;
	
	@Autowired
	private UsuarioLoginService usuLoginServ;
	
	@Autowired
	private PagoService pagoServ;
	
	@Autowired
	private ReservaHabitacionesService resHabServ;
	
	
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
	
	
	@PostMapping("/pagar-reserva-existente")
	public ResponseEntity<?> pagarReservaExistente (@Valid @RequestBody PagoDto pagoDto, Authentication auth){
		
		System.out.println("ID RESERVA:" +pagoDto.getIdReserva());
		
		try {
			
			String email = auth.getName();
			
			//Recuperar el idCliente
			UsuarioLoginProjection usuarioLogin = usuLoginServ.findByEmail(email);//buscar en la tabla usuario
			if (usuarioLogin == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no registrado.");
			
			Reserva reserva = resServ.findById(pagoDto.getIdReserva());
			
			if (reserva == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
			
			if (pagoDto.getEstado().equalsIgnoreCase("pendiente")) {
	            reserva.setEstado(EstadoReserva.COMPROMETIDA);
	        } 
			
			if (pagoDto.getEstado().equalsIgnoreCase("pagado")) {
	            reserva.setEstado(EstadoReserva.CONFIRMADA);
	        }
			
			Pago pagoNuevo = PagoDto.convertToEntity(pagoDto, reserva);
				
			resServ.updateOne(reserva);
				
			if (pagoServ.existsByReservaIdReserva(pagoDto.getIdReserva())) {
				
				Pago pagoExistente = reserva.getPago();

				pagoExistente.setCantidad(pagoDto.getCantidad());
		        pagoExistente.setEstadoPago(EstadoPago.valueOf(pagoDto.getEstado()));
		        pagoExistente.setFechaPago(pagoDto.getFechaPago());
		        pagoExistente.setMetodoPago(MetodoPago.valueOf(pagoDto.getMetodo()));
		            
				pagoServ.updateOne(pagoExistente);
				
				} else {
					
				pagoServ.insertOne(pagoNuevo);
				
				}
			
			if (pagoDto.getEstado().equalsIgnoreCase("pendiente")){
	            return ResponseEntity.status(HttpStatus.CREATED).body("Reserva comprometida a pagar en mostrador.");
			}
				
				return ResponseEntity.status(HttpStatus.CREATED).body("Reserva pagada con éxito.");
			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar el pago.");
		}
				
	}
	
	@PutMapping("/eliminar-habitacion")
	public ResponseEntity<?> eliminarHabitacion(@RequestBody EliminarHabitacionReservaDto habitacionDto) {
		
		try {
		
			Boolean exito = resServ.eliminarHabitacion(habitacionDto);
			
			if (!exito) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ha ocurrido un error durante la transaccion.");
			}
						
			return ResponseEntity.ok().build();
			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}
		
	}
	
	@DeleteMapping ("/cancelar-reserva/{idReserva}")
	public ResponseEntity<?> eliminarReserva (@PathVariable Long idReserva, Authentication auth){
		
		try {
			
	        String email = auth.getName();

	        UsuarioLoginProjection usuarioLogin = usuLoginServ.findByEmail(email);
	        if (usuarioLogin == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no registrado.");
	        }
	        
	        List <ReservaHabitacion> listaHabitaciones = resHabServ.findByReservaIdReserva(idReserva);
	        
	        if (listaHabitaciones.isEmpty())
	        	 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La reserva no tiene habitaciones.");
	        
	        for (ReservaHabitacion rh : listaHabitaciones) {
	        	
	        	ReservaHabitacionId rhId = new ReservaHabitacionId(
	        			rh.getReserva().getIdReserva(),
	        			rh.getHabitacion().getIdHabitacion()
	        			);
	        	
	        	resHabServ.deleteOne(rhId);
			}
	        
	        pagoServ.eliminarPorIdReserva(idReserva);
	        resServ.deleteOne(idReserva);
	        
//			int resultado = resServ.deleteOne(idReserva);
//			
//			if (resultado == 0) {
//				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ha habido un error durante la transaccion.");
//			}
			
			return ResponseEntity.ok().body("Reserva cancelada con exito.");
			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}
		
	}
	
	@PutMapping("/actualizar-huespedes")
	public ResponseEntity<?> actualizarHuespedes(@RequestBody ActualizarHuespedesDto datosDto) {
		
		try {
			
			if (!resServ.actualizarHuespedes(datosDto))
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ha ocurrido un error.");
			
			return ResponseEntity.ok().build();
			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}
		
	}	
}
