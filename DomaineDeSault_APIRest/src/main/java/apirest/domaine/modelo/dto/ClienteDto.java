package apirest.domaine.modelo.dto;

import java.time.LocalDate;

import apirest.domaine.modelo.entities.Cliente;
import apirest.domaine.modelo.entities.Direccion;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ClienteDto {

	private Long idUsuario;//viene del usuario_login
		
	@NotBlank(message = "Indique un documento de identidad valido.")
	private String documentoIdentidad;

	@NotBlank(message = "Indique un nombre.")
	private String nombre;

	@NotBlank(message = "Indique un primer apellido.")
	private String primerApellido;
	
	private String segundoApellido;//sin validacion porque hay personas tiene 1 apellido
	
	@NotBlank(message = "Indique un telefono.") //NotBlank para String
    private String telefono;

    @NotNull(message = "Indique una direccion.") //NotNull para numeros
    @Valid //Spring comprueba los campos internos de direccion, si no solo comprueba el objeto direccion.
    private DireccionDto direccionDto;
    
	private LocalDate fechaAlta;// viene del usuario_login
	
	//NOTA: Para que las validaciones tengan efecto hay que poner la etiqueta @Valid en el restController reciben un ClienteDto
	
	public static ClienteDto convertToDto (Cliente cliente) {
		ClienteDto clienteDto = new ClienteDto();
		DireccionDto direccionDto = new DireccionDto();
		
		direccionDto.setIdDireccion(cliente.getDireccion().getIdDireccion());
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
		
		direccion.setIdDireccion(dto.getDireccionDto().getIdDireccion());
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
