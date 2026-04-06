package apirest.domaine.restcontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apirest.domaine.modelo.dto.HabitacionDto;
import apirest.domaine.modelo.dto.ReservaIdHabitacionFechasDto;
import apirest.domaine.modelo.entities.Habitacion;
import apirest.domaine.service.HabitacionService;
import apirest.domaine.service.ReservaService;

@RestController
@RequestMapping("/api/habitacion")
public class HabitacionRestController {

    @Autowired
    private HabitacionService habitacionServ;

    @Autowired
    private ReservaService reservaServ;
    
    @GetMapping ("/todas")
    public ResponseEntity<?> findAll (){
    	List<Habitacion> listaHabitaciones = habitacionServ.findAll();
    	
    	if (listaHabitaciones.isEmpty())
    		return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No hay datos que recuperar.");
    	
    	List <HabitacionDto> listaDto = listaHabitaciones
    			.stream()
    			.map(habitacion -> HabitacionDto.convertToDto(habitacion))//Forma Lambda
    			//.map(HabitacionDto::convertToDto) //Forma Lambda abreviada
    			.toList();
    	
    	return ResponseEntity.ok(listaDto);
    }

    @GetMapping ("/info/{idHabitacion}")
    public ResponseEntity<?> findById (@PathVariable Long idHabitacion) {
    	
        Habitacion habitacion = habitacionServ.findById(idHabitacion);

        if(habitacion == null)
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encuentran datos con con el Id "+idHabitacion+".");
        
        return ResponseEntity.status(HttpStatus.OK).body(HabitacionDto.convertToDto(habitacion));
    }

    // Fechas ocupadas de una habitación concreta (para bloquear en el calendario)
    @GetMapping("/disponibilidad/{idHabitacion}")
    public ResponseEntity<?> getFechasOcupadasPorHabitacion(@PathVariable Long idHabitacion) {
        List<ReservaIdHabitacionFechasDto> fechas = reservaServ.getFechasOcupadasPorHabitacion(idHabitacion);
        return ResponseEntity.ok(fechas);
    }

    // Fechas ocupadas de TODAS las habitaciones (para disponibilidad general)
    @GetMapping("/disponibilidad/todas")
    public ResponseEntity<?> getTodasFechasOcupadas() {
        List<ReservaIdHabitacionFechasDto> fechas = reservaServ.getTodasFechasOcupadas();
        return ResponseEntity.ok(fechas);
    }


}
