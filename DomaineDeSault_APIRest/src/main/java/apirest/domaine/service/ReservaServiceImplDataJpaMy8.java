package apirest.domaine.service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import apirest.domaine.modelo.dto.ReservaRequestDto;
import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.entities.Habitacion;
import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.entities.ReservaHabitacion;
import apirest.domaine.modelo.entities.ReservaHabitacionId;
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
	private HabitacionRepository roomRepo;
	
	@Autowired
	private ReservaHabitacionRepository reservaRoomRepo;

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
		
		Habitacion habitacion = roomRepo.findById(dto.getIdHabitacion())
				.orElseThrow(() -> new RuntimeException("Habitacion no encontrada."));
			
		
	    if (dto.getFechaEntrada() == null || dto.getFechaSalida() == null) {
	        throw new RuntimeException("Las fechas son obligatorias.");
	    }

	    if (!dto.getFechaSalida().isBefore(dto.getFechaEntrada())) {
	        throw new RuntimeException("La fecha de salida debe ser posterior a la fecha de entrada.");
	    }
	    
	    if (dto.getNumHuespedes() < 1) {
	    	throw new RuntimeException("El numero de huespedes debe ser mayor a 0.");
	    }
	    
//		EstadoReserva estadoReserva = "PAGAR".equalsIgnoreCase(dto.getAccion()) //"PAGAR" se interpreta como String
//		? EstadoReserva.CONFIRMADA : EstadoReserva.PENDIENTE; //Operador ternario, condicion ternaria si getAccion() es igual a PAGAR entonces CONFIRMADA	    
	    
	    
		EstadoReserva estadoReserva;
		
		if (dto.getAccion().equalsIgnoreCase("pagar")){
			estadoReserva = EstadoReserva.CONFIRMADA;
		} else {
			estadoReserva = EstadoReserva.PENDIENTE;
		}
		
		//Busca las reservas no estan pendientes de pagar, segun el negocio, si no esta pagada se puede agnadir mas habitaciones a la reserva
		Reserva reserva = reservaRepo.findByClienteIdUsuarioAndFechaEntradaAndFechaSalidaAndEstadoReserva(
				idCliente,
				dto.getFechaEntrada(),
				dto.getFechaSalida(),
				EstadoReserva.PENDIENTE
				).orElse(null);
		
		long noches = ChronoUnit.DAYS.between(dto.getFechaEntrada(), dto.getFechaSalida()); //obtiene numero de dias entre fechas
        BigDecimal precioTotal = habitacion.getPrecioNoche().multiply(BigDecimal.valueOf(noches)); //getPrecioNoche devuelve BigDecimal, valueOf convierte noches a BigDecimal		
				
		if (reserva == null) {
			
			Reserva reservaNueva = new Reserva();
			reservaNueva.setCliente(cliente);
			reservaNueva.setEstadoReserva(estadoReserva);
			reservaNueva.setFechaEntrada(dto.getFechaEntrada());
			reservaNueva.setFechaSalida(dto.getFechaSalida());
			reservaNueva.setNumHuespedes(dto.getNumHuespedes());
			reservaNueva.setPrecioTotal(precioTotal);
			
			reserva = reservaRepo.save(reservaNueva);
		} 
		
		if (reserva != null) {
			
		    boolean existe = reservaRoomRepo.existsByReservaHabitacionIdIdReservaAndReservaHabitacionIdIdHabitacion(
                    reserva.getIdReserva(),
                    habitacion.getIdHabitacion()
            );

		    if (existe) {
		    	throw new RuntimeException("La habitación ya ha sido reservada.");
		    }

		    reserva.setPrecioTotal(reserva.getPrecioTotal().add(precioTotal));//add es un metodo de BigDecimal

		    if (dto.getNumHuespedes() > 0) {
		    	int huespedesActuales = reserva.getNumHuespedes();
		    	int huespedesNuevos = dto.getNumHuespedes();
		    	int totalHuespedes = huespedesActuales + huespedesNuevos;
		    	
		    	
		    	if (totalHuespedes > habitacion.getCapacidad()) 
		    		throw new RuntimeException("El numero de huespedes supera la capacidad de la habitacion.");
		    	
		    	reserva.setNumHuespedes(totalHuespedes);
		    	
		    }
		    
		    if (dto.getAccion().equalsIgnoreCase("pagar"))
		    	reserva.setEstadoReserva(EstadoReserva.CONFIRMADA);

		    reserva = reservaRepo.save(reserva);
		}
		
		//reserva al ser .orElse(null) Spring entiende que es posible reserva venga null y marcaba un warning 
		//con este if, nos aseguramos no generar un nullpointerException en la instancia de ReservaHabitacionId
		if (reserva == null) {
		    throw new RuntimeException("Error: la reserva no existe.");
		}

		//crear el obteto id de la clave compuesta de la tabla intermadia
	    ReservaHabitacionId id = new ReservaHabitacionId(
	            reserva.getIdReserva(), // aqui marcaba el warning 
	            habitacion.getIdHabitacion()
	    );
	    
	    //registro en tabla intermedia
	    ReservaHabitacion reservaHabitacion = new ReservaHabitacion();
	    reservaHabitacion.setReservaHabitacionId(id);
	    reservaHabitacion.setReserva(reserva);
	    reservaHabitacion.setHabitacion(habitacion);

	    reservaRoomRepo.save(reservaHabitacion);
			
		return reserva;
	}

	
}
