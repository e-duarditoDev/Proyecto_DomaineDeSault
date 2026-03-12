package apirest.domaine.restcontroller;


import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.service.ClienteService;
import apirest.domaine.service.ReservaHabitacionesService;
import apirest.domaine.service.ReservaService;
import apirest.domaine.service.ReservaServiciosService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/reserva")
public class ReservasRestController {
	
	@Autowired
	private ClienteService clienteServ;
	
	@Autowired
	private ReservaService resServ;
	
	@Autowired
	private ReservaServiciosService resServiciosServ;
	
	@Autowired
	private ReservaHabitacionesService resHabitacionesServ;
	
	
	@PostMapping("/reservar-habitacion")
	public ResponseEntity<?> reservarHabitacion (@RequestBody ReservaRequestDto reservaDto,
													Authentication auth) {

		
		
		return null;
		
	}
}
