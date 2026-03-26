package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.enumerados.EstadoReserva;
import apirest.domaine.modelo.enumerados.EstadoUsuario;
import apirest.domaine.modelo.repository.ClienteRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class ClienteServiceImplDataJpaMy8 implements ClienteService{

	@Autowired
	private ClienteRepository clienteRepo;
	
	//para que save() lo trate como una entidad nueva, porque al asignarle un id manual en el rest
	//del usuarioLogin, problema que hibernate lo trata como un update porque al interpreta que al 
	//tener un id, existe. em va para el insertOne()
	@PersistenceContext
	private EntityManager em;

	@Override
	public Cliente findById(Long atributoId) {
		if (atributoId == null || atributoId <= 0)
			throw new RuntimeException("El Id es incorrecto.");
		
		Cliente cliente = clienteRepo.findById(atributoId).orElse(null);
			
		return clienteRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<Cliente> findAll() {
		return clienteRepo.findAll();
	}

	@Override
	@Transactional //necesita esto para poder usar el EntityManager
	public Cliente insertOne(Cliente entidad) {
		
		if (entidad == null)
			throw new RuntimeException("El cliente no puede ser nulo.");
		
		if (entidad.getIdUsuario() == null || entidad.getIdUsuario() <= 0) {
		    throw new RuntimeException("El Id de usuario es obligatorio.");
		}
		
		if(clienteRepo.existsById(entidad.getIdUsuario()))
			throw new RuntimeException ("El cliente ya esta registrado.");
	
		
		entidad.setEstado(EstadoUsuario.ACTIVO);
		
		em.persist(entidad); //EntityManager
		
		return clienteRepo.save(entidad);
			
	}

	@Override
	public Cliente updateOne(Cliente entidad) {
		
		if (entidad == null) {
			throw new RuntimeException("El cliente no puede ser nulo.");
		}
		
	    if (entidad.getIdUsuario() == null || entidad.getIdUsuario() <= 0) {
	        throw new RuntimeException("El Id de usuario es obligatorio.");
	    }
	    
				
		return clienteRepo.save(entidad);
	}

	@Override
	public int deleteOne(Long atributoId) {
		if (!clienteRepo.existsById(atributoId)) {
				return 0;
			}	
		
		clienteRepo.deleteById(atributoId);

		return 1;
	}

	@Override
	public Cliente findByDocumentoIdentidad(String documentoIdentidad) {
		if (clienteRepo.findByDocumentoIdentidad(documentoIdentidad)==null)
			throw new RuntimeException("No se encuentra cliente con este documento.");
		
		return clienteRepo.findByDocumentoIdentidad(documentoIdentidad);
	}

	@Override
	public boolean perfilCompleto(Long idUsuario) {
		if (idUsuario == null || idUsuario <= 0) {
			throw new RuntimeException("Id de usuario incorrecto.");
		}
		
		return clienteRepo.existsById(idUsuario);
	}

	@Override
	public Cliente misDatos(Long idUsuario) {
	    if (idUsuario == null || idUsuario <= 0) {
	        throw new RuntimeException("Id de usuario incorrecto.");
	    }
	    //no tiene RuntimeException cuando cliente == null, para asi React pinte el formulario vacio

	    return clienteRepo.findById(idUsuario).orElse(null);
	}

	
}
