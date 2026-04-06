package apirest.domaine.restcontroller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apirest.domaine.modelo.dto.ClienteDto;
import apirest.domaine.modelo.dto.DireccionDto;
import apirest.domaine.modelo.dto.MiReservaDto;
import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.entities.Direccion;
import apirest.domaine.modelo.repository.UsuarioLoginProjection;
import apirest.domaine.service.ClienteService;
import apirest.domaine.service.DireccionService;
import apirest.domaine.service.ReservaHabitacionesService;
import apirest.domaine.service.ReservaService;
import apirest.domaine.service.UsuarioLoginService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cliente")
public class ClienteRestController {
	
	@Autowired
	private ClienteService clienteServ;
	
	@Autowired
	private UsuarioLoginService usuarioLogServ;
	
	@Autowired
	private DireccionService direccServ;
	
	@Autowired
	private ReservaService resService;
	
	@Autowired
	private ReservaHabitacionesService resHabitacionesServ;
	

	
	
	@GetMapping("/buscar-id/{idUsuario}")
	public ResponseEntity<?> uno (@PathVariable Long idUsuario) {
		
		try {
			Cliente cliente = clienteServ.findById(idUsuario);
			
			if(cliente == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Id de cliente incorrecto.");
			}
			
			return ResponseEntity.ok(ClienteDto.convertToDto(cliente));

			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
			
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}
		
	}
	
	@GetMapping ("/mis-datos")
	public ResponseEntity<ClienteDto> obtenerMisDatos (Authentication auth){
		
	    if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
	        throw new RuntimeException("No se han podido recuperar datos del usuario.");
	    }
		
		
		UsuarioLoginProjection usuarioLogin = usuarioLogServ.findByEmail(auth.getName());
		
		Cliente cliente = clienteServ.misDatos(usuarioLogin.getIdUsuario());
		
		//si no encuentra cliente pinta el formulario vacio, usuario todavia no completado el perfil, no es excepcion
	    if (cliente == null) {
	        return ResponseEntity.ok().body(null);
	    }
		
		return ResponseEntity.ok(ClienteDto.convertToDto(cliente));
	}
	
	@GetMapping("/perfil-completo")
	public ResponseEntity<?> perfilCompleto (Authentication auth){
		
		try {
			
			if (auth == null || auth.getName() == null || auth.getName().isBlank())
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se han podido recuperar datos del usuario.");
			
		    UsuarioLoginProjection usuarioLogin = usuarioLogServ.findByEmail(auth.getName());
		    
		    if (usuarioLogin == null)
		    	return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no registrado.");


		    boolean perfilCompleto = clienteServ.perfilCompleto(usuarioLogin.getIdUsuario());//busca por idUsuario recuperado de UsuarioLogin

		    return ResponseEntity.ok(perfilCompleto);
			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}
		

		
	}
	
//	@PostMapping("/alta-cliente")
//	//se coloca @Valid para activar las validaciones del ClienteDto, devuelve http 400
//	public ResponseEntity<?> inserOne(@Valid @RequestBody ClienteDto clienteDto, Authentication auth){
//		
//		if(clienteDto == null)
//			throw new RuntimeException("El cliente no puede ser nulo.");
//		
//		if(auth == null || auth.getName().isBlank() || auth.getName() == null)
//			throw new RuntimeException("No se ha podido recuperar el email.");
//				
//		UsuarioLoginProjection usuarioLogin = usuarioLogServ.findByEmail(auth.getName());
//		
//		clienteDto.setIdUsuario(usuarioLogin.getIdUsuario());
//		clienteDto.setFechaAlta(usuarioLogin.getFechaAlta());
//		
//		Cliente cliente = ClienteDto.convertToEntity(clienteDto);
//
//		
//		clienteServ.insertOne(cliente);
//		
//		return ResponseEntity.ok().build();
//	}
	
	@PutMapping("/mis-datos")
	//se coloca @Valid para activar las validaciones del ClienteDto, devuelve http 400
	//si una validacion no pasa, lanza MethodArgumentNotValidException que es capturada por GlobalExceptionHandler
	public ResponseEntity<?> guardarMisDatos(@Valid @RequestBody ClienteDto clienteDto, Authentication auth) {
		
		try {
			
		    if (clienteDto == null) {
		    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El cliente no puede ser nulo.");
		    }

		    if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
		    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se han podido recuperar datos del usuario.");
		    }

		    UsuarioLoginProjection usuarioLogin = usuarioLogServ.findByEmail(auth.getName());
		    
	    	// Rescatamos el idDireccion de cliente existente, para sobreescribirla
		    //todo esto vino por un bug, ya que sin esto el idDireccion viene null del clienteDto
		   	Cliente clienteTemp = clienteServ.findById(usuarioLogin.getIdUsuario());
		   	
		   	if (clienteTemp != null) {
		   		Direccion direccion = direccServ.findById(clienteTemp.getDireccion().getIdDireccion());
		   		
		   		DireccionDto direccionDto = new DireccionDto ();
		   		direccionDto = clienteDto.getDireccionDto();
		   		direccionDto.setIdDireccion(direccion.getIdDireccion());
		   		
		   		//Testing
		   		//System.out.println("Direccion: "+ direccionDto);
		   		
		   		clienteDto.setDireccionDto(direccionDto);
		   	}
	    	

		    Cliente cliente = ClienteDto.convertToEntity(clienteDto);
		    
		    cliente.setIdUsuario(usuarioLogin.getIdUsuario());
		    cliente.setFechaAlta(usuarioLogin.getFechaAlta());

		    // Con esto hacemos lo que se conoce como upSert (update + insert)
		    if (clienteServ.perfilCompleto(usuarioLogin.getIdUsuario())) {
		    	
//		    	//Testing
//		    	System.out.println("El id de direccion: "+cliente.getDireccion().getIdDireccion());
		    	
		        clienteServ.updateOne(cliente);
		        
		    } else {
		    	
		        clienteServ.insertOne(cliente);
		    }

		    return ResponseEntity.ok().build();
			
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error del servidor al procesar la reserva");
		}
	}
	
	@GetMapping("/mis-reservas")
	public ResponseEntity<?> verMisReservas (Authentication auth) {
		
		UsuarioLoginProjection usuarioLogin = usuarioLogServ.findByEmail(auth.getName());
		
		if(usuarioLogin == null)
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se han recuperado datos del usuario.");
		
//		List <Reserva> listaReservas = resService.findByClienteIdUsuario(usuarioLogin.getIdUsuario());
//		
//		if (listaReservas.isEmpty())
//			throw new RuntimeException("No hay reservas que mostrar.");
//	
//		
//		for (Reserva reserva : listaReservas) {
//			List <ReservaHabitacion> listaReservaHabitaciones = resHabitacionesServ.findByReservaIdReserva(reserva.getIdReserva());
//			
//			if(listaReservaHabitaciones.isEmpty())
//				throw new RuntimeException("No se encuentran habitaciones reservadas.");
//
//			for (ReservaHabitacion habitacion : listaReservaHabitaciones) {
//						
//			}
//		}
		
		List <MiReservaDto> listaReservas = clienteServ.misReservas(usuarioLogin.getIdUsuario());
		
		if (listaReservas.isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se han recuperado reservas.");
		
		return ResponseEntity.ok(listaReservas);
	}
	
	
	@DeleteMapping("/baja-cliente/{documentoIdentidad}")
	public ResponseEntity<?> deleteOne(@PathVariable String documentoIdentidad){
		Cliente cliente = clienteServ.findByDocumentoIdentidad(documentoIdentidad);
		
		clienteServ.deleteOne(cliente.getIdUsuario());
		
		return ResponseEntity.ok().build();
	}
	
	
	

}
