package apirest.domaine.modelo.dto;

import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.entities.Direccion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ClienteAltaDto {

	private String documentoIdentidad;
	private String nombre;
	private String primerApellido;
	private String segundoApellido;
	private String telefono;
	private String email;
	private DireccionDto direccion;
	
	
	public static Cliente convertToEntity (ClienteAltaDto dto) {
		Direccion direccion = new Direccion();
		Cliente cliente = new Cliente();
		
		direccion.setCalle(dto.direccion.getCalle());
		direccion.setCodigoPostal(dto.direccion.getCodigoPostal());
		direccion.setLocalidad(dto.direccion.getLocalidad());
		direccion.setNumero(dto.direccion.getNumero());
		
		cliente.setDireccion(direccion);
		cliente.setDocumentoIdentidad(dto.getDocumentoIdentidad());
		cliente.setNombre(dto.getNombre());
		cliente.setPrimerApellido(dto.getPrimerApellido());
		cliente.setSegundoApellido(dto.getSegundoApellido());
		cliente.setTelefono(dto.getTelefono());
		
		return cliente;
	}
	
}
