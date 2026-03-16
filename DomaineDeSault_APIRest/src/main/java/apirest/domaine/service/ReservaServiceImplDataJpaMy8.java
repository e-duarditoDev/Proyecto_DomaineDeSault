package apirest.domaine.service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.entities.Habitacion;
import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.entities.ReservaHabitacion;
import apirest.domaine.modelo.entities.ReservaHabitacionId;
import apirest.domaine.modelo.enumerados.EstadoHabitacion;
import apirest.domaine.modelo.enumerados.EstadoReserva;
import apirest.domaine.modelo.repository.ClienteRepository;
import apirest.domaine.modelo.repository.HabitacionRepository;
import apirest.domaine.modelo.repository.ReservaHabitacionRepository;
import apirest.domaine.modelo.repository.ReservaRepository;

@Service
public class ReservaServiceImplDataJpaMy8 implements ReservaService{

	@Autowired
	private ReservaRepository reservaRepo;
	
	@Autowired
	private ClienteRepository clienteRepo;
	
	@Autowired
	private HabitacionRepository habitacionRepo;
	
	@Autowired
	private ReservaHabitacionRepository reservaHabitacionRepo;

	@Override
	public Reserva findById(Long atributoId) {
		return reservaRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<Reserva> findAll() {
		return reservaRepo.findAll();
	}

	@Override
	public Reserva insertOne(Reserva entidad) {
		return reservaRepo.save(entidad);
	}

	@Override
	public Reserva updateOne(Reserva entidad) {
		if (!reservaRepo.existsById(entidad.getIdReserva())) {
			return null;
		}
		return reservaRepo.save(entidad);
	}

	@Transactional
	@Override
	public int deleteOne(Long atributoId) {
		if (reservaRepo.existsById(atributoId)) {
			reservaRepo.deleteById(atributoId);
			return 1;
		}
		return 0;
	}


	@Override
	public Reserva crearReserva(ReservaRequestDto dto, Long idCliente) {
		
		Cliente cliente = clienteRepo.findById(idCliente)
				.orElseThrow(() -> new RuntimeException("Cliente no registrado."));
		
		Habitacion habitacion = habitacionRepo.findById(dto.getIdHabitacion())
				.orElseThrow(() -> new RuntimeException("Habitacion no encontrada."));
			
		
	    if (dto.getFechaEntrada() == null || dto.getFechaSalida() == null) {
	        throw new RuntimeException("Las fechas son obligatorias.");
	    }

	    //Si afirmativo isBefore coge este camino cuando LAS FECHAS SON IGUALES
	    if (!dto.getFechaSalida().isAfter(dto.getFechaEntrada())) { 
	        throw new RuntimeException("La fecha de salida debe ser posterior a la fecha de entrada.");
	    }
	    
//	    //no se necesita porque los huespedes se seleccionan mediante Select
//	    if (dto.getNumHuespedes() < 1) {
//	    	throw new RuntimeException("El numero de huespedes debe ser mayor a 0.");
//	    }
	    
	    
//		EstadoReserva estadoReserva = "PAGAR".equalsIgnoreCase(dto.getAccion()) //"PAGAR" se interpreta como String
//		? EstadoReserva.CONFIRMADA : EstadoReserva.PENDIENTE; //Operador ternario, condicion ternaria si getAccion() es igual a PAGAR entonces CONFIRMADA	    
	    
	    
	    //Definicion de estados
		EstadoReserva estadoReserva;
		EstadoHabitacion estadoHabitacion;

		if (dto.getAccion().equalsIgnoreCase("pagar")){
			estadoReserva = EstadoReserva.CONFIRMADA;
			estadoHabitacion = EstadoHabitacion.OCUPADA;
		} else {
			estadoReserva = EstadoReserva.PENDIENTE;
			estadoHabitacion = EstadoHabitacion.PRERESERVA;
		}
		
		
		//Busca las reservas no estan pendientes de pagar, regla negocio: si esta pagada no se puede modificar
		Reserva reserva = reservaRepo.findByClienteIdUsuarioAndFechaEntradaAndFechaSalidaAndEstado(
				idCliente,
				dto.getFechaEntrada(),
				dto.getFechaSalida(),
				EstadoReserva.PENDIENTE
				).orElse(null);
		
		//Calculo del precio total (precio habitacion * nro noches)
		long noches = ChronoUnit.DAYS.between(dto.getFechaEntrada(), dto.getFechaSalida()); //obtiene numero de dias entre fechas
        BigDecimal precioTotal = habitacion.getPrecioNoche().multiply(BigDecimal.valueOf(noches)); //getPrecioNoche devuelve BigDecimal, valueOf convierte noches a BigDecimal		
				
		if (reserva == null) {
			
			Reserva reservaNueva = new Reserva();
			reservaNueva.setCliente(cliente);
			reservaNueva.setEstado(estadoReserva);
			reservaNueva.setFechaEntrada(dto.getFechaEntrada());
			reservaNueva.setFechaSalida(dto.getFechaSalida());
			reservaNueva.setNumHuespedes(dto.getNumHuespedes());
			reservaNueva.setPrecioTotal(precioTotal);
			
			habitacion.setEstado(estadoHabitacion);
			
			reserva = reservaRepo.save(reservaNueva);
			habitacionRepo.save(habitacion);
		} else {
			
			//Si ya existia reserva no pagada, se puede modificar 
		    boolean existe = reservaHabitacionRepo.existsByReservaHabitacionIdIdReservaAndReservaHabitacionIdIdHabitacion(
                    reserva.getIdReserva(),
                    habitacion.getIdHabitacion()
		    		);

		    if (existe) {
		    	throw new RuntimeException("La habitación ya ha sido reservada.");
		    }
		    
		    //Verificar si se supera la capacidad de la habitacion
		    int huespedesActuales = reserva.getNumHuespedes();
		    int huespedesNuevos = dto.getNumHuespedes();
		    int totalHuespedes = huespedesActuales + huespedesNuevos;
		    	
		    if (totalHuespedes > habitacion.getCapacidad()) 
		    	throw new RuntimeException("El numero de huespedes supera la capacidad de la habitacion.");
		    	
		    //Asignacion de nuevos valores valores
		    reserva.setNumHuespedes(totalHuespedes);
		    reserva.setPrecioTotal(reserva.getPrecioTotal().add(precioTotal));//add es un metodo de BigDecimal
		    reserva.setEstado(estadoReserva);
		    habitacion.setEstado(estadoHabitacion);


		    reserva = reservaRepo.save(reserva);
		    habitacionRepo.save(habitacion);
			
		}
		
		
		//reserva al ser .orElse(null) Spring entiende que es posible reserva venga null y marcaba un warning 
		//si por alguna razon llega aqui siendo reserva null, no generar un nullpointerException en la instancia de ReservaHabitacionId
		if (reserva == null) {
		    throw new RuntimeException("Error: la reserva no existe.");
		}

		//crear la id de la clave compuesta de la tabla intermadia
	    ReservaHabitacionId id = new ReservaHabitacionId(
	            reserva.getIdReserva(), // aqui marcaba el warning 
	            habitacion.getIdHabitacion()
	    );
	    
	    //registro en tabla intermedia
	    ReservaHabitacion reservaHabitacion = new ReservaHabitacion();
	    reservaHabitacion.setReservaHabitacionId(id);
	    reservaHabitacion.setReserva(reserva);
	    reservaHabitacion.setHabitacion(habitacion);

	    reservaHabitacionRepo.save(reservaHabitacion);
			
		return reserva;
	}

	
}
