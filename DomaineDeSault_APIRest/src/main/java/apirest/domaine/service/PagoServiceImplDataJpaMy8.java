package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.Pago;
import apirest.domaine.modelo.repository.PagoRepository;

@Service
public class PagoServiceImplDataJpaMy8 implements PagoService{

	@Autowired
	private PagoRepository pagoRepo;

	@Override
	public Pago findById(Long atributoId) {
		return pagoRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<Pago> findAll() {
		return pagoRepo.findAll();
	}

	@Override
	public Pago insertOne(Pago entidad) {
		return pagoRepo.save(entidad);
	}

	@Override
	public Pago updateOne(Pago entidad) {
		if (!pagoRepo.existsById(entidad.getIdPago())) {
			return null;
		}
		return pagoRepo.save(entidad);
	}

	@Override
	public int deleteOne(Long atributoId) {
		if (pagoRepo.existsById(atributoId)) {
			pagoRepo.deleteById(atributoId);
			return 1;
		}
		return 0;
	}

	
}
