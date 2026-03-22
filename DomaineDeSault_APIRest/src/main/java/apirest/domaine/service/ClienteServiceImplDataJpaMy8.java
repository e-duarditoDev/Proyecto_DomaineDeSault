package apirest.domaine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.enumerados.EstadoUsuario;
import apirest.domaine.modelo.repository.ClienteRepository;

@Service
public class ClienteServiceImplDataJpaMy8 implements ClienteService{

	@Autowired
	private ClienteRepository clienteRepo;

	@Override
	public Cliente findById(Long atributoId) {
		if (atributoId == null || atributoId <= 0)
			throw new RuntimeException("El Id es incorrecto.");
		
		Cliente cliente = clienteRepo.findById(atributoId).orElse(null);
		
		if (cliente == null)
			throw new RuntimeException("No se han podido recuperar datos del usuario.");
			
		return clienteRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<Cliente> findAll() {
		return clienteRepo.findAll();
	}

	@Override
	public Cliente insertOne(Cliente entidad) {
		
		if (entidad == null)
			throw new RuntimeException("El cliente no puede ser nulo.");
		
		if (entidad.getIdUsuario() == null || entidad.getIdUsuario() <= 0) {
		    throw new RuntimeException("El Id de usuario es obligatorio.");
		}
		
		if(clienteRepo.existsById(entidad.getIdUsuario()))
			throw new RuntimeException ("El cliente ya esta registrado.");
	
		
		entidad.setEstado(EstadoUsuario.ACTIVO);
		
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
