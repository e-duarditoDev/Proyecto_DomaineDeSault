package apirest.domaine.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.repository.ClienteRepository;
import apirest.domaine.modelo.repository.UsuarioRepository;

@Service
public class ClienteServiceImplDataJpaMy8 implements ClienteService{


	@Autowired
	private ClienteRepository clienteRepo;
	
	@Autowired
	private UsuarioRepository usuarioRepo;

	@Override
	public Cliente findById(Long atributoId) {
		return clienteRepo.findById(atributoId).orElse(null);
	}

	@Override
	public List<Cliente> findAll() {
		return clienteRepo.findAll();
	}

	@Override
	public Cliente insertOne(Cliente entidad) {
		
		if(clienteRepo.existsByDocumentoIdentidad(entidad.getDocumentoIdentidad()))
			throw new IllegalStateException("El cliente ya esta dado de alta");
		
		entidad.setFechaRegistro(LocalDate.now());
		
			return clienteRepo.save(entidad);
	}

	@Override
	public Cliente updateOne(Cliente entidad) {
		if (!clienteRepo.existsById(entidad.getIdUsuario())) {
			return null;
		}
		return clienteRepo.save(entidad);
	}

	@Override
	public int deleteOne(Long atributoId) {
		if (!clienteRepo.existsById(atributoId)) {
				throw new IllegalStateException("No existe el cliente.");
			}	
		
		clienteRepo.deleteById(atributoId);

		return 1;
	}

	@Override
	public Cliente findByDocumentoIdentidad(String documentoIdentidad) {
		if (clienteRepo.findByDocumentoIdentidad(documentoIdentidad)==null)
			throw new IllegalStateException("No se encuentra cliente con este documento.");
		
		return clienteRepo.findByDocumentoIdentidad(documentoIdentidad);
	}

	
}
