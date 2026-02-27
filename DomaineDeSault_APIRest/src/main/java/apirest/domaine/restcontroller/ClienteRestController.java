package apirest.domaine.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apirest.domaine.modelo.dto.ClienteAltaDto;
import apirest.domaine.modelo.dto.ClienteDto;
import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.service.ClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteRestController {
	
	@Autowired
	private ClienteService clienteServ;

	
	@GetMapping("/test")
	public List <Cliente> todosObjeto() {
		return  clienteServ.findAll();
	}
	
	
	@GetMapping("/")
	public ResponseEntity<List<ClienteDto>>  todosDto() {
		List <Cliente> lista = clienteServ.findAll();
		return ResponseEntity.ok(lista.stream()
				.map(l -> ClienteDto.convertToDto(l))
				.toList()
				);
	}
	
	@GetMapping("/buscar-id/{id}")
	public ResponseEntity<?> uno(@PathVariable Long idCLiente) {
		Cliente cliente = clienteServ.findById(idCLiente);
		
		if(cliente == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Id de cliente incorrecto.");
		}
		
		return ResponseEntity.ok(ClienteDto.convertToDto(cliente));
	}
	
	@PostMapping("/alta-cliente")
	public ResponseEntity<?> inserOne(@RequestBody ClienteAltaDto clienteDto){
		
		clienteServ.insertOne(ClienteAltaDto.convertToEntity(clienteDto));
		
		return ResponseEntity.ok().build();
	}
	
	@DeleteMapping("/baja-cliente/{documentoIdentidad}")
	public ResponseEntity<?> deleteOne(@PathVariable String documentoIdentidad){
		Cliente cliente = clienteServ.findByDocumentoIdentidad(documentoIdentidad);
		
		clienteServ.deleteOne(cliente.getIdUsuario());
		
		return ResponseEntity.ok().build();
	}
	

}
