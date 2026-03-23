package apirest.domaine.restcontroller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apirest.domaine.modelo.dto.ClienteDto;

import apirest.domaine.modelo.entities.Cliente;

import apirest.domaine.modelo.repository.UsuarioLoginProjection;
import apirest.domaine.service.ClienteService;

import apirest.domaine.service.UsuarioLoginService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cliente")
public class ClienteRestController {
	
	@Autowired
	private ClienteService clienteServ;
	
	
	@Autowired
	private UsuarioLoginService usuarioLogiServ;

	
	
	@GetMapping("/buscar-id/{idUsuario}")
	public ResponseEntity<?> uno(@PathVariable Long idUsuario) {
		Cliente cliente = clienteServ.findById(idUsuario);
		
		if(cliente == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Id de cliente incorrecto.");
		}
		
		return ResponseEntity.ok(ClienteDto.convertToDto(cliente));
	}
	
	@GetMapping ("/mis-datos")
	public ResponseEntity<ClienteDto> obtenerMisDatos (Authentication auth){
		
	    if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
	        throw new RuntimeException("No se han podido recuperar datos del usuario.");
	    }
		
		
		UsuarioLoginProjection usuarioLogin = usuarioLogiServ.findByEmail(auth.getName());
		
		Cliente cliente = clienteServ.misDatos(usuarioLogin.getIdUsuario());
		
		//si no encuentra cliente pinta el formulario vacio, usuario todavia no completado el perfil, no es excepcion
	    if (cliente == null) {
	        return ResponseEntity.ok().body(null);
	    }
		
		return ResponseEntity.ok(ClienteDto.convertToDto(cliente));
	}
	
	@GetMapping("/perfil-completo")
	public ResponseEntity<?> perfilCompleto (Authentication auth){
		
		if (auth == null || auth.getName() == null || auth.getName().isBlank())
			throw new RuntimeException("No se han podido recuperar datos del usuario.");
		
	    UsuarioLoginProjection usuarioLogin = usuarioLogiServ.findByEmail(auth.getName());

	    boolean perfilCompleto = clienteServ.perfilCompleto(usuarioLogin.getIdUsuario());//busca por idUsuario recuperado de UsuarioLogin

	    return ResponseEntity.ok(perfilCompleto);
		
	}
	
	@PostMapping("/alta-cliente")
	//se coloca @Valid para activar las validaciones del ClienteDto, devuelve http 400
	public ResponseEntity<?> inserOne(@Valid @RequestBody ClienteDto clienteDto, Authentication auth){
		
		if(clienteDto == null)
			throw new RuntimeException("El cliente no puede ser nulo.");
		
		if(auth == null || auth.getName().isBlank() || auth.getName() == null)
			throw new RuntimeException("No se ha podido recuperar el email.");
				
		UsuarioLoginProjection usuarioLogin = usuarioLogiServ.findByEmail(auth.getName());
		
		clienteDto.setIdUsuario(usuarioLogin.getIdUsuario());
		clienteDto.setFechaAlta(usuarioLogin.getFechaAlta());
		
		Cliente cliente = ClienteDto.convertToEntity(clienteDto);

		
		clienteServ.insertOne(cliente);
		
		return ResponseEntity.ok().build();
	}
	
	@PutMapping("/mis-datos")
	public ResponseEntity<?> guardarMisDatos(@Valid @RequestBody ClienteDto clienteDto, Authentication auth) {

	    if (clienteDto == null) {
	        throw new RuntimeException("El cliente no puede ser nulo.");
	    }

	    if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
	        throw new RuntimeException("No se han podido recuperar datos del usuario.");
	    }

	    UsuarioLoginProjection usuarioLogin = usuarioLogiServ.findByEmail(auth.getName());

	    Cliente cliente = ClienteDto.convertToEntity(clienteDto);
	    cliente.setIdUsuario(usuarioLogin.getIdUsuario());
	    cliente.setFechaAlta(usuarioLogin.getFechaAlta());

	    // con esto hacermos lo que se conoce con upSert (update + insert)
	    if (clienteServ.perfilCompleto(usuarioLogin.getIdUsuario())) {
	        clienteServ.updateOne(cliente);
	    } else {
	        clienteServ.insertOne(cliente);
	    }

	    return ResponseEntity.ok().build();
	}
	
	@DeleteMapping("/baja-cliente/{documentoIdentidad}")
	public ResponseEntity<?> deleteOne(@PathVariable String documentoIdentidad){
		Cliente cliente = clienteServ.findByDocumentoIdentidad(documentoIdentidad);
		
		clienteServ.deleteOne(cliente.getIdUsuario());
		
		return ResponseEntity.ok().build();
	}
	
	
	

}
