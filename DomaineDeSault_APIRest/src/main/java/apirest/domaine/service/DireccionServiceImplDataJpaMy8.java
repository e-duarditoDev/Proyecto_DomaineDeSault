package apirest.domaine.service;

import java.util.List;


import org.hibernate.boot.model.naming.IllegalIdentifierException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.Direccion;
import apirest.domaine.modelo.repository.DireccionRepository;

@Service
public class DireccionServiceImplDataJpaMy8 implements DireccionService{


	@Autowired
	private DireccionRepository direccRepo;

	@Override
	public Direccion findById(Long atributoId) {
		if (atributoId == null || atributoId <= 0)
			throw new RuntimeException("El Id de la direccion es incorrecto.");
		
		Direccion direccion = direccRepo.findById(atributoId).orElse(null);
		
		if (direccion == null)
			throw new RuntimeException("No se encuentras datos.");
			
		return direccion;
	}

	@Override
	public List<Direccion> findAll() {
		return direccRepo.findAll();
	}

	@Override
	public Direccion insertOne(Direccion entidad) {
		if (entidad == null)
			throw new RuntimeException("La direccion no puede ser nula.");
		
		if (direccRepo.existsById(entidad.getIdDireccion()))
			throw new IllegalIdentifierException ("El cliente ya ha registrado la direccion.");
			
		return direccRepo.save(entidad);
	}

	@Override
	public Direccion updateOne(Direccion entidad) {
		if (entidad == null)
			throw new RuntimeException("La direccion no puede ser nula.");
		return direccRepo.save(entidad);
	}

	@Override
	public int deleteOne(Long atributoId) {
		if (atributoId == null || atributoId <= 0) {
			return 0;
				}
				
		direccRepo.deleteById(atributoId);
		return 1;
	}

	
	
}
