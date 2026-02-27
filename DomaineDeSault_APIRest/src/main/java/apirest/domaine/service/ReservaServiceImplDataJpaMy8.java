package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.Reserva;
import apirest.domaine.modelo.repository.ReservaRepository;

@Service
public class ReservaServiceImplDataJpaMy8 implements ReservaService{

	@Autowired
	private ReservaRepository reservaRepo;

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

	
}
