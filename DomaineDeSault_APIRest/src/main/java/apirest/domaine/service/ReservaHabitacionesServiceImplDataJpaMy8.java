package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.ReservaHabitacion;
import apirest.domaine.modelo.entities.ReservaHabitacionId;
import apirest.domaine.modelo.repository.HabitacionRepository;
import apirest.domaine.modelo.repository.ReservaHabitacionRepository;
import apirest.domaine.modelo.repository.ReservaRepository;

@Service
public class ReservaHabitacionesServiceImplDataJpaMy8 implements ReservaHabitacionesService{

	@Autowired
	private ReservaHabitacionRepository resHabitacionesRepo;
	
	@Autowired
	private ReservaRepository reservaRepo;
	
	@Autowired
	private HabitacionRepository habitaconRepository;
	
	@Override
	public ReservaHabitacion findById(ReservaHabitacionId atributoId) {
		if (atributoId == null)
			throw new RuntimeException("No hay datos de la habitacion.");
		
		if (atributoId.getIdHabitacion() == null)
			throw new RuntimeException("El Id de la habitacion no puede ser nulo.");
		
		if (atributoId.getIdReserva() == null)
			throw new RuntimeException("El Id de la resreva no puede ser nulo.");

		return null;
	}

	@Override
	public List<ReservaHabitacion> findAll() {
		return resHabitacionesRepo.findAll();
	}

	@Override
	public ReservaHabitacion insertOne(ReservaHabitacion entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ReservaHabitacion updateOne(ReservaHabitacion entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int deleteOne(ReservaHabitacionId atributoId) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public List <ReservaHabitacion> findByReservaIdReserva(Long idReserva) {
	
		return resHabitacionesRepo.findByReservaIdReserva(idReserva);
	}


	
}
