package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.Servicio;
import apirest.domaine.modelo.repository.ServicioRepository;

@Service
public class ServicioServiceImplDataJpaMy8 implements ServicioService{

	@Autowired
	private ServicioRepository serviRepo;

	@Override
	public Servicio findById(Long atributoId) {
		return serviRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<Servicio> findAll() {
		return serviRepo.findAll();
	}

	@Override
	public Servicio insertOne(Servicio entidad) {
		return serviRepo.save(entidad);
	}

	@Override
	public Servicio updateOne(Servicio entidad) {
		if (!serviRepo.existsById(entidad.getIdServicio())) {
			return null;
		}
		
		return serviRepo.save(entidad);
	}

	@Override
	public int deleteOne(Long atributoId) {

		if(serviRepo.existsById(atributoId)) {
			serviRepo.deleteById(atributoId);
			return 1;
		}
		return 0;
	}





	
}
