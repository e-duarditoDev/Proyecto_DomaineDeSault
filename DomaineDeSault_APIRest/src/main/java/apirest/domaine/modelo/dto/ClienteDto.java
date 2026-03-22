package apirest.domaine.modelo.dto;

import java.time.LocalDate;

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
public class ClienteDto {

	private Long idUsuario;
	private String documentoIdentidad;
	private String nombre;
	private String primerApellido;
	private String segundoApellido;
	private String telefono;
	private DireccionDto direccionDto;
	private LocalDate fechaAlta;
	
	public static ClienteDto convertToDto (Cliente cliente) {
		ClienteDto clienteDto = new ClienteDto();
		DireccionDto direccionDto = new DireccionDto();
		
		
		direccionDto.setCalle(cliente.getDireccion().getCalle());
		direccionDto.setCodigoPostal(cliente.getDireccion().getCodigoPostal());
		direccionDto.setLocalidad(cliente.getDireccion().getLocalidad());
		direccionDto.setNumero(cliente.getDireccion().getNumero());
		direccionDto.setProvincia(cliente.getDireccion().getProvincia());
		
		clienteDto.setIdUsuario(cliente.getIdUsuario());
		clienteDto.setDocumentoIdentidad(cliente.getDocumentoIdentidad());
		clienteDto.setNombre(cliente.getNombre());
		clienteDto.setPrimerApellido(cliente.getPrimerApellido());
		clienteDto.setSegundoApellido(cliente.getSegundoApellido());
		clienteDto.setTelefono(cliente.getTelefono());
		clienteDto.setDireccionDto(direccionDto);
		clienteDto.setFechaAlta(cliente.getFechaAlta());
		
		return clienteDto;
	}
	
	public static Cliente convertToEntity (ClienteDto dto) {
		Cliente cliente = new Cliente();
		Direccion direccion = new Direccion();
		
		direccion.setCalle(dto.getDireccionDto().getCalle());
		direccion.setCodigoPostal(dto.getDireccionDto().getCodigoPostal());
		direccion.setLocalidad(dto.getDireccionDto().getLocalidad());
		direccion.setNumero(dto.getDireccionDto().getNumero());
		direccion.setProvincia(dto.getDireccionDto().getProvincia());
		
		cliente.setDocumentoIdentidad(dto.getDocumentoIdentidad());
		cliente.setNombre(dto.getNombre());
		cliente.setPrimerApellido(dto.getPrimerApellido());
		cliente.setSegundoApellido(dto.getSegundoApellido());
		cliente.setTelefono(dto.getTelefono());
		cliente.setDireccion(direccion);
		direccion.setUsuario(cliente);//para mapear que la direccion pertenece al usuario, la relacion queda sincronizada ambos lados
		
		return cliente;
	}
	
}
