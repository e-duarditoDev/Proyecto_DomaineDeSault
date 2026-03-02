package seguridad.service;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.model.entity.VerificacionMail;
import seguridad.model.repository.VerificacionMailRepository;

@Service
public class VerificacionMailServiceImplDataJpaMy8 implements VerificacionMailService{

	@Autowired
	private VerificacionMailRepository veriRepo;
	
	//verificar si usuario ya registrado
	@Override
	public boolean existsByEmail(String mail) {
		if (veriRepo.existsByEmail(mail))
			return true;
		
		return false;
	}
	
	@Override
	public Optional<VerificacionMail> findByToken(String token) {
		VerificacionMail vm = veriRepo.findByToken(token).orElse(null);
		
		return Optional.of(vm);
	}

	@Override
	public VerificacionMail findById(Long atributoId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<VerificacionMail> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public VerificacionMail insertOne(VerificacionMail entidad) {
		return veriRepo.save(entidad);
	}

	@Override
	public VerificacionMail updateOne(VerificacionMail entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int deleteOne(Long atributoId) {
		veriRepo.deleteById(atributoId);
		return 0;
	}



}
