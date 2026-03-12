package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.ReservaServicioId;
import apirest.domaine.modelo.entities.ReservaHabitacion;
import apirest.domaine.modelo.entities.ReservaHabitacionId;
import apirest.domaine.modelo.entities.ReservaServicio;
import apirest.domaine.modelo.repository.ReservaHabitacionRepository;
import apirest.domaine.modelo.repository.ReservaServiciosRepository;

@Service
public class ReservaHabitacionesServiceImplDataJpaMy8 implements ReservaHabitacionesService{

	@Autowired
	private ReservaHabitacionRepository resHabitacionesRepo;

	@Override
	public ReservaHabitacion findById(ReservaHabitacionId atributoId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<ReservaHabitacion> findAll() {
		// TODO Auto-generated method stub
		return null;
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


	
}
