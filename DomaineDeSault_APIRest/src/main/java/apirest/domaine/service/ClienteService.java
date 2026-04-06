package apirest.domaine.service;

import java.util.List;

import apirest.domaine.modelo.dto.MiReservaDto;
import apirest.domaine.modelo.entities.Cliente;

public interface ClienteService extends IntCrudGenerico<Cliente, Long>{
	Cliente findByDocumentoIdentidad(String documentoIdentidad);
	
	boolean perfilCompleto (Long idUsuario);
	
	Cliente misDatos (Long idUsuario);
	
	List <MiReservaDto> misReservas (Long idUsuario);
	
}
