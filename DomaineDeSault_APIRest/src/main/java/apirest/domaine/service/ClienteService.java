package apirest.domaine.service;

import apirest.domaine.modelo.entities.Cliente;

public interface ClienteService extends IntCrudGenerico<Cliente, Long>{
	Cliente findByDocumentoIdentidad(String documentoIdentidad);

}
