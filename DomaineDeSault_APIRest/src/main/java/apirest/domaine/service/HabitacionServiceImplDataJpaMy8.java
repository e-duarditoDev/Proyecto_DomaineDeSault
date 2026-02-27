package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.Habitacion;
import apirest.domaine.modelo.repository.HabitacionRepository;

@Service
public class HabitacionServiceImplDataJpaMy8 implements HabitacionService{

	@Autowired
	private HabitacionRepository habitacionRepo;

	@Override
	public Habitacion findById(Long atributoId) {
		return habitacionRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<Habitacion> findAll() {
		return habitacionRepo.findAll();
	}

	@Override
	public Habitacion insertOne(Habitacion entidad) {
		return habitacionRepo.save(entidad);
	}

	@Override
	public Habitacion updateOne(Habitacion entidad) {
		if (!habitacionRepo.existsById(entidad.getIdHabitacion())) {
			return null;
		}
		return habitacionRepo.save(entidad);
	}

	@Override
	public int deleteOne(Long atributoId) {
		if (habitacionRepo.existsById(atributoId)) {
			habitacionRepo.deleteById(atributoId);
			return 1;
		}
		return 0;
	}
	

	
}
