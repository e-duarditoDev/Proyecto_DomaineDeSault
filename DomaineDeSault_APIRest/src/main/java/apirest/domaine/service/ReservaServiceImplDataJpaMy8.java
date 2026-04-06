
package apirest.domaine.service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.dto.ActualizarHuespedesDto;
import apirest.domaine.modelo.dto.EliminarHabitacionReservaDto;
import apirest.domaine.modelo.dto.ReservaIdHabitacionFechasDto;
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
			throw new RuntimeException("Reserva no encontrada.");
		}		
	    
		return reservaRepo.save(entidad);
	}

	@Override
	public int deleteOne(Long atributoId) {
		if (!reservaRepo.existsById(atributoId)) {
			return 0;
		}
		
		
		reservaRepo.deleteById(atributoId);

		return 1;
	}


	@Override
	public Reserva guardarReserva(ReservaRequestDto reservaRequestDto, Long idCliente) {
		
		
		Cliente cliente = clienteRepo.findById(idCliente)
				.orElseThrow(() -> new RuntimeException("Cliente no registrado."));
		
		Habitacion habitacion = habitacionRepo.findById(reservaRequestDto.getIdHabitacion())
				.orElseThrow(() -> new RuntimeException("Habitacion no encontrada."));
		
	    //Si la habitacion esta en mantenimiento
	    if (habitacion.getEstado() == EstadoHabitacion.MANTENIMIENTO)
	    	throw new RuntimeException("La habitacion se encuentra en mantenimiento.");
		
		
//		//No es necesario porque el front invalida los botones si no hay fechas
//	    if (dto.getFechaEntrada() == null || dto.getFechaSalida() == null) {
//	        throw new RuntimeException("Las fechas son obligatorias.");
//	    }
		

//	    //Si afirmativo isBefore coge este camino cuando LAS FECHAS SON IGUALES
//		//El formulario y calendario evita entrar por aqui
//	    if (!dto.getFechaSalida().isAfter(dto.getFechaEntrada())) { 
//	        throw new RuntimeException("La fecha de salida debe ser posterior a la fecha de entrada.");
//	    }
	    
//	    //no se necesita porque los huespedes se seleccionan mediante Select
//	    if (dto.getNumHuespedes() < 1) {
//	    	throw new RuntimeException("El numero de huespedes debe ser mayor a 0.");
//	    }
		
	    
//		EstadoReserva estadoReserva = "PAGAR".equalsIgnoreCase(dto.getAccion()) //"PAGAR" se interpreta como String
//		? EstadoReserva.CONFIRMADA : EstadoReserva.PENDIENTE; //Operador ternario, condicion ternaria si getAccion() es igual a PAGAR entonces CONFIRMADA	    
	    
	    
	    //Definicion de estados en funciona del boton pulsado
		EstadoReserva estadoReserva;
		EstadoHabitacion estadoHabitacion;

		if (reservaRequestDto.getAccion().equalsIgnoreCase("PAGAR")){
			estadoReserva = EstadoReserva.CONFIRMADA;
			estadoHabitacion = EstadoHabitacion.OCUPADA;
		} else {
			estadoReserva = EstadoReserva.GUARDADA;
			estadoHabitacion = EstadoHabitacion.PRERESERVA;
		}
		
		
		//Busca las reservas esten en estado PENDIENTE, regla negocio: si esta pagada no se puede modificar
		//No buscamos por el idReserva porque el dto del front no conoce el idReserva, puede que ni exista la reserva
		Reserva reserva = reservaRepo.findByClienteIdUsuarioAndFechaEntradaAndFechaSalidaAndEstado(
				idCliente,
				reservaRequestDto.getFechaEntrada(),
				reservaRequestDto.getFechaSalida(),
				EstadoReserva.GUARDADA
				).orElse(null);
		
		
		//Calculo del precio total (precio habitacion * nro noches)
		long noches = ChronoUnit.DAYS.between(reservaRequestDto.getFechaEntrada(), reservaRequestDto.getFechaSalida()); //obtiene numero de dias entre fechas
        BigDecimal precioTotal = habitacion.getPrecioNoche().multiply(BigDecimal.valueOf(noches)); //getPrecioNoche devuelve BigDecimal, multiply es metodo de BigDecimal, valueOf convierte noches a BigDecimal		
				
		if (reserva == null) { //O no existe reserva, o esta en estado CONFIRMADA por lo que pasaria a ser una reserva nueva
			
			
			//Comprobar si hay conflicto de fechas con otras reservas
			List <ReservaIdHabitacionFechasDto> listaHabitacionesPorFecha = reservaRepo.findByHabitacionConFechas(reservaRequestDto.getIdHabitacion());
			for (ReservaIdHabitacionFechasDto habitacionPorFechasDto : listaHabitacionesPorFecha) {
				if (
					reservaRequestDto.getFechaEntrada().isBefore(habitacionPorFechasDto.getFechaSalida()) &&
					reservaRequestDto.getFechaSalida().isAfter(habitacionPorFechasDto.getFechaEntrada()) &&
					habitacionPorFechasDto.getIdHabitacion() == reservaRequestDto.getIdHabitacion()
						)
					throw new RuntimeException("La habitacion no se encuentra disponible en las fechas seleccionadas.");
			}
			
			Reserva reservaNueva = new Reserva();
			reservaNueva.setCliente(cliente);
			reservaNueva.setEstado(estadoReserva);
			reservaNueva.setFechaEntrada(reservaRequestDto.getFechaEntrada());
			reservaNueva.setFechaSalida(reservaRequestDto.getFechaSalida());
			reservaNueva.setNumHuespedes(reservaRequestDto.getNumHuespedes());
			reservaNueva.setPrecioTotal(precioTotal);
			
			habitacion.setEstado(estadoHabitacion);
			
			reserva = reservaRepo.save(reservaNueva);
			habitacionRepo.save(habitacion);
		} else {// se ha encontrado una reserva en estado PENDIENTE, se puede agnadir habitaciones.
			
			//Comprobar si ya tiene la habitacion reservada para las mismas fechas
		    boolean existe = reservaHabitacionRepo.existsByReservaHabitacionIdIdReservaAndReservaHabitacionIdIdHabitacion(
                    reserva.getIdReserva(),
                    habitacion.getIdHabitacion()
		    		);

		    if (existe) {
		    	throw new RuntimeException("Ya ha realizado esta reserva. Consulte sus reservas.");
		    }
		    
		    
		    //Sumar los huespedes nuevos a la reserva
		    int huespedesActuales = reserva.getNumHuespedes();
		    int huespedesNuevos = reservaRequestDto.getNumHuespedes();
		    int totalHuespedes = huespedesActuales + huespedesNuevos;
		    
		    
		    //Asignacion de nuevos valores valores
		    reserva.setNumHuespedes(totalHuespedes);
		    reserva.setPrecioTotal(reserva.getPrecioTotal().add(precioTotal));//add es un metodo de BigDecimal
		    reserva.setEstado(estadoReserva);
			reserva.setFechaEntrada(reservaRequestDto.getFechaEntrada());
			reserva.setFechaSalida(reservaRequestDto.getFechaSalida());
		    habitacion.setEstado(estadoHabitacion);


		    reserva = reservaRepo.save(reserva);
		    habitacionRepo.save(habitacion);
			
		}
		
		
		//reserva al ser .orElse(null) Spring entiende que es posible reserva venga null y marcaba un warning 
		//si por alguna razon llega aqui siendo reserva null, no generar un nullpointerException en la instancia de ReservaHabitacionId
		if (reserva == null) {
		    throw new RuntimeException("Ha ocurrido un error.");
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

	@Override
	public List <Reserva> findByClienteIdUsuario(Long idUsuario) {
		
		if (idUsuario <= 0)
			throw new RuntimeException("Id de busqueda no valido.");
		
		List <Reserva> listaReservas = reservaRepo.findByClienteIdUsuario(idUsuario);
		
		if(listaReservas.isEmpty())
			throw new RuntimeException("No se han recuperado reservas.");
			
		return listaReservas;
	}


	@Override
	public Boolean eliminarHabitacion(EliminarHabitacionReservaDto habitacionDto) {
		
		if (habitacionDto == null) {
			throw new RuntimeException("Ha ocurrido un error. La habitacion es null.");
		}
		
		ReservaHabitacionId id = new ReservaHabitacionId(
				habitacionDto.getIdReserva(),//mismo orden estan en el ReservaHabitacionId
				habitacionDto.getIdHabitacion()
				);
		
		//testing
		//System.out.println("RESULTADO: "+habitacionDto.getIdHabitacion()+"\n"+habitacionDto.getIdReserva());
		
		reservaHabitacionRepo.deleteById(id);
		
		//Obtenermos las reservas para recuperar las noches
		Reserva reserva = reservaRepo.findById(habitacionDto.getIdReserva()).orElse(null);
		
		//Obtener le numero de noches
		long noches = ChronoUnit.DAYS.between(reserva.getFechaEntrada(), reserva.getFechaSalida());
		BigDecimal precioTotal = BigDecimal.ZERO; //inicializar 	
		
		//Recuperamos la lista de habitaciones asociados a la reserva
		List <ReservaHabitacion> listaReservaHabitacion = reservaHabitacionRepo.findByReservaIdReserva(habitacionDto.getIdReserva());
				
		for (ReservaHabitacion rh : listaReservaHabitacion) {
			Habitacion habitacion = habitacionRepo.findById(rh.getHabitacion().getIdHabitacion()).orElse(null);
			
			if (habitacion == null) {
				throw new RuntimeException("No se han recuperado datos de la habitacion.");
			}
			
			//Sumarotio del precio de las habitaciones existentes en la reserva
			precioTotal = precioTotal.add(habitacion.getPrecioNoche().multiply(BigDecimal.valueOf(noches)));
			
		}
		
		//Asignar el nuevo precio
		reserva.setPrecioTotal(precioTotal);
		reserva.setNumHuespedes(habitacionDto.getNumHuespedes());
		
		reservaRepo.save(reserva);
		
		return true;
	}

	@Override
	public Boolean actualizarHuespedes(ActualizarHuespedesDto datosDto) {
		Reserva reserva = reservaRepo.findById(datosDto.getIdReserva()).orElse(null);
		
		if (reserva == null)
			throw new RuntimeException("No se encuentra reserva.");
		
		reserva.setNumHuespedes(datosDto.getNumHuespedes());
		
		reservaRepo.save(reserva);
		
		return true;
	}
	
	
	
}

