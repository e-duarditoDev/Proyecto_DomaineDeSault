package apirest.domaine.modelo.dto;

import java.time.LocalDate;

import apirest.domaine.modelo.entities.Cliente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ClienteDto {

	private Long idCliente;
	private String nombre;
	private String primerApellido;
	private String segundoApellido;
	private String telefono;
	private String email;
	private LocalDate fechaRegistro;
	private DireccionDto direccion;
	
	public static ClienteDto convertToDto (Cliente cliente) {
		ClienteDto clienteDto = new ClienteDto();
		DireccionDto direccionDto = new DireccionDto();
		
		clienteDto.setNombre(cliente.getNombre());
		clienteDto.setPrimerApellido(cliente.getPrimerApellido());
		clienteDto.setSegundoApellido(cliente.getSegundoApellido());
		clienteDto.setTelefono(cliente.getTelefono());
		
		
		direccionDto.setCalle(cliente.getDireccion().getCalle());
		direccionDto.setCodigoPostal(cliente.getDireccion().getCodigoPostal());
		direccionDto.setLocalidad(cliente.getDireccion().getLocalidad());
		direccionDto.setNumero(cliente.getDireccion().getNumero());
		
		clienteDto.setDireccion(direccionDto);
		
		return clienteDto;
	}
	
}
