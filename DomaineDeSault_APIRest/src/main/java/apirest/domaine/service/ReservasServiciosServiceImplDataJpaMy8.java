package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.ReservaServicioId;
import apirest.domaine.modelo.entities.ReservaServicio;
import apirest.domaine.modelo.repository.ReservasServiciosRepository;

@Service
public class ReservasServiciosServiceImplDataJpaMy8 implements ReservasServiciosService{

	@Autowired
	private ReservasServiciosRepository reservasRepo;

	@Override
	public ReservaServicio findById(ReservaServicioId atributoId) {
		return reservasRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<ReservaServicio> findAll() {
		return reservasRepo.findAll();
	}

	@Override
	public ReservaServicio insertOne(ReservaServicio entidad) {
		return reservasRepo.save(entidad);
	}

	@Override
	public ReservaServicio updateOne(ReservaServicio entidad) {
		if (!reservasRepo.existsById(entidad.getIdResevasServicios())) {
			return null;
		}
		
		return reservasRepo.save(entidad);
	}

	@Override
	public int deleteOne(ReservaServicioId atributoId) {

		if(reservasRepo.existsById(atributoId)) {
			reservasRepo.deleteById(atributoId);
			return 1;
		}
		return 0;
	}



	
}
